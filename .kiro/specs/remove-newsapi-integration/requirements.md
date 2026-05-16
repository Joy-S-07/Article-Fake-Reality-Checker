# Requirements Document

## Introduction

This document specifies the requirements for removing the NewsAPI.org integration from the Article Fake Reality Checker backend and simplifying the search pipeline to use only Serper.dev as the single web search provider. The current system implements a "news-first verification" approach where NewsAPI.org is attempted first, then falls back to Serper.dev if no results are found. This adds unnecessary complexity and an extra API dependency that should be eliminated while maintaining the same API contract and 4-stage pipeline integrity.

## Glossary

- **Scout_Service**: The search agent service responsible for retrieving real-time search results for claims (`app/services/scout.py`)
- **SSE_Route**: Server-Sent Events streaming route that orchestrates the fraud detection pipeline (`app/routes/sse.py`)
- **Image_SSE_Route**: Server-Sent Events streaming route for image reality checking (`app/routes/image_sse.py`)
- **Config_Module**: Application configuration module that manages environment variables and settings (`app/config.py`)
- **NewsAPI**: NewsAPI.org third-party news search service (to be removed)
- **Serper**: Serper.dev Google search API service (to be retained as sole search provider)
- **RAG_Pipeline**: Retrieval-Augmented Generation pipeline consisting of 4 stages: SCOUT → READER → ANALYST → VERDICT
- **News_First_Verification**: Current two-step search strategy that tries NewsAPI first, then falls back to Serper

## Requirements

### Requirement 1: Remove NewsAPI Configuration

**User Story:** As a system administrator, I want NewsAPI configuration removed from the application, so that the system has fewer external dependencies to manage.

#### Acceptance Criteria

1. WHEN inspecting the Settings class in Config_Module, THE Settings class SHALL NOT define a NEWS_API field
2. WHEN inspecting the Config_Module source code, THE Config_Module SHALL NOT reference settings.NEWS_API
3. WHEN inspecting the .env.example file, THE .env.example file SHALL NOT contain a line matching the pattern "NEWS_API"
4. WHEN inspecting the Settings class in Config_Module, THE Settings class SHALL define SERPER_API_KEY field of type Optional[str]
5. WHEN inspecting the Settings class in Config_Module, THE Settings class SHALL define SERPER_ENDPOINT field of type str with default value "https://google.serper.dev/search"
6. WHEN inspecting the Settings class in Config_Module, THE Settings class SHALL define SERPER_NUM_RESULTS field of type int with default value 5

### Requirement 2: Remove NewsAPI Code from Scout Service

**User Story:** As a developer, I want all NewsAPI-related code removed from the Scout service, so that the codebase is simpler and easier to maintain.

#### Acceptance Criteria

1. WHEN inspecting the Scout class methods, THE Scout class SHALL NOT define a method named search_news
2. WHEN inspecting the Scout class properties, THE Scout class SHALL NOT define a property named is_news_available
3. WHEN inspecting the Scout class attributes, THE Scout class SHALL NOT define a class attribute named NEWSAPI_ENDPOINT
4. WHEN inspecting the Scout.__init__ method, THE Scout.__init__ method SHALL NOT assign a value to self.news_api_key
5. WHEN inspecting the Scout class methods, THE Scout class SHALL define a method named search with signature: async def search(self, claim: str, num_results: Optional[int] = None) -> List[SearchResult]
6. WHEN inspecting the Scout class properties, THE Scout class SHALL define a property named is_available that returns bool(self.api_key)
7. WHEN the Scout.__init__ method executes, THE Scout.__init__ method SHALL NOT print messages containing "NewsAPI.org agent initialized for news-first verification"
8. WHEN the Scout.__init__ method executes, THE Scout.__init__ method SHALL NOT print messages containing "No NEWS_API key -- news search will be skipped"

### Requirement 3: Simplify SSE Route Search Logic

**User Story:** As a developer, I want the SSE route to use only Serper.dev for search, so that the pipeline logic is straightforward and predictable.

