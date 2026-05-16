# Design Document: Remove NewsAPI Integration

## Overview

This design document specifies the technical approach for removing the NewsAPI.org integration from the Article Fake Reality Checker backend and simplifying the search pipeline to use Serper.dev as the sole web search provider.

### Current Architecture

The system currently implements a "news-first verification" approach:
1. **Stage 1a**: Attempt NewsAPI.org search for news articles
2. **Stage 1b**: Fall back to Serper.dev if NewsAPI returns no results
3. **Stage 2-4**: Continue with Reader → Analyst → Verdict pipeline

This two-step search strategy adds complexity, an extra API dependency, and conditional logic throughout the codebase.

### Target Architecture

The simplified architecture will:
1. **Stage 1**: Use Serper.dev directly for all web searches (single step)
2. **Stage 2-4**: Continue with Reader → Analyst → Verdict pipeline (unchanged)

### Benefits

- **Reduced Complexity**: Single search provider eliminates fallback logic
- **Fewer Dependencies**: One less external API to manage and monitor
- **Simplified Configuration**: Remove NEWS_API environment variable
- **Cleaner Code**: Remove conditional branches and news-specific methods
- **Consistent Behavior**: Predictable search behavior across all requests

## Architecture

### System Components

The removal affects four primary components:

1. **Config Module** (`app/config.py`)
   - Manages environment variables and application settings
   - Currently defines `NEWS_API` field in Settings class
   - Will retain only Serper configuration

2. **Scout Service** (`app/services/scout.py`)
   - Search agent responsible for retrieving real-time search results
   - Currently implements both `search()` (Serper) and `search_news()` (NewsAPI)
   - Will retain only `search()` method

3. **SSE Route** (`app/routes/sse.py`)
   - Orchestrates the 4-stage fraud detection pipeline
   - Currently implements two-step search (NewsAPI → Serper fallback)
   - Will implement single-step search (Serper only)

4. **Image SSE Route** (`app/routes/image_sse.py`)
   - Orchestrates the 4-stage image reality check pipeline
   - Currently implements two-step search (NewsAPI → Serper fallback)
   - Will implement single-step search (Serper only)

### Component Interactions

```
┌─────────────────────────────────────────────────────────────┐
│                     SSE Routes Layer                         │
│  ┌──────────────────────┐    ┌──────────────────────┐      │
│  │   sse.py             │    │   image_sse.py       │      │
│  │   (Text Pipeline)    │    │   (Image Pipeline)   │      │
│  └──────────┬───────────┘    └──────────┬───────────┘      │
│             │                            │                   │
│             └────────────┬───────────────┘                   │
└──────────────────────────┼─────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   Scout Service        │
              │   (scout.py)           │
              │                        │
              │   search() method      │
              │   ↓                    │
              │   Serper.dev API       │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   Config Module        │
              │   (config.py)          │
              │                        │
              │   SERPER_API_KEY       │
              │   SERPER_ENDPOINT      │
              │   SERPER_NUM_RESULTS   │
              └────────────────────────┘
```

**Before (Two-Step Search)**:
```
SSE Route → Scout.search_news() → NewsAPI.org
              ↓ (if no results)
            Scout.search() → Serper.dev
```

**After (Single-Step Search)**:
```
SSE Route → Scout.search() → Serper.dev
```

### Data Flow

#### Text Verification Pipeline (sse.py)

**Current Flow**:
```
1. Client POST /detect/stream
2. Stage 1a: Scout.search_news(claim) → NewsAPI results
3. If no results → Stage 1b: Scout.search(claim) → Serper results
4. Stage 2: Reader.scrape_multiple(urls)
5. Stage 3: Analyst.investigate(claim, evidence)
6. Stage 4: Return FraudDetectionResponse
```

**Simplified Flow**:
```
1. Client POST /detect/stream
2. Stage 1: Scout.search(claim) → Serper results
3. Stage 2: Reader.scrape_multiple(urls)
4. Stage 3: Analyst.investigate(claim, evidence)
5. Stage 4: Return FraudDetectionResponse
```

#### Image Verification Pipeline (image_sse.py)

