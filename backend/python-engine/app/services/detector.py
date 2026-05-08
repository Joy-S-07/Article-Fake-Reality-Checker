"""
Article Verification Service — Groq AI Engine

Replaces the legacy Gemini-based detector with the Groq API via the
standard OpenAI SDK. The article text is injected into the prompt via
f-strings, and temperature ~0.3 ensures factual, structured output.
"""

import json
import re
import traceback
from typing import List

from openai import OpenAI

from app.config import settings
from app.schemas.detection import (
    FraudDetectionRequest,
    FraudDetectionResponse,
    ConfidenceLevel,
)


# ─── Verification Prompt Template ─────────────────
# The {article_text} placeholder is filled dynamically for every request.
VERIFICATION_PROMPT = """You are Verifi*, an advanced AI fact-checking analyst. Your task is to evaluate the following article or claim for factual accuracy, misleading framing, and misinformation.

--- BEGIN CONTENT ---
{article_text}
--- END CONTENT ---

Analyze the above content carefully and return your assessment as a **valid JSON object** with exactly these keys (no markdown fences, no extra text):

{{
  "isFraud": <boolean — true if the content is misleading, fabricated, or contains significant misinformation; false if it appears factually accurate>,
  "riskScore": <integer 0–100 — 0 means fully trustworthy, 100 means completely fabricated>,
  "confidenceLevel": "<one of: Low, Medium, High, Critical>",
  "flags": ["<list of specific misinformation indicators, unsupported claims, logical fallacies, or red flags found>"],
  "analysisSummary": "<A detailed 3–5 sentence analysis explaining your verdict. Cite specific parts of the text that are problematic or credible. Mention whether claims are verifiable, sourced, or contradict known facts.>"
}}

Evaluation guidelines:
- A risk score of 0–25 means the content is well-sourced and factually sound.
- A risk score of 26–50 means minor inaccuracies or unverifiable claims exist.
- A risk score of 51–75 means significant misleading content or unsupported claims.
- A risk score of 76–100 means the content is largely fabricated or deliberately deceptive.
- If the content is a URL verification request, note that you cannot browse the web but analyze the URL and any provided context.
- Be objective and fair. Not all sensational claims are false.

Return ONLY the JSON object. No explanations outside the JSON."""


class FraudDetector:
    """
    Groq-powered article verification engine.

    On init, configures the OpenAI-compatible client pointed at Groq's
    endpoint using the GROQ_API_KEY from .env. Each call to `analyze()`
    dynamically injects the article text into the prompt and queries
    Groq with a low temperature for factual consistency.
    """

    def __init__(self):
        """Initialize the Groq client via the OpenAI SDK."""
        api_key = settings.GROQ_API_KEY
        if not api_key:
            raise RuntimeError(
                "GROQ_API_KEY is not set in .env — cannot initialize Groq client."
            )

        # Create the OpenAI-compatible client pointed at Groq
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.groq.com/openai/v1",
        )
        self.model_name = settings.GROQ_MODEL_NAME
        self.temperature = settings.GROQ_TEMPERATURE

        print(f"[GROQ] Initialized model: {self.model_name}")
        print(f"[GROQ] Temperature: {self.temperature}")

    async def analyze(self, payload: FraudDetectionRequest) -> FraudDetectionResponse:
        """
        Analyze the incoming article/claim using Groq AI.

        The article text (from payload.description) is dynamically injected
        into the prompt string via an f-string. Groq returns structured JSON
        which is parsed into the response schema.
        """
        article_text = payload.description or ""

        # Guard: no content provided
        if not article_text.strip():
            return FraudDetectionResponse(
                isFraud=False,
                riskScore=0,
                confidenceLevel=ConfidenceLevel.LOW,
                flags=["No content was provided for analysis"],
                analysisSummary="No article text or claim was submitted. Please provide content to verify.",
            )

        # ─── Build the dynamic prompt ──────────────────
        prompt = VERIFICATION_PROMPT.format(article_text=article_text)

        try:
            # ─── Call Groq API via OpenAI SDK ─────────
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a fact-checking AI. Respond only with valid JSON.",
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                temperature=self.temperature,
                max_tokens=2048,
                top_p=0.95,
            )

            # Extract the text response
            raw_text = response.choices[0].message.content.strip()

            # ─── Parse the JSON response ──────────────
            parsed = self._parse_response(raw_text)

            return FraudDetectionResponse(
                isFraud=parsed.get("isFraud", False),
                riskScore=max(0, min(100, int(parsed.get("riskScore", 50)))),
                confidenceLevel=self._normalize_confidence(
                    parsed.get("confidenceLevel", "Medium")
                ),
                flags=parsed.get("flags", []),
                analysisSummary=parsed.get(
                    "analysisSummary",
                    "Analysis completed but summary was not generated.",
                ),
            )

        except Exception as e:
            print(f"[GROQ ERROR] {type(e).__name__}: {e}")
            traceback.print_exc()

            # Return a graceful fallback rather than crashing
            return FraudDetectionResponse(
                isFraud=False,
                riskScore=50,
                confidenceLevel=ConfidenceLevel.MEDIUM,
                flags=[f"AI engine error: {type(e).__name__}"],
                analysisSummary=(
                    f"The AI verification engine encountered an error while processing "
                    f"your request: {str(e)}. The content could not be fully analyzed. "
                    f"Please try again or check the server logs for details."
                ),
            )

    # ─── Helpers ─────────────────────────────────────

    def _parse_response(self, raw_text: str) -> dict:
        """
        Parse the LLM response, handling possible markdown fences or
        extraneous text around the JSON object.
        """
        # Strip markdown code fences if present
        cleaned = raw_text
        if cleaned.startswith("```"):
            # Remove ```json ... ``` or ``` ... ```
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
            cleaned = re.sub(r"\s*```$", "", cleaned)

        # Try direct parse
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            pass

        # Fallback: find the first { ... } block
        match = re.search(r"\{[\s\S]*\}", cleaned)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass

        # Last resort: return a structured fallback
        print(f"[GROQ] Could not parse response as JSON. Raw: {raw_text[:500]}")
        return {
            "isFraud": False,
            "riskScore": 50,
            "confidenceLevel": "Medium",
            "flags": ["Could not parse AI response"],
            "analysisSummary": raw_text[:1000],
        }

    def _normalize_confidence(self, value: str) -> ConfidenceLevel:
        """Map the model's confidence string to the enum, with fallback."""
        mapping = {
            "low": ConfidenceLevel.LOW,
            "medium": ConfidenceLevel.MEDIUM,
            "high": ConfidenceLevel.HIGH,
            "critical": ConfidenceLevel.CRITICAL,
        }
        return mapping.get(value.lower().strip(), ConfidenceLevel.MEDIUM)