#### Acceptance Criteria

1. WHEN rag_enabled is True AND detector_scout.is_available is True, THE pipeline_stream function SHALL call await detector_scout.search(claim) with claim parameter
2. IF detector_scout.is_available is False, THEN THE pipeline_stream function SHALL set search_results to empty list and proceed to Stage 2
3. IF detector_scout.search(claim) raises an exception, THEN THE pipeline_stream function SHALL log the exception at WARNING level and set search_results to empty list
4. WHEN the pipeline_stream function begins Stage 1, THE pipeline_stream function SHALL yield sse_stage("SCOUT", 1, "Searching for evidence...")
5. WHEN the pipeline_stream function completes Stage 1 successfully, THE pipeline_stream function SHALL yield sse_stage("READER", 2, "Extracting content from sources...")
6. WHEN inspecting the pipeline_stream function source code, THE pipeline_stream function SHALL NOT contain calls to detector_scout.search_news
7. WHEN inspecting the pipeline_stream function source code, THE pipeline_stream function SHALL NOT contain references to detector_scout.is_news_available

### Requirement 4: Simplify Image SSE Route Search Logic

**User Story:** As a developer, I want the Image SSE route to use only Serper.dev for search, so that image verification follows the same simplified search pattern as text verification.

#### Acceptance Criteria

1. WHEN the image_pipeline_stream function reaches Stage 2 AND scout.is_available is True, THE image_pipeline_stream function SHALL call await scout.search(claim) with claim parameter
2. IF scout.is_available is False, THEN THE image_pipeline_stream function SHALL set search_results to empty list and proceed to Stage 3
3. IF scout.search(claim) raises an exception, THEN THE image_pipeline_stream function SHALL log the exception at WARNING level and set search_results to empty list
4. WHEN the image_pipeline_stream function begins Stage 2, THE image_pipeline_stream function SHALL yield sse_stage("SEARCHING_EVIDENCE", 2, "Searching news & web for evidence...")
5. WHEN the image_pipeline_stream function completes Stage 2 successfully, THE image_pipeline_stream function SHALL yield sse_stage("SCRAPING_SOURCES", 3, "Reading and analyzing source content...")
6. WHEN inspecting the image_pipeline_stream function source code, THE image_pipeline_stream function SHALL NOT contain calls to scout.search_news
7. WHEN inspecting the image_pipeline_stream function source code, THE image_pipeline_stream function SHALL NOT contain references to scout.is_news_available
8. WHEN inspecting the image_pipeline_stream function source code, THE image_pipeline_stream function SHALL NOT define or reference a variable named news_source_used

### Requirement 5: Preserve API Contract

**User Story:** As a frontend developer, I want the API endpoints to maintain their existing contracts, so that no frontend changes are required.

#### Acceptance Criteria

1. THE SSE_Route endpoint (/detect/stream) SHALL accept POST requests with FraudDetectionRequest schema containing fields: transactionAmount (float, required, >0), transactionType (string, optional), merchantName (string, optional), merchantCategory (string, optional), cardType (string, optional), location (string, optional), ipAddress (string, optional), deviceId (string, optional), description (string, optional, max 50000 characters), metadata (object, optional)

2. THE Image_SSE_Route endpoint (/image/stream) SHALL accept POST requests with multipart/form-data containing an "image" field with file types limited to image/jpeg, image/png, image/webp, or image/gif and maximum file size of 10485760 bytes

3. IF SSE_Route receives a request with description exceeding 50000 characters, THEN THE SSE_Route SHALL reject the request with validation error indicating maximum length exceeded

4. IF Image_SSE_Route receives a file with unsupported content type, THEN THE Image_SSE_Route SHALL emit an error event with data structure {"message": string} indicating unsupported file type

5. IF Image_SSE_Route receives a file exceeding 10485760 bytes, THEN THE Image_SSE_Route SHALL emit an error event with data structure {"message": string} indicating maximum size exceeded

