# Implementation Plan: Remove NewsAPI Integration

## Overview

This implementation plan removes the NewsAPI.org integration from the Article Fake Reality Checker backend and simplifies the search pipeline to use Serper.dev as the sole web search provider. The changes involve removing configuration fields, deleting NewsAPI-specific methods from the Scout service, and simplifying the two-step search logic in both SSE routes to a single-step Serper-only approach.

## Tasks

- [x] 1. Remove NewsAPI configuration from Config module
  - Remove `NEWS_API` field from Settings class in `app/config.py`
  - Remove `NEWS_API` line from `.env.example`
  - Verify Settings class retains `SERPER_API_KEY`, `SERPER_ENDPOINT`, and `SERPER_NUM_RESULTS` fields
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [ ]* 1.1 Write unit tests for Config module
  - Test Settings class instantiation without NEWS_API in environment
  - Test accessing settings.NEWS_API raises AttributeError
  - Test SERPER_API_KEY, SERPER_ENDPOINT, SERPER_NUM_RESULTS are accessible
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.6_

- [~] 2. Remove NewsAPI code from Scout service
  - [-] 2.1 Remove NewsAPI attributes and methods from Scout class
    - Remove `NEWSAPI_ENDPOINT` class attribute from `app/services/scout.py`
    - Remove `self.news_api_key` assignment in `__init__` method
    - Remove `is_news_available` property
    - Remove `search_news()` method entirely
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [-] 2.2 Update Scout initialization logging
    - Update `__init__` to log "Serper.dev agent initialized" when api_key is present
    - Update `__init__` to log "No SERPER_API_KEY -- web search will be skipped" when api_key is None
    - Remove log messages containing "NewsAPI.org agent initialized for news-first verification"
    - Remove log messages containing "No NEWS_API key -- news search will be skipped"
    - _Requirements: 2.7, 2.8, 7.1, 7.2_

  - [ ] 2.3 Verify Scout.search() method signature and is_available property
    - Verify `search()` method has signature: `async def search(self, claim: str, num_results: Optional[int] = None) -> List[SearchResult]`
    - Verify `is_available` property returns `bool(self.api_key)`
    - _Requirements: 2.5, 2.6_

  - [ ]* 2.4 Write unit tests for Scout service
    - Test Scout initializes with SERPER_API_KEY only
    - Test accessing scout.search_news raises AttributeError
    - Test accessing scout.is_news_available raises AttributeError
    - Test scout.search() returns List[SearchResult] with valid key
    - Test scout.search() returns empty list with missing key
    - Test scout.search() handles API errors gracefully
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [~] 3. Checkpoint - Verify Scout service changes
  - Ensure all tests pass, ask the user if questions arise.

- [~] 4. Simplify SSE route search logic
  - [~] 4.1 Replace two-step search with single-step Serper search
    - Remove NewsAPI search attempt (Step 1a) from Stage 1 in `app/routes/sse.py`
    - Remove Serper fallback logic (Step 1b) from Stage 1
    - Replace with single `await detector_scout.search(claim)` call
    - Remove `detector_scout.is_news_available` checks
    - Remove `detector_scout.search_news()` calls
    - _Requirements: 3.1, 3.6, 3.7_

  - [~] 4.2 Update SSE route error handling
    - Wrap `detector_scout.search()` in try-except block
    - Log exceptions at WARNING level with type and message
    - Set search_results to empty list on exception
    - Continue pipeline with empty results if search fails
    - _Requirements: 3.3_

  - [~] 4.3 Update SSE route stage events and logging
    - Verify Stage 1 yields `sse_stage("SCOUT", 1, "Searching for evidence...")`
    - Verify Stage 2 yields `sse_stage("READER", 2, "Extracting content from sources...")`
    - Remove log statements containing "news-first verification"
    - Remove log statements containing "falling back to web search"
    - Remove log statements containing "NewsAPI"
    - Update Stage 1 logging to "Stage 1/4 -- SCOUT: Searching for evidence..."
    - _Requirements: 3.4, 3.5, 7.3, 7.5, 7.6, 7.7_

  - [~] 4.4 Verify SSE route handles missing API key
    - Verify pipeline checks `detector_scout.is_available` before calling search
    - Verify pipeline sets search_results to empty list if is_available is False
    - Verify pipeline continues to Stage 2 with empty results
    - _Requirements: 3.2_

  - [ ]* 4.5 Write integration tests for SSE route
    - Test SSE route uses single-step search (calls scout.search() once)
    - Test SSE route handles search failure gracefully
    - Test SSE route handles missing API key
    - Test SSE route preserves API contract (4 stage events, 1 completed event)
    - Test completed event matches FraudDetectionResponse schema
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1, 5.6, 5.7, 5.9, 5.10, 5.11, 5.14_

