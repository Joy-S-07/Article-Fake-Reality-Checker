"""
SSE Load & Accuracy Tester
──────────────────────────────────────
Simulates concurrent users hitting the SSE streaming endpoint
to verify the pipeline handles parallel requests gracefully,
and evaluates the accuracy of the Fraud Detection AI.

Usage:
  pip install httpx httpx-sse
  python load_checker.py
"""

import asyncio
import time
import json
import httpx
from httpx_sse import aconnect_sse

# ─── Configuration ──────────────────────────────────

# Toggle target: "python" hits the engine directly, "gateway" goes through Node
TARGET = "python"

PYTHON_ENGINE_URL = "http://localhost:8000/detect/stream"
GATEWAY_URL = "http://localhost:5000/api/fraud/check/stream"

# Number of concurrent users to simulate (matches the number of test claims)
CONCURRENT_USERS = 10

# 20 Mixed Claims structured with their Ground Truth expected result.
# is_fraud = False (Factual), is_fraud = True (Fabricated)
TEST_CLAIMS = [
    # --- Factual / True Statements (Expected: Not Fraud) ---
    {"text": "Sanju Samson is a prominent player in the Indian Premier League (IPL).", "is_fraud": False},
    {"text": "Baahubali 2 is recognized as one of the highest-grossing Indian movies.", "is_fraud": False},
    {"text": "Detroit: Become Human is an interactive drama video game.", "is_fraud": False},
    {"text": "Artificial Intelligence and Machine Learning (AIML) are branches of computer science.", "is_fraud": False},
    {"text": "Sony A1 is a flagship mirrorless camera capable of shooting in 8K resolution.", "is_fraud": False},
    {"text": "The Smart Bengal Hackathon focuses on state-level product innovation.", "is_fraud": False},
    {"text": "Gojo Satoru is a heavily featured character in the anime Jujutsu Kaisen.", "is_fraud": False},
    {"text": "Three.js is a JavaScript library used to create animated 3D computer graphics.", "is_fraud": False},
    {"text": "The Lamborghini Urus is a high-performance luxury SUV.", "is_fraud": False},
    {"text": "Argentina is a national football team that has won multiple FIFA World Cups.", "is_fraud": False},
    
    # --- Fabricated / False Statements (Expected: Fraud) ---
    {"text": "The Krishi Sakhi AI farming assistant was officially acquired by Microsoft for $2 billion.", "is_fraud": True},
    {"text": "Arsenal FC recently announced they are permanently relocating their home stadium to West Bengal.", "is_fraud": True},
    {"text": "The anime Fire Force has been banned globally, and all existing copies were destroyed.", "is_fraud": True},
    {"text": "Mercedes-Benz has discontinued the G-Wagon to focus exclusively on manufacturing skateboards.", "is_fraud": True},
    {"text": "Hogwarts Legacy developers confirmed a surprise crossover expansion with Beyond: Two Souls.", "is_fraud": True},
    {"text": "Google AI Pro recently reduced its maximum storage capacity strictly to 500 MB.", "is_fraud": True},
    {"text": "A new CPU scheduling algorithm called 'Jujutsu-First' has become the industry standard in Java.", "is_fraud": True},
    {"text": "Samsung recalled all travel adapters globally because they convert electricity into dark matter.", "is_fraud": True},
    {"text": "The Argentina national football team officially changed their primary jersey colors to neon pink and black.", "is_fraud": True},
    {"text": "A new web development framework named 'React-Gojo' has entirely replaced HTML and CSS.", "is_fraud": True}
]

EXPECTED_STAGES_COUNT = 4

# ─── Simulated User ────────────────────────────────

async def simulate_user(user_id: int, url: str):
    """Simulate a single user consuming the SSE stream."""
    # Assign a specific claim based on user_id to ensure we test all 20
    claim_index = (user_id - 1) % len(TEST_CLAIMS)
    claim_data = TEST_CLAIMS[claim_index]
    
    payload = {
        "transactionAmount": 1,
        "description": claim_data["text"],
        "transactionType": "text_verification",
        "guestSessionId": f"load-test-user-{user_id}",
    }
    
    start_time = time.time()
    stages_received = []
    result_received = False
    error_received = None
    actual_fraud_result = None

    print(f"[User {user_id:>2}] ⏳ Connecting... | Claim: \"{payload['description'][:40]}...\"")

    async with httpx.AsyncClient(timeout=httpx.Timeout(180.0)) as client:
        try:
            async with aconnect_sse(
                client, "POST", url,
                json=payload,
                headers={"Content-Type": "application/json"},
            ) as event_source:
                async for event in event_source.aiter_sse():
                    elapsed = round(time.time() - start_time, 2)

                    if event.event == "stage":
                        data = json.loads(event.data)
                        stage = data.get("stage", "?")
                        text = data.get("text", "")
                        stages_received.append(stage)
                        print(f"[User {user_id:>2}] 🔄 {elapsed:>6}s | Stage: {stage} — {text}")

                    elif event.event == "completed":
                        result_received = True
                        data = json.loads(event.data)
                        result = data.get("result", {})
                        
                        # Capture the actual fraud prediction from your AI engine
                        actual_fraud_result = result.get("isFraud", False)
                        risk = result.get("riskScore", "?")
                        
                        print(f"[User {user_id:>2}] ✅ {elapsed:>6}s | COMPLETED — Fraud: {actual_fraud_result}, Risk: {risk}/100")

                    elif event.event == "error":
                        data = json.loads(event.data)
                        error_received = data.get("message", "Unknown error")
                        print(f"[User {user_id:>2}] ❌ {elapsed:>6}s | ERROR: {error_received}")

        except Exception as e:
            elapsed = round(time.time() - start_time, 2)
            error_received = f"{type(e).__name__}: {e}"
            print(f"[User {user_id:>2}] 💀 {elapsed:>6}s | FAILED: {error_received}")

    total_time = round(time.time() - start_time, 2)

    return {
        "user_id": user_id,
        "total_time": total_time,
        "stages": stages_received,
        "completed": result_received,
        "error": error_received,
        "claim_text": claim_data["text"],
        "expected_fraud": claim_data["is_fraud"],
        "actual_fraud": actual_fraud_result
    }

