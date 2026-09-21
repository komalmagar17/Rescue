"""
Emergency Passport - EmergencyHandler Lambda
Handles tourist profile lookup, AI medical summary (Bedrock), and hospital matching.
"""

import json
import logging
import os
from decimal import Decimal
from typing import Any, Dict, List, Optional

import boto3
from botocore.exceptions import ClientError

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------
TOURIST_PROFILES_TABLE = os.environ.get("TOURIST_PROFILES_TABLE", "TouristProfiles")
HOSPITALS_TABLE = os.environ.get("HOSPITALS_TABLE", "Hospitals")
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

# ---------------------------------------------------------------------------
# AWS clients (created once per cold start)
# ---------------------------------------------------------------------------
dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)
bedrock_runtime = boto3.client("bedrock-runtime", region_name=AWS_REGION)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
class DecimalEncoder(json.JSONEncoder):
    """Handle DynamoDB Decimal types."""
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        if isinstance(o, set):
            return list(o)
        return super().default(o)


def build_response(status_code: int, body: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Api-Key",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        },
        "body": json.dumps(body, cls=DecimalEncoder),
    }


def get_profile(tourist_id: str) -> Optional[Dict[str, Any]]:
    """Fetch a single tourist profile from DynamoDB."""
    table = dynamodb.Table(TOURIST_PROFILES_TABLE)
    try:
        resp = table.get_item(Key={"TouristID": tourist_id})
        return resp.get("Item")
    except ClientError as e:
        logger.error("DynamoDB get_item failed: %s", e)
        return None


def list_hospitals() -> List[Dict[str, Any]]:
    """Return all hospitals (scan is fine for small demo dataset)."""
    table = dynamodb.Table(HOSPITALS_TABLE)
    try:
        resp = table.scan()
        return resp.get("Items", [])
    except ClientError as e:
        logger.error("DynamoDB scan failed: %s", e)
        return []