**Current Flow**:
```
1. Client POST /image/stream
2. Stage 1: ImageContentExtractor.extract(image_bytes)
3. Stage 2a: Scout.search_news(claim) → NewsAPI results
4. If no results → Stage 2b: Scout.search(claim) → Serper results
5. Stage 3: Reader.scrape_multiple(urls)
6. Stage 4: Analyst.investigate(claim, evidence)
7. Return ImageAnalysisResult
```

**Simplified Flow**:
```
1. Client POST /image/stream
2. Stage 1: ImageContentExtractor.extract(image_bytes)
3. Stage 2: Scout.search(claim) → Serper results
4. Stage 3: Reader.scrape_multiple(urls)
5. Stage 4: Analyst.investigate(claim, evidence)
6. Return ImageAnalysisResult
```

## Components and Interfaces

### 1. Config Module Changes

**File**: `app/config.py`

**Current Settings Class**:
```python
class Settings(BaseSettings):
    # ... other fields ...
    SERPER_API_KEY: Optional[str] = None
    SERPER_ENDPOINT: str = "https://google.serper.dev/search"
    SERPER_NUM_RESULTS: int = 5
    NEWS_API: Optional[str] = None  # ← TO BE REMOVED
```

**Updated Settings Class**:
```python
class Settings(BaseSettings):
    # ... other fields ...
    SERPER_API_KEY: Optional[str] = None
    SERPER_ENDPOINT: str = "https://google.serper.dev/search"
    SERPER_NUM_RESULTS: int = 5
    # NEWS_API field removed
```

**Changes**:
- Remove `NEWS_API: Optional[str] = None` field
- No other configuration changes required
- Serper configuration remains unchanged

### 2. Scout Service Changes

**File**: `app/services/scout.py`

**Current Scout Class**:
```python
class Scout:
    NEWSAPI_ENDPOINT: str = "https://newsapi.org/v2/everything"  # ← TO BE REMOVED
    
    def __init__(self):
        self.api_key: Optional[str] = settings.SERPER_API_KEY
        self.news_api_key: Optional[str] = settings.NEWS_API  # ← TO BE REMOVED
        # ... initialization logic ...
    
    @property
    def is_available(self) -> bool:
        return bool(self.api_key)
    
    @property
    def is_news_available(self) -> bool:  # ← TO BE REMOVED
        return bool(self.news_api_key)
    
    async def search_news(self, claim: str, ...) -> List[SearchResult]:  # ← TO BE REMOVED
        # ... NewsAPI implementation ...
    
    async def search(self, claim: str, ...) -> List[SearchResult]:
        # ... Serper implementation (KEEP) ...
```

**Updated Scout Class**:
```python
class Scout:
    # NEWSAPI_ENDPOINT removed
    
    def __init__(self):
        self.api_key: Optional[str] = settings.SERPER_API_KEY
        # news_api_key assignment removed
        self.endpoint: str = settings.SERPER_ENDPOINT
        self.num_results: int = settings.SERPER_NUM_RESULTS
        
        if self.api_key:
            print(f"[SCOUT] Serper.dev agent initialized (top {self.num_results} results)")
        else:
            print("[SCOUT] WARNING: No SERPER_API_KEY -- web search will be skipped")
    
    @property
    def is_available(self) -> bool:
        """Check if the Scout has a valid Serper API key configured."""
        return bool(self.api_key)
    
    # is_news_available property removed
    # search_news() method removed
    
    async def search(self, claim: str, num_results: Optional[int] = None) -> List[SearchResult]:
        """
        Search Google for the given claim via Serper.dev.
        
        The query is prefixed with "fact check" to prioritize
        verification and debunking sources in the results.
        """
        # ... existing Serper implementation (unchanged) ...
```

**Changes**:
- Remove `NEWSAPI_ENDPOINT` class attribute
- Remove `self.news_api_key` assignment in `__init__`
- Remove `is_news_available` property
- Remove `search_news()` method entirely
- Update initialization logging to remove NewsAPI references
- Keep `search()` method unchanged