# ─── Main ───────────────────────────────────────────

async def main():
    url = PYTHON_ENGINE_URL if TARGET == "python" else GATEWAY_URL

    print("=" * 80)
    print(f"  STARTING LOAD & ACCURACY TEST")
    print(f"  Concurrent Users: {CONCURRENT_USERS}")
    print("=" * 80)

    overall_start = time.time()
    tasks = [simulate_user(i, url) for i in range(1, CONCURRENT_USERS + 1)]
    results = await asyncio.gather(*tasks)
    overall_elapsed = round(time.time() - overall_start, 2)

    # ──────────────────────────────────────────────────
    # SECTION 1: SYSTEM SCALABILITY SCORE
    # ──────────────────────────────────────────────────
    print("\n" + "=" * 80)
    print("  SYSTEM SCALABILITY & PIPELINE REPORT")
    print("=" * 80)

    completed = [r for r in results if r["completed"]]
    times = [r["total_time"] for r in results]
    avg_time = sum(times) / len(times) if times else 0

    success_rate = len(completed) / len(results) if results else 0
    base_score = success_rate * 10.0
    latency_penalty = max(0, (avg_time - 5.0) * 0.2)
    scalability_score = max(0.0, min(10.0, round(base_score - latency_penalty, 1)))

    print(f"  Total Requests:  {len(results)}")
    print(f"  Completed:       {len(completed)} ✅")
    print(f"  Average Time:    {round(avg_time, 2)}s")
    print(f"  ⚙️ SCALABILITY SCORE: {scalability_score} / 10.0")

    # ──────────────────────────────────────────────────
    # SECTION 2: AI FRAUD DETECTION ACCURACY REPORT
    # ──────────────────────────────────────────────────
    print("\n" + "=" * 80)
    print("  AI FRAUD DETECTION ACCURACY REPORT")
    print("=" * 80)
    
    correct_count = 0
    total_evaluated = 0

    print(f"  {'User':>4} | {'Expected (Fraud?)':>17} | {'Actual Engine':>15} | {'Match':>5} | {'Claim Statement'}")
    print(f"  {'-'*4} | {'-'*17} | {'-'*15} | {'-'*5} | {'-'*30}")

    for r in results:
        # Only evaluate accuracy if the request actually completed successfully
        if r["completed"] and r["actual_fraud"] is not None:
            total_evaluated += 1
            
            # Check if expected matches actual
            is_match = (r["expected_fraud"] == r["actual_fraud"])
            
            if is_match:
                correct_count += 1
                match_icon = "✅"
            else:
                match_icon = "❌"
            
            exp_str = str(r["expected_fraud"])
            act_str = str(r["actual_fraud"])
            short_claim = r["claim_text"][:38] + ".." if len(r["claim_text"]) > 38 else r["claim_text"]
            
            print(f"  {r['user_id']:>4} | {exp_str:>17} | {act_str:>15} | {match_icon:>5} | {short_claim}")

    print("-" * 80)
    if total_evaluated > 0:
        accuracy_percentage = (correct_count / total_evaluated) * 100
        print(f"  🧠 AI ACCURACY SCORE: {correct_count} correct out of {total_evaluated} evaluated ({accuracy_percentage:.1f}%)")
        
        if accuracy_percentage >= 90:
            print("  Verdict: Excellent! The AI is highly accurate at detecting fabricated claims.")
        elif accuracy_percentage >= 70:
            print("  Verdict: Good, but there is room for prompt-tuning or better model selection.")
        else:
            print("  Verdict: Poor accuracy. The AI prompt/logic needs significant refinement.")
    else:
        print("  🧠 AI ACCURACY SCORE: 0 / 0 (No successful responses to evaluate)")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(main())