6. THE SSE_Route endpoint (/detect/stream) SHALL emit SSE events with format "event: {type}\ndata: {json}\n\n" and media type "text/event-stream"

7. THE SSE_Route endpoint (/detect/stream) SHALL emit exactly four event types: "stage", "completed", "error", and no other event types

8. THE Image_SSE_Route endpoint (/image/stream) SHALL emit exactly five event types: "stage", "extraction", "completed", "error", and no other event types

9. WHEN SSE_Route emits a "stage" event, THE SSE_Route SHALL include data structure {"stage": string, "sequence": integer, "text": string}

10. WHEN SSE_Route emits a "completed" event, THE SSE_Route SHALL include data structure {"result": object} where result contains fields: verificationStatus (string), isFraud (boolean), riskScore (integer 0-100), confidenceLevel (string), flags (array of strings), analysisSummary (string), evidenceTimeline (array of strings), sources (array of objects), auditTrail (object or null)

11. WHEN SSE_Route emits an "error" event, THE SSE_Route SHALL include data structure {"message": string}

12. WHEN Image_SSE_Route emits an "extraction" event, THE Image_SSE_Route SHALL include data structure {"method": string, "success": boolean, "preview": string}

13. WHEN Image_SSE_Route emits a "completed" event, THE Image_SSE_Route SHALL include data structure containing fields: verdict (string), verificationStatus (string), isFraud (boolean), riskScore (integer 0-100), confidenceLevel (string), flags (array of strings), analysisSummary (string), extractionMethod (string or null), extractedContent (string or null), evidenceTimeline (array of strings), sources (array of objects), auditTrail (object or null)

14. THE SSE_Route SHALL emit stage events with stage field values in sequence: "SCOUT" (sequence 1), "READER" (sequence 2), "ANALYST" (sequence 3), "VERDICT" (sequence 4)

15. THE Image_SSE_Route SHALL emit stage events with stage field values in sequence: "EXTRACTING_CONTENT" (sequence 1), "SEARCHING_EVIDENCE" (sequence 2), "SCRAPING_SOURCES" (sequence 3), "VERIFYING_REALITY" (sequence 4)

### Requirement 6: Preserve Core Service Integrations

**User Story:** As a system architect, I want all other service integrations to remain unchanged, so that only the NewsAPI dependency is affected.

#### Acceptance Criteria

1. THE system SHALL continue to use Serper.dev for web search
2. THE system SHALL continue to use Jina AI Reader for content scraping
3. THE system SHALL continue to use OpenRouter for LLM analysis
4. THE system SHALL continue to use Sightengine for image AI detection (Image_SSE_Route only)
5. THE system SHALL continue to use LLaMA Vision for image content extraction fallback (Image_SSE_Route only)

### Requirement 7: Update Documentation and Logging

**User Story:** As a developer, I want logging messages to reflect the simplified search approach, so that debugging and monitoring remain clear.

#### Acceptance Criteria

1. WHEN the Scout.__init__ method executes AND self.api_key is not None, THE system SHALL log a message containing "Serper.dev agent initialized" at INFO level
2. WHEN the Scout.__init__ method executes AND self.api_key is None, THE system SHALL log a message containing "No SERPER_API_KEY -- web search will be skipped" at WARNING level
3. WHEN the pipeline_stream function begins Stage 1, THE system SHALL log a message containing "Stage 1" and "SCOUT" and "Searching for evidence" at INFO level
4. WHEN the image pipeline begins Stage 2, THE system SHALL log a message containing "Stage 2" and "SEARCHING_EVIDENCE" at INFO level
5. WHEN the pipeline_stream function source code is inspected, THE pipeline_stream function SHALL NOT contain log statements with text "news-first verification"
6. WHEN the pipeline_stream function source code is inspected, THE pipeline_stream function SHALL NOT contain log statements with text "falling back to web search"
7. WHEN the pipeline_stream function source code is inspected, THE pipeline_stream function SHALL NOT contain log statements with text "NewsAPI"