**Method Signature (Unchanged)**:
```python
async def search(self, claim: str, num_results: Optional[int] = None) -> List[SearchResult]
```

### 3. SSE Route Changes

**File**: `app/routes/sse.py`

**Current Stage 1 Logic**:
```python
# Stage 1: SCOUT -- Search for evidence (News-first)
yield sse_stage("SCOUT", 1, "Searching for evidence...")
search_results = []

# Step 1a: Try NewsAPI first
if rag_enabled and detector_scout.is_news_available:
    try:
        search_results = await detector_scout.search_news(claim)
        if search_results:
            print(f"✓ Found {len(search_results)} news articles")
        else:
            print(f"✗ No news articles — falling back to web search")
    except Exception as e:
        print(f"WARNING: NewsAPI failed: {e}")

# Step 1b: Fall back to Serper
if not search_results and rag_enabled and detector_scout.is_available:
    try:
        search_results = await detector_scout.search(claim)
    except Exception as e:
        print(f"WARNING: Scout failed: {e}")
```

**Simplified Stage 1 Logic**:
```python
# Stage 1: SCOUT -- Search for evidence
yield sse_stage("SCOUT", 1, "Searching for evidence...")
serper_query = f"fact check {claim.strip()[:300]}"
print(f"\n{'=' * 60}")
print(f"[SSE PIPELINE] Stage 1/4 -- SCOUT: Searching for evidence...")
print(f"{'=' * 60}")

search_results = []

if rag_enabled and detector_scout.is_available:
    try:
        search_results = await detector_scout.search(claim)
    except Exception as e:
        print(f"[SSE PIPELINE] WARNING: Scout failed: {type(e).__name__}: {e}")
        traceback.print_exc()
        search_results = []
```

**Changes**:
- Remove two-step search logic (NewsAPI → Serper fallback)
- Remove `detector_scout.is_news_available` checks
- Remove `detector_scout.search_news()` calls
- Simplify to single `detector_scout.search()` call
- Remove "news-first verification" log messages
- Remove "falling back to web search" log messages
- Keep error handling and empty list fallback

### 4. Image SSE Route Changes

**File**: `app/routes/image_sse.py`

**Current Stage 2 Logic**:
```python
# Stage 2: Search for Evidence (News-First)
yield sse_stage("SEARCHING_EVIDENCE", 2, "Searching news & web for evidence...")
search_results = []
news_source_used = False

# Step 2a: Try NewsAPI first
scout = _get_scout()
if scout.is_news_available:
    try:
        search_results = await scout.search_news(claim)
        if search_results:
            news_source_used = True
            print(f"✓ Found {len(search_results)} news articles")
        else:
            print(f"✗ No news articles — falling back to web search")
    except Exception as e:
        print(f"WARNING: NewsAPI failed: {e}")

# Step 2b: Fall back to Serper
if not search_results and scout.is_available:
    try:
        search_results = await scout.search(claim)
    except Exception as e:
        print(f"WARNING: Serper failed: {e}")
```

**Simplified Stage 2 Logic**:
```python
# Stage 2: Search for Evidence
yield sse_stage("SEARCHING_EVIDENCE", 2, "Searching news & web for evidence...")
serper_query = f"fact check {claim.strip()[:300]}"
print(f"\n{'=' * 60}")
print(f"[IMAGE PIPELINE] Stage 2 -- SEARCHING_EVIDENCE: Searching for evidence...")
print(f"{'=' * 60}")

search_results = []
scout = _get_scout()

if scout.is_available:
    try:
        search_results = await scout.search(claim)
    except Exception as e:
        print(f"[IMAGE PIPELINE] WARNING: Scout failed: {type(e).__name__}: {e}")
        traceback.print_exc()
        search_results = []
```

**Changes**:
- Remove two-step search logic (NewsAPI → Serper fallback)
- Remove `scout.is_news_available` checks
- Remove `scout.search_news()` calls
- Remove `news_source_used` variable
- Simplify to single `scout.search()` call
- Remove "news-first verification" log messages
- Remove "falling back to web search" log messages
- Keep error handling and empty list fallback

### 5. Environment Configuration Changes