- [~] 5. Simplify Image SSE route search logic
  - [~] 5.1 Replace two-step search with single-step Serper search
    - Remove NewsAPI search attempt (Step 2a) from Stage 2 in `app/routes/image_sse.py`
    - Remove Serper fallback logic (Step 2b) from Stage 2
    - Replace with single `await scout.search(claim)` call
    - Remove `scout.is_news_available` checks
    - Remove `scout.search_news()` calls
    - Remove `news_source_used` variable
    - _Requirements: 4.1, 4.6, 4.7, 4.8_

  - [~] 5.2 Update Image SSE route error handling
    - Wrap `scout.search()` in try-except block
    - Log exceptions at WARNING level with type and message
    - Set search_results to empty list on exception
    - Continue pipeline with empty results if search fails
    - _Requirements: 4.3_

  - [~] 5.3 Update Image SSE route stage events and logging
    - Verify Stage 2 yields `sse_stage("SEARCHING_EVIDENCE", 2, "Searching news & web for evidence...")`
    - Verify Stage 3 yields `sse_stage("SCRAPING_SOURCES", 3, "Reading and analyzing source content...")`
    - Update Stage 2 logging to "Stage 2 -- SEARCHING_EVIDENCE: Searching for evidence..."
    - Remove log statements containing "news-first verification"
    - Remove log statements containing "falling back to web search"
    - _Requirements: 4.4, 4.5, 7.4_

  - [~] 5.4 Verify Image SSE route handles missing API key
    - Verify pipeline checks `scout.is_available` before calling search
    - Verify pipeline sets search_results to empty list if is_available is False
    - Verify pipeline continues to Stage 3 with empty results
    - _Requirements: 4.2_

  - [ ]* 5.5 Write integration tests for Image SSE route
    - Test Image SSE route uses single-step search (calls scout.search() once)
    - Test Image SSE route handles search failure gracefully
    - Test Image SSE route handles missing API key
    - Test Image SSE route preserves API contract (4 stage events, 1 completed event)
    - Test completed event matches ImageAnalysisResult schema
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.2, 5.8, 5.12, 5.13, 5.15_

- [~] 6. Checkpoint - Verify all route changes
  - Ensure all tests pass, ask the user if questions arise.

- [~] 7. Verify API contract preservation
  - [~] 7.1 Verify SSE route request/response contract
    - Verify `/detect/stream` accepts POST with FraudDetectionRequest schema
    - Verify description field has max_length=50000 validation
    - Verify response Content-Type is "text/event-stream"
    - Verify exactly 4 event types are emitted: "stage", "completed", "error"
    - Verify stage events have correct sequence: SCOUT(1), READER(2), ANALYST(3), VERDICT(4)
    - _Requirements: 5.1, 5.3, 5.6, 5.7, 5.9, 5.14_

  - [~] 7.2 Verify Image SSE route request/response contract
    - Verify `/image/stream` accepts POST with multipart/form-data
    - Verify image field accepts jpeg, png, webp, gif with max size 10485760 bytes
    - Verify response Content-Type is "text/event-stream"
    - Verify exactly 5 event types are emitted: "stage", "extraction", "completed", "error"
    - Verify stage events have correct sequence: EXTRACTING_CONTENT(1), SEARCHING_EVIDENCE(2), SCRAPING_SOURCES(3), VERIFYING_REALITY(4)
    - _Requirements: 5.2, 5.4, 5.5, 5.8, 5.12, 5.15_

  - [~] 7.3 Verify service integrations remain unchanged
    - Verify system uses Serper.dev for web search
    - Verify system uses Jina AI Reader for content scraping
    - Verify system uses OpenRouter for LLM analysis
    - Verify system uses Sightengine for image AI detection (Image SSE only)
    - Verify system uses LLaMA Vision for image content extraction fallback (Image SSE only)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 7.4 Write end-to-end integration tests
    - Test end-to-end text verification with Serper
    - Test end-to-end image verification with Serper
    - Test end-to-end verification without API key (no-evidence analysis)
    - _Requirements: 5.1, 5.2, 5.10, 5.13, 6.1, 6.2, 6.3, 6.4, 6.5_

- [~] 8. Final checkpoint - Verify complete implementation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at logical breakpoints
- This is a code removal and simplification task - no new functionality is added
- API contracts are preserved - no frontend changes required
- All existing service integrations (Serper, Jina, OpenRouter, Sightengine, LLaMA Vision) remain unchanged
- Error handling maintains graceful degradation (missing key → skip search, API error → empty results)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["2.4"] },
    { "id": 3, "tasks": ["4.1", "5.1"] },
    { "id": 4, "tasks": ["4.2", "4.3", "4.4", "5.2", "5.3", "5.4"] },
    { "id": 5, "tasks": ["4.5", "5.5"] },
    { "id": 6, "tasks": ["7.1", "7.2", "7.3"] },
    { "id": 7, "tasks": ["7.4"] }
  ]
}
```