def match_hospital(profile: Dict[str, Any], hospitals: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Simple capability-aware matching.
    Returns the best hospital based on required services.
    """
    if not hospitals:
        return None

    conditions = {c.lower() for c in profile.get("Conditions", [])}
    allergies = {a.lower() for a in profile.get("Allergies", [])}

    needed_services = set()

    # Rule engine (easy to extend)
    if any(x in conditions for x in ["diabetes", "type 1 diabetes", "type 2 diabetes"]):
        needed_services.add("ICU")
    if any(x in conditions for x in ["cardiac", "arrhythmia", "heart", "hypertension"]):
        needed_services.update(["Cardiology", "ICU"])
    if any(x in conditions for x in ["asthma", "respiratory"]):
        needed_services.add("ICU")
    if any(x in conditions for x in ["trauma", "fracture", "injury"]):
        needed_services.add("Trauma Center Level 1")
        needed_services.add("Trauma Care")

    best = None
    best_score = -1

    for h in hospitals:
        services = {s for s in h.get("Services", [])}
        score = 0

        # Reward matching required services
        for needed in needed_services:
            if any(needed.lower() in s.lower() for s in services):
                score += 50

        # Small bonus for higher capacity
        score += min(h.get("Capacity", 0) // 50, 10)

        if score > best_score:
            best_score = score
            best = h

    # Fallback: highest capacity hospital
    if best is None:
        best = max(hospitals, key=lambda x: x.get("Capacity", 0))

    return best


def summarize_with_bedrock(profile: Dict[str, Any], location: str = "unknown") -> str:
    """
    Call Amazon Bedrock (Claude 3 Haiku) to create a short medical summary.
    Falls back to a deterministic local summary if Bedrock is unavailable.
    """
    # ---------- Offline / fallback summary (always works) ----------
    conditions = ", ".join(sorted(profile.get("Conditions", []))) or "None reported"
    allergies = ", ".join(sorted(profile.get("Allergies", []))) or "None reported"
    contacts = ", ".join(sorted(profile.get("EmergencyContacts", []))) or "None listed"

    fallback = (
        f"• {profile.get('Age', '?')} y/o, Blood type {profile.get('BloodType', 'Unknown')}\n"
        f"• Conditions: {conditions}\n"
        f"• Allergies: {allergies}\n"
        f"• Language: {profile.get('Language', 'Unknown')}\n"
        f"• Emergency contacts: {contacts}\n"
        f"• Location of incident: {location}"
    )

    # ---------- Try Bedrock ----------
    try:
        prompt = f"""You are an emergency medical summarizer for first responders.
Use ONLY the data provided. Do NOT diagnose or invent facts.
Return a short bullet-list (max 6 lines) optimized for paramedics.
Start with age + blood type + key conditions + allergies.

Patient data:
{json.dumps(profile, default=str, cls=DecimalEncoder)}

Incident location: {location}
"""

        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 280,
            "messages": [{"role": "user", "content": prompt}],
        }

        response = bedrock_runtime.invoke_model(
            modelId="anthropic.claude-3-haiku-20240307-v1:0",
            contentType="application/json",
            accept="application/json",
            body=json.dumps(body),
        )

        result = json.loads(response["body"].read())
        summary = result["content"][0]["text"].strip()
        logger.info("Bedrock summary generated successfully")
        return summary

    except Exception as e:
        logger.warning("Bedrock unavailable or failed (%s). Using fallback summary.", str(e))
        return fallback


# ---------------------------------------------------------------------------
# Route handlers
# ---------------------------------------------------------------------------
def handle_health() -> Dict[str, Any]:
    return build_response(200, {
        "status": "healthy",
        "service": "emergency-passport",
        "runtime": "python3.12",
        "tables": {
            "tourist_profiles": TOURIST_PROFILES_TABLE,
            "hospitals": HOSPITALS_TABLE,
        },
    })


def handle_get_tourist(tourist_id: str) -> Dict[str, Any]:
    if not tourist_id:
        return build_response(400, {"error": "tourist_id is required"})

    profile = get_profile(tourist_id)
    if not profile:
        return build_response(404, {"error": f"Tourist {tourist_id} not found"})

    return build_response(200, {"tourist": profile})


def handle_list_hospitals() -> Dict[str, Any]:
    hospitals = list_hospitals()
    return build_response(200, {"count": len(hospitals), "hospitals": hospitals})


def handle_emergency(tourist_id: str, location: str = "unknown") -> Dict[str, Any]:
    if not tourist_id:
        return build_response(400, {"error": "tourist_id is required"})

    profile = get_profile(tourist_id)
    if not profile:
        return build_response(404, {"error": f"Tourist {tourist_id} not found"})

    hospitals = list_hospitals()
    matched = match_hospital(profile, hospitals)
    summary = summarize_with_bedrock(profile, location)

    return build_response(200, {
        "status": "emergency_processed",
        "tourist_id": tourist_id,
        "profile": profile,
        "ai_summary": summary,
        "recommended_hospital": matched,
        "location": location,
        "message": "First responders can use the AI summary and hospital recommendation immediately.",
    })


# ---------------------------------------------------------------------------
# Main entrypoint
# ---------------------------------------------------------------------------
def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    logger.info("Event received: %s", json.dumps(event, default=str))

    # Support both HTTP API and REST API event formats
    http_ctx = event.get("requestContext", {}).get("http", {})
    method = http_ctx.get("method") or event.get("httpMethod", "GET")
    path = http_ctx.get("path") or event.get("path", "/")
    path_params = event.get("pathParameters") or {}
    query_params = event.get("queryStringParameters") or {}

    # Also support direct invocation / test events
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"]) if isinstance(event["body"], str) else event["body"]
        except Exception:
            body = {}

    logger.info("method=%s path=%s", method, path)

    # ---- Routing ----
    if path == "/health" or path.endswith("/health"):
        return handle_health()

    if path.startswith("/tourists/") or path.endswith("/tourists/{tourist_id}"):
        tourist_id = path_params.get("tourist_id") or path.split("/")[-1]
        return handle_get_tourist(tourist_id)

    if path == "/hospitals" or path.endswith("/hospitals"):
        return handle_list_hospitals()

    if path == "/emergency" or path.endswith("/emergency"):
        # Accept tourist_id from query string, path, or JSON body
        tourist_id = (
            query_params.get("tourist_id")
            or path_params.get("tourist_id")
            or body.get("tourist_id")
        )
        location = (
            query_params.get("location")
            or body.get("location")
            or "unknown"
        )
        return handle_emergency(tourist_id, location)

    # Fallback
    return build_response(404, {
        "error": "Route not found",
        "method": method,
        "path": path,
        "available_routes": [
            "GET /health",
            "GET /tourists/{tourist_id}",
            "GET /hospitals",
            "GET|POST /emergency?tourist_id=T-1001&location=Temple",
        ],
    })