**File**: `.env.example`

**Current Content**:
```bash
# ... other variables ...
SERPER_API_KEY=your_serper_api_key_here
NEWS_API=your_newsapi_key_here  # ← TO BE REMOVED
```

**Updated Content**:
```bash
# ... other variables ...
SERPER_API_KEY=your_serper_api_key_here
# NEWS_API line removed
```

**Changes**:
- Remove `NEWS_API=your_newsapi_key_here` line
- Keep all other environment variables unchanged

## Data Models

No data model changes are required. The following models remain unchanged:

### SearchResult (scout.py)

```python
@dataclass
class SearchResult:
    """A single search result returned by Serper."""
    title: str
    url: str
    snippet: str
    position: int = 0
```

This dataclass is used by both the old `search_news()` method and the retained `search()` method, so it remains compatible.

### FraudDetectionRequest (schemas/detection.py)

```python
class FraudDetectionRequest(BaseModel):
    transactionAmount: float
    transactionType: Optional[str] = None
    merchantName: Optional[str] = None
    merchantCategory: Optional[str] = None
    cardType: Optional[str] = None
    location: Optional[str] = None
    ipAddress: Optional[str] = None
    deviceId: Optional[str] = None
    description: Optional[str] = Field(None, max_length=50000)
    metadata: Optional[dict] = None
```

No changes required — API contract preserved.

### FraudDetectionResponse (schemas/detection.py)

```python
class FraudDetectionResponse(BaseModel):
    verificationStatus: str
    isFraud: bool
    riskScore: int  # 0-100
    confidenceLevel: ConfidenceLevel
    flags: List[str]
    analysisSummary: str
    evidenceTimeline: List[str] = []
    sources: List[SourceReference] = []
    auditTrail: Optional[AuditTrail] = None
```

No changes required — API contract preserved.

### ImageAnalysisResult (schemas/image_detection.py)

```python
class ImageAnalysisResult(BaseModel):
    verdict: ImageVerdict
    verificationStatus: str
    isFraud: bool
    riskScore: int  # 0-100
    confidenceLevel: ImageConfidenceLevel
    flags: List[str]
    analysisSummary: str
    extractionMethod: Optional[str] = None
    extractedContent: Optional[str] = None
    evidenceTimeline: List[str] = []
    sources: List[SourceReference] = []
    auditTrail: Optional[AuditTrail] = None
```

No changes required — API contract preserved.

## Error Handling

### Current Error Handling

The current implementation handles errors at two levels:

1. **NewsAPI Level** (to be removed):
```python
try:
    search_results = await detector_scout.search_news(claim)
except Exception as e:
    print(f"WARNING: NewsAPI failed: {e}")
    # Falls back to Serper
```

2. **Serper Level** (to be retained):
```python
try:
    search_results = await detector_scout.search(claim)
except Exception as e:
    print(f"WARNING: Scout failed: {e}")
    search_results = []  # Continue with empty results
```

### Simplified Error Handling

After removal, only one error handling level remains:

```python
search_results = []

if rag_enabled and detector_scout.is_available:
    try:
        search_results = await detector_scout.search(claim)
    except Exception as e:
        print(f"[SSE PIPELINE] WARNING: Scout failed: {type(e).__name__}: {e}")
        traceback.print_exc()
        search_results = []
```

**Error Handling Strategy**:
- If `SERPER_API_KEY` is not configured: `is_available` returns `False`, search is skipped
- If Serper API call fails: Exception is caught, logged, and pipeline continues with empty results
- If search returns empty results: Pipeline continues to Analyst stage with no evidence
- Analyst stage handles both evidence-backed and no-evidence scenarios

**Graceful Degradation**:
- Missing API key → Skip search, proceed with no-evidence analysis
- API timeout → Log warning, proceed with no-evidence analysis
- API error → Log warning, proceed with no-evidence analysis
- No search results → Proceed with no-evidence analysis

This maintains the same graceful degradation behavior as the current implementation.

### Scout Service Error Handling

The `Scout.search()` method already implements comprehensive error handling:

```python
async def search(self, claim: str, num_results: Optional[int] = None) -> List[SearchResult]:
    if not self.is_available:
        print("[SCOUT] Skipped -- no API key configured")
        return []
    
    try:
        # ... API call ...
    except httpx.TimeoutException:
        print("[SCOUT] WARNING: Request timed out -- Serper.dev unreachable")
        return []
    except httpx.HTTPStatusError as e:
        print(f"[SCOUT] WARNING: HTTP {e.response.status_code}: {e.response.text[:200]}")
        return []
    except Exception as e:
        print(f"[SCOUT] WARNING: Unexpected error: {type(e).__name__}: {e}")
        traceback.print_exc()
        return []
```

This error handling remains unchanged and provides:
- Timeout handling (10 second timeout)
- HTTP error handling (4xx, 5xx responses)
- Generic exception handling (network errors, JSON parsing errors)
- Consistent return value (empty list) for all error cases

## Testing Strategy

### Unit Testing Approach

This is a code removal and simplification task with no new functionality. Testing should focus on:

1. **Regression Testing**: Verify existing functionality still works
2. **Configuration Testing**: Verify NEWS_API removal doesn't break startup
3. **Integration Testing**: Verify Serper-only search works end-to-end
4. **Contract Testing**: Verify API responses match expected schemas

### Test Categories

#### 1. Configuration Tests

**Test: Config module loads without NEWS_API**
- Verify `Settings` class can be instantiated without `NEWS_API` in environment
- Verify `settings.SERPER_API_KEY` is accessible
- Verify `settings.SERPER_ENDPOINT` has correct default value
- Verify `settings.SERPER_NUM_RESULTS` has correct default value

**Test: Config module does not expose NEWS_API**
- Verify `Settings` class does not have `NEWS_API` attribute
- Verify accessing `settings.NEWS_API` raises `AttributeError`

#### 2. Scout Service Tests

**Test: Scout initializes with Serper key only**
- Given: `SERPER_API_KEY` is set, `NEWS_API` is not set
- When: `Scout()` is instantiated
- Then: `scout.is_available` returns `True`
- Then: `scout.api_key` is set
- Then: No `AttributeError` is raised

**Test: Scout does not expose news methods**
- Given: `Scout()` instance
- When: Accessing `scout.search_news`
- Then: `AttributeError` is raised
- When: Accessing `scout.is_news_available`
- Then: `AttributeError` is raised

**Test: Scout.search() works with valid key**
- Given: `SERPER_API_KEY` is set
- When: `await scout.search("test claim")`
- Then: Returns `List[SearchResult]` (may be empty)
- Then: No exceptions are raised

**Test: Scout.search() handles missing key gracefully**
- Given: `SERPER_API_KEY` is not set
- When: `await scout.search("test claim")`
- Then: Returns empty list `[]`
- Then: Logs warning message

**Test: Scout.search() handles API errors gracefully**
- Given: Serper API returns 500 error
- When: `await scout.search("test claim")`
- Then: Returns empty list `[]`
- Then: Logs warning message

#### 3. SSE Route Tests

**Test: SSE route uses single-step search**
- Given: Valid `FraudDetectionRequest` with description
- When: POST to `/detect/stream`
- Then: Emits `stage` event with `stage="SCOUT"`
- Then: Calls `scout.search()` exactly once
- Then: Does not call `scout.search_news()`
- Then: Emits `stage` event with `stage="READER"`
- Then: Emits `completed` event with `FraudDetectionResponse`

**Test: SSE route handles search failure gracefully**
- Given: `scout.search()` raises exception
- When: POST to `/detect/stream`
- Then: Logs warning message
- Then: Continues to READER stage with empty results
- Then: Emits `completed` event (no-evidence analysis)

**Test: SSE route handles missing API key**
- Given: `SERPER_API_KEY` is not set
- When: POST to `/detect/stream`
- Then: Skips search (empty results)
- Then: Continues to READER stage
- Then: Emits `completed` event (no-evidence analysis)

**Test: SSE route preserves API contract**
- Given: Valid `FraudDetectionRequest`
- When: POST to `/detect/stream`
- Then: Response has `Content-Type: text/event-stream`
- Then: Emits exactly 4 stage events (SCOUT, READER, ANALYST, VERDICT)
- Then: Emits exactly 1 completed event
- Then: Completed event data matches `FraudDetectionResponse` schema

#### 4. Image SSE Route Tests

**Test: Image SSE route uses single-step search**
- Given: Valid image upload
- When: POST to `/image/stream`
- Then: Emits `stage` event with `stage="EXTRACTING_CONTENT"`
- Then: Emits `stage` event with `stage="SEARCHING_EVIDENCE"`
- Then: Calls `scout.search()` exactly once
- Then: Does not call `scout.search_news()`
- Then: Emits `stage` event with `stage="SCRAPING_SOURCES"`
- Then: Emits `completed` event with `ImageAnalysisResult`

**Test: Image SSE route handles search failure gracefully**
- Given: `scout.search()` raises exception
- When: POST to `/image/stream`
- Then: Logs warning message
- Then: Continues to SCRAPING_SOURCES stage with empty results
- Then: Emits `completed` event (no-evidence analysis)

**Test: Image SSE route preserves API contract**
- Given: Valid image upload
- When: POST to `/image/stream`
- Then: Response has `Content-Type: text/event-stream`
- Then: Emits exactly 4 stage events
- Then: Emits exactly 1 completed event
- Then: Completed event data matches `ImageAnalysisResult` schema

#### 5. Integration Tests

**Test: End-to-end text verification with Serper**
- Given: Valid claim text
- Given: `SERPER_API_KEY` is set
- When: POST to `/detect/stream` with claim
- Then: Pipeline completes successfully
- Then: Returns `FraudDetectionResponse` with sources
- Then: `auditTrail.serperQuery` is populated

**Test: End-to-end image verification with Serper**
- Given: Valid image with text
- Given: `SERPER_API_KEY` is set
- When: POST to `/image/stream` with image
- Then: Pipeline completes successfully
- Then: Returns `ImageAnalysisResult` with sources
- Then: `auditTrail.serperQuery` is populated

**Test: End-to-end verification without API key**
- Given: `SERPER_API_KEY` is not set
- When: POST to `/detect/stream` with claim
- Then: Pipeline completes successfully
- Then: Returns `FraudDetectionResponse` with no sources
- Then: `analysisSummary` indicates no-evidence analysis

### Test Implementation Notes

- Use `pytest` for test framework
- Use `pytest-asyncio` for async test support
- Use `httpx.AsyncClient` for API testing
- Use `unittest.mock` for mocking Scout service
- Use `pytest.raises` for exception testing
- Use `pytest.mark.parametrize` for multiple test cases

### Manual Testing Checklist

- [ ] Application starts without `NEWS_API` in `.env`
- [ ] `/detect/stream` endpoint returns valid SSE stream
- [ ] `/image/stream` endpoint returns valid SSE stream
- [ ] Stage events are emitted in correct order
- [ ] Completed events match expected schemas
- [ ] Error events are emitted for invalid requests
- [ ] Logging messages do not reference NewsAPI
- [ ] Logging messages reference Serper.dev correctly
- [ ] Search results are returned from Serper.dev
- [ ] Pipeline continues with empty results if search fails
- [ ] No-evidence analysis works when search is skipped

### Property-Based Testing Assessment

**Is PBT appropriate for this feature?**

No. This is a code removal and simplification task, not a feature with new logic. Property-based testing is not applicable because:

1. **No new algorithms**: We're removing code, not adding new transformation logic
2. **No complex input space**: The changes are structural (removing methods/fields)
3. **No universal properties**: The behavior is "same as before, but simpler"
4. **Infrastructure change**: This is a refactoring task, not a feature with testable properties

**Appropriate testing approach**:
- **Regression tests**: Verify existing behavior is preserved
- **Integration tests**: Verify end-to-end pipeline still works
- **Contract tests**: Verify API responses match schemas
- **Smoke tests**: Verify application starts without NEWS_API configuration

Therefore, the **Correctness Properties section is omitted** from this design document.

