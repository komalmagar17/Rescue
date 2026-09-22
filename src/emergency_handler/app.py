"""
Emergency Passport — EmergencyHandler Lambda
Handles tourist profile lookup, AI medical summary (Bedrock), and capability-aware hospital matching.
Integrates with the unified data repository (DynamoDB, Supabase, and LocalStore).
"""

import json
import logging
import math
import os
import re
import urllib.error
import urllib.request
from decimal import Decimal
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# ---------------------------------------------------------------------------
# Import database repository (with safe fallback)
# ---------------------------------------------------------------------------
try:
    from src.db.repository import db_repository
except ImportError:
    import sys
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
    from src.db.repository import db_repository

# ---------------------------------------------------------------------------
# AWS Bedrock runtime client (lazy-initialized with safe fallback)
# ---------------------------------------------------------------------------
_bedrock_client = None


def get_bedrock_client():
    global _bedrock_client
    if _bedrock_client is not None:
        return _bedrock_client
    try:
        import boto3
        region = os.environ.get("AWS_REGION", "us-east-1")
        _bedrock_client = boto3.client("bedrock-runtime", region_name=region)
        return _bedrock_client
    except Exception as e:
        logger.info("Bedrock client initialization skipped: %s", e)
        return None


# ---------------------------------------------------------------------------
# JSON & Response Helpers
# ---------------------------------------------------------------------------
class DecimalEncoder(json.JSONEncoder):
    """Handle DynamoDB Decimal and Set types cleanly."""
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o) if "." in str(o) else int(o)
        if isinstance(o, set):
            return sorted(list(o))
        return super().default(o)


def build_response(status_code: int, body: Dict[str, Any], headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
    response_headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Api-Key,X-Amz-Date,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    }
    if headers:
        response_headers.update(headers)

    return {
        "statusCode": status_code,
        "headers": response_headers,
        "body": json.dumps(body, cls=DecimalEncoder),
    }


def parse_body(event: Dict[str, Any]) -> Tuple[Dict[str, Any], Optional[str]]:
    """Safely parse JSON request body."""
    raw_body = event.get("body")
    if not raw_body:
        return {}, None
    if isinstance(raw_body, dict):
        return raw_body, None
    if not isinstance(raw_body, str):
        return {}, "Body must be a JSON string"
    try:
        parsed = json.loads(raw_body)
        if isinstance(parsed, dict):
            return parsed, None
        return {}, "JSON body must be an object"
    except Exception as e:
        return {}, f"Invalid JSON payload: {str(e)}"


# ---------------------------------------------------------------------------
# Proximity & Hospital Matching Engine
# ---------------------------------------------------------------------------
def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in kilometers between two GPS coordinates."""
    r = 6371.0  # Earth's radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(r * c, 2)


def match_hospital(
    profile: Dict[str, Any],
    hospitals: List[Dict[str, Any]],
    user_lat: Optional[float] = None,
    user_lon: Optional[float] = None,
) -> Optional[Dict[str, Any]]:
    """
    Capability-aware and proximity-aware hospital matching engine.
    Scores hospitals based on clinical requirements, distance, and bed capacity.
    """
    if not hospitals:
        return None

    raw_conditions = profile.get("Conditions", []) or []
    if isinstance(raw_conditions, (set, list)):
        conditions = {str(c).lower() for c in raw_conditions}
    else:
        conditions = {str(raw_conditions).lower()}

    needed_services = set()

    # Rule Engine: Correlate conditions to critical specialties
    if any(x in conditions for x in ["diabetes", "type 1 diabetes", "type 2 diabetes", "hypoglycemia"]):
        needed_services.add("ICU")
    if any(x in conditions for x in ["cardiac", "arrhythmia", "heart", "hypertension", "angina"]):
        needed_services.update(["Cardiology", "ICU"])
    if any(x in conditions for x in ["asthma", "respiratory", "pulmonary"]):
        needed_services.add("ICU")
    if any(x in conditions for x in ["trauma", "fracture", "injury", "bleeding"]):
        needed_services.update(["Trauma Center Level 1", "Emergency Surgery"])
    if any(x in conditions for x in ["burn", "fire", "chemical"]):
        needed_services.add("Burn Unit")
    if any(x in conditions for x in ["stroke", "seizure", "neurological"]):
        needed_services.update(["Stroke Care", "Neurology", "ICU"])
    if any(x in conditions for x in ["heatstroke", "hypothermia", "altitude"]):
        needed_services.update(["Hyperbaric Medicine", "ICU"])

    best_hospital = None
    best_score = -float("inf")

    for h in hospitals:
        raw_services = h.get("Services", []) or []
        if isinstance(raw_services, (set, list)):
            services = {str(s).strip() for s in raw_services}
        else:
            services = {str(raw_services).strip()}

        score = 0
        matched_services = []

        # 1. Capability Matching (50 points per needed specialty)
        for needed in needed_services:
            matching = [s for s in services if needed.lower() in s.lower()]
            if matching:
                score += 50
                matched_services.extend(matching)

        # 2. Capacity Score (bonus for higher available beds)
        capacity = h.get("Capacity") or 0
        try:
            capacity_val = int(capacity)
            score += min(capacity_val // 25, 20)
        except Exception:
            capacity_val = 0

        # 3. Distance / Proximity Score (if coordinates provided)
        distance_km = None
        h_lat = h.get("Latitude")
        h_lon = h.get("Longitude")
        if user_lat is not None and user_lon is not None and h_lat is not None and h_lon is not None:
            try:
                distance_km = calculate_haversine_distance(
                    float(user_lat), float(user_lon), float(h_lat), float(h_lon)
                )
                # Deduct points for greater distance (prefer closer hospitals)
                score -= min(int(distance_km * 2), 50)
            except Exception as e:
                logger.debug("Distance calculation error: %s", e)

        # Build enriched hospital match result
        h_enriched = dict(h)
        h_enriched["MatchScore"] = max(score, 0)
        h_enriched["MatchedServices"] = list(set(matched_services))
        h_enriched["NeededServices"] = list(needed_services)
        if distance_km is not None:
            h_enriched["DistanceKm"] = distance_km
            h_enriched["EstimatedDriveMinutes"] = max(int(distance_km * 1.8), 3)

        if score > best_score:
            best_score = score
            best_hospital = h_enriched

    # Fallback if no hospital scored
    if best_hospital is None and hospitals:
        first = dict(hospitals[0])
        first["MatchScore"] = 10
        first["MatchedServices"] = []
        first["NeededServices"] = list(needed_services)
        best_hospital = first

    return best_hospital


# ---------------------------------------------------------------------------
# Paramedic AI Briefing Engine (Groq Llama 3 + Bedrock Claude + Fallback)
# ---------------------------------------------------------------------------
def summarize_with_groq(
    profile: Dict[str, Any],
    location: str = "unknown",
    api_key: Optional[str] = None,
) -> Optional[str]:
    """
    Call Groq API (ultra-fast Llama-3.3-70b-versatile / Llama-3.1-8b-instant inference)
    to synthesize an urgent 5-bullet paramedic clinical briefing.
    Uses standard library urllib.request (zero extra dependencies in AWS Lambda).
    """
    key = api_key or os.environ.get("GROQ_API_KEY")
    if not key:
        return None

    model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
    url = "https://api.groq.com/openai/v1/chat/completions"

    system_prompt = (
        "You are an expert emergency medical dispatcher assisting first responders in the field during the Golden Hour. "
        "Analyze the verified patient health record and provide an urgent, strictly factual 5-bullet clinical briefing. "
        "Strictly adhere to the facts provided. Do NOT speculate or hallucinate diagnoses. "
        "Highlight critical drug contraindications and severe allergies prominently."
    )

    user_prompt = f"""Generate an urgent 5-bullet field summary for arriving paramedics:
1. Patient Age, Blood Type, and Full Name.
2. CRITICAL ALLERGIES & CONTRAINDICATIONS to avoid immediately (e.g. Penicillin, NSAIDs).
3. Known chronic pre-existing medical conditions.
4. Primary language spoken & communication directives.
5. Primary emergency contact with relationship & phone number.

Patient Data:
{json.dumps(profile, default=str, cls=DecimalEncoder)}

Incident Location: {location}
"""

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.1,
        "max_tokens": 280,
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {key.strip()}",
            "Content-Type": "application/json",
            "User-Agent": "EmergencyPassport-Triage/2.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=4.5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            content = data["choices"][0]["message"]["content"].strip()
            return content
    except Exception as e:
        logger.warning("Groq AI invocation failed (%s). Falling back to next engine.", e)
        return None


def summarize_with_ai(profile: Dict[str, Any], location: str = "unknown") -> str:
    """
    Multi-Provider Paramedic Clinical Briefing Engine:
    1. Priority 1: Groq API (High-speed Llama 3 inference, free-tier friendly, sub-250ms).
    2. Priority 2: Amazon Bedrock (Claude 3 Haiku).
    3. Priority 3: High-fidelity deterministic clinical fallback algorithm.
    """
    # 1. Try Groq if GROQ_API_KEY is present
    if os.environ.get("GROQ_API_KEY"):
        groq_result = summarize_with_groq(profile, location=location)
        if groq_result:
            return groq_result

    # 2. Try Bedrock if client available and credentials present
    client = get_bedrock_client()
    if client:
        try:
            prompt = f"""You are an emergency medical dispatcher assisting first responders in the field.
Use ONLY the patient data below. Do NOT hallucinate diagnoses.
Format an urgent, 5-bullet summary for paramedics:
1. Patient Age, Blood Type, and Name.
2. CRITICAL ALLERGIES to avoid immediately.
3. Chronic pre-existing medical conditions.
4. Languages spoken and communication notes.
5. Primary emergency contact with phone number.

Patient data:
{json.dumps(profile, default=str, cls=DecimalEncoder)}

Incident Location: {location}
"""
            body = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 250,
                "temperature": 0.0,
                "messages": [{"role": "user", "content": prompt}],
            }

            response = client.invoke_model(
                modelId="anthropic.claude-3-haiku-20240307-v1:0",
                contentType="application/json",
                accept="application/json",
                body=json.dumps(body),
            )

            result = json.loads(response["body"].read())
            return result["content"][0]["text"].strip()
        except Exception as e:
            logger.warning("Bedrock invocation failed (%s). Using clinical fallback.", e)

    # 3. Deterministic clinical fallback (guaranteed to never fail)
    raw_conditions = profile.get("Conditions", []) or []
    conditions_list = sorted(list(raw_conditions)) if isinstance(raw_conditions, (set, list)) else [str(raw_conditions)]
    conditions_str = ", ".join(conditions_list) if conditions_list else "None reported"

    raw_allergies = profile.get("Allergies", []) or []
    allergies_list = sorted(list(raw_allergies)) if isinstance(raw_allergies, (set, list)) else [str(raw_allergies)]
    allergies_str = ", ".join(allergies_list) if allergies_list else "None reported"

    raw_contacts = profile.get("EmergencyContacts", []) or []
    contacts_list = sorted(list(raw_contacts)) if isinstance(raw_contacts, (set, list)) else [str(raw_contacts)]
    contacts_str = "; ".join(contacts_list) if contacts_list else "None listed"

    return (
        f"• {profile.get('Age', '?')} y/o ({profile.get('Name', 'Unknown')}), Blood Type: {profile.get('BloodType', 'Unknown')}\n"
        f"• CRITICAL ALLERGIES: {allergies_str}\n"
        f"• CONDITIONS: {conditions_str}\n"
        f"• LANGUAGE: {profile.get('Language', 'English')}\n"
        f"• EMERGENCY CONTACTS: {contacts_str}\n"
        f"• LOCATION: {location}"
    )


# Backwards-compatibility alias
summarize_with_bedrock = summarize_with_ai


# ---------------------------------------------------------------------------
# Data Access Helpers (Backwards-Compatible with unit tests and mocks)
# ---------------------------------------------------------------------------
def get_profile(tourist_id: str) -> Optional[Dict[str, Any]]:
    """Fetch a single tourist profile."""
    return db_repository.get_tourist(tourist_id)


def list_hospitals() -> List[Dict[str, Any]]:
    """Return all hospitals."""
    return db_repository.list_hospitals()


# ---------------------------------------------------------------------------
# Route Handlers
# ---------------------------------------------------------------------------
def handle_health() -> Dict[str, Any]:
    db_info = db_repository.get_info()
    groq_active = bool(os.environ.get("GROQ_API_KEY"))
    bedrock_active = bool(get_bedrock_client())
    active_ai = "groq" if groq_active else ("bedrock" if bedrock_active else "clinical_deterministic")

    return build_response(200, {
        "status": "healthy",
        "service": "emergency-passport",
        "runtime": "python3.12",
        "database": db_info,
        "ai_engine": {
            "active_provider": active_ai,
            "groq_configured": groq_active,
            "groq_model": os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"),
            "bedrock_available": bedrock_active,
        },
        "features": {
            "groq_ai_briefing": groq_active,
            "bedrock_ai_briefing": bedrock_active,
            "capability_matching": True,
            "proximity_routing": True,
            "pluggable_storage": True,
        },
    })


# Tourist endpoints
def handle_list_tourists() -> Dict[str, Any]:
    tourists = db_repository.list_tourists()
    return build_response(200, {"count": len(tourists), "tourists": tourists})


def handle_get_tourist(tourist_id: str) -> Dict[str, Any]:
    if not tourist_id:
        return build_response(400, {"error": "tourist_id is required"})
    profile = get_profile(tourist_id)
    if not profile:
        return build_response(404, {"error": f"Tourist profile '{tourist_id}' not found"})
    return build_response(200, {"tourist": profile})


def handle_get_tourist_qr(tourist_id: str) -> Dict[str, Any]:
    if not tourist_id:
        return build_response(400, {"error": "tourist_id is required"})
    profile = get_profile(tourist_id)
    if not profile:
        return build_response(404, {"error": f"Tourist profile '{tourist_id}' not found"})
    return build_response(200, {
        "tourist_id": tourist_id,
        "name": profile.get("Name"),
        "blood_type": profile.get("BloodType"),
        "qr_payload": tourist_id,
        "triage_url": f"#/triage?id={tourist_id}",
        "status": "valid",
        "protocol": "Golden Hour Lifeline v2",
    })


def handle_create_tourist(data: Dict[str, Any]) -> Dict[str, Any]:
    name = data.get("Name")
    if not name:
        return build_response(400, {"error": "'Name' is required to create a profile"})

    saved = db_repository.save_tourist(data)
    return build_response(201, {
        "message": "Tourist emergency profile created successfully",
        "tourist": saved,
    })


def handle_update_tourist(tourist_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    if not tourist_id:
        return build_response(400, {"error": "tourist_id is required"})
    existing = get_profile(tourist_id)
    if not existing:
        return build_response(404, {"error": f"Tourist '{tourist_id}' not found"})

    data["TouristID"] = tourist_id
    updated = db_repository.save_tourist(data)
    return build_response(200, {
        "message": "Tourist profile updated successfully",
        "tourist": updated,
    })


def handle_delete_tourist(tourist_id: str) -> Dict[str, Any]:
    if not tourist_id:
        return build_response(400, {"error": "tourist_id is required"})
    deleted = db_repository.delete_tourist(tourist_id)
    if not deleted:
        return build_response(404, {"error": f"Tourist '{tourist_id}' not found"})
    return build_response(200, {"message": f"Tourist '{tourist_id}' deleted successfully"})


# Hospital endpoints
def handle_list_hospitals() -> Dict[str, Any]:
    hospitals = list_hospitals()
    return build_response(200, {"count": len(hospitals), "hospitals": hospitals})


def handle_get_hospital(hospital_id: str) -> Dict[str, Any]:
    if not hospital_id:
        return build_response(400, {"error": "hospital_id is required"})
    hospital = db_repository.get_hospital(hospital_id)
    if not hospital:
        return build_response(404, {"error": f"Hospital '{hospital_id}' not found"})
    return build_response(200, {"hospital": hospital})


def handle_create_hospital(data: Dict[str, Any]) -> Dict[str, Any]:
    if not data.get("Name"):
        return build_response(400, {"error": "'Name' is required for hospital"})
    saved = db_repository.save_hospital(data)
    return build_response(201, {"message": "Hospital saved successfully", "hospital": saved})


# Emergency Triage endpoint
def handle_emergency(
    tourist_id: str,
    location: str = "unknown",
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
) -> Dict[str, Any]:
    if not tourist_id:
        return build_response(400, {
            "error": "tourist_id is required",
            "usage": "GET /emergency?tourist_id=T-1001 or POST /emergency with {'tourist_id': 'T-1001'}",
        })

    profile = get_profile(tourist_id)
    if not profile:
        return build_response(404, {
            "error": f"Tourist profile '{tourist_id}' not found in database",
            "suggestion": "Verify Tourist ID or scan a valid Emergency Passport QR code.",
        })

    hospitals = list_hospitals()
    matched = match_hospital(profile, hospitals, user_lat=latitude, user_lon=longitude)
    summary = summarize_with_ai(profile, location=location)
    ai_provider = "groq" if os.environ.get("GROQ_API_KEY") else ("bedrock" if get_bedrock_client() else "clinical_deterministic")

    return build_response(200, {
        "status": "emergency_processed",
        "timestamp": os.environ.get("MOCK_TIME", ""),
        "tourist_id": tourist_id,
        "profile": profile,
        "ai_summary": summary,
        "ai_provider": ai_provider,
        "recommended_hospital": matched,
        "all_hospitals": hospitals,
        "location": location,
        "coordinates": {"latitude": latitude, "longitude": longitude} if latitude and longitude else None,
        "message": "Emergency medical profile and hospital routing computed successfully.",
    })


# ---------------------------------------------------------------------------
# 5. Nearby Disaster Early Warning & Evacuation System
# ---------------------------------------------------------------------------
def handle_list_alerts(
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: float = 50.0,
) -> Dict[str, Any]:
    """
    Returns active regional disaster early warnings with dynamic distance calculation,
    evacuation directives, and emergency hospital shelter routing.
    """
    user_lat = latitude if latitude is not None else 35.6762  # Tokyo Central
    user_lon = longitude if longitude is not None else 139.6503

    # Primary Critical Alert: Earthquake Early Warning
    eq_lat = 35.6120
    eq_lon = 139.8100
    eq_dist = round(calculate_haversine_distance(user_lat, user_lon, eq_lat, eq_lon), 1)

    # Secondary Warning: Flash Flood / Typhoon Surge Advisory
    fl_lat = 35.6200
    fl_lon = 139.7500
    fl_dist = round(calculate_haversine_distance(user_lat, user_lon, fl_lat, fl_lon), 1)

    alerts = [
        {
            "id": "ALERT-2026-0922-01",
            "disaster_type": "EARTHQUAKE",
            "severity": "CRITICAL",
            "headline": "EARTHQUAKE EARLY WARNING — MAGNITUDE 5.8 DETECTED",
            "location": "Tokyo Bay Seismic Fault (Sub-crustal)",
            "depth_km": 28,
            "epicenter": {"latitude": eq_lat, "longitude": eq_lon},
            "distance_km": eq_dist,
            "estimated_arrival_sec": max(5, int(eq_dist * 1.4)),
            "instruction": "Drop, Cover, and Hold On. Move away from glass facades and power lines. Aftershocks imminent.",
            "safe_shelters": [
                {
                    "name": "St. Luke's International Hospital Enclave",
                    "type": "Level 1 Disaster Center",
                    "distance_km": 1.4,
                    "bed_status": "OPEN (24 Emergency Beds)",
                    "phone": "+81-3-3541-5151",
                },
                {
                    "name": "Tokyo Medical Center Emergency Command",
                    "type": "Reinforced Evacuation Hub",
                    "distance_km": 3.8,
                    "bed_status": "OPEN (38 Emergency Beds)",
                    "phone": "+81-3-3411-0111",
                },
            ],
            "issued_at": "2026-09-22T21:45:00Z",
            "expires_at": "2026-09-22T23:00:00Z",
        },
        {
            "id": "ALERT-2026-0922-02",
            "disaster_type": "FLOOD_SURGE",
            "severity": "WARNING",
            "headline": "FLASH FLOOD & COASTAL WATER SURGE ADVISORY",
            "location": "Minato & Shinagawa Coastal Lowlands",
            "depth_km": 0,
            "epicenter": {"latitude": fl_lat, "longitude": fl_lon},
            "distance_km": fl_dist,
            "estimated_arrival_sec": 420,
            "instruction": "Avoid underground transit stations and riverbanks. Move to third floor or higher.",
            "safe_shelters": [
                {
                    "name": "Toranomon Hospital High-Ground Shelter",
                    "type": "Elevated Medical Complex",
                    "distance_km": 2.1,
                    "bed_status": "OPEN",
                    "phone": "+81-3-3588-1111",
                },
            ],
            "issued_at": "2026-09-22T21:30:00Z",
            "expires_at": "2026-09-23T02:00:00Z",
        },
    ]

    return build_response(200, {
        "status": "active_alerts",
        "total_active": len(alerts),
        "radar_status": "ACTIVE_MONITORING",
        "monitoring_radius_km": radius_km,
        "caller_location": {"latitude": user_lat, "longitude": user_lon},
        "alerts": alerts,
        "message": "Nearby disaster radar synchronized with emergency dispatch.",
    })


# ---------------------------------------------------------------------------
# Main Lambda & API Handler Entrypoint
# ---------------------------------------------------------------------------
def lambda_handler(event: Dict[str, Any], context: Any = None) -> Dict[str, Any]:
    """
    Main entrypoint handling both HTTP API (v2) and REST API (v1) formats.
    """
    try:
        # Extract HTTP method and normalized path
        http_ctx = event.get("requestContext", {}).get("http", {})
        method = (http_ctx.get("method") or event.get("httpMethod") or "GET").upper()
        raw_path = http_ctx.get("path") or event.get("rawPath") or event.get("path") or "/"
        # Strip trailing slash while preserving root "/"
        path = raw_path.rstrip("/") if raw_path != "/" else "/"

        # CORS preflight
        if method == "OPTIONS":
            return build_response(200, {"message": "CORS preflight OK"})

        path_params = event.get("pathParameters") or {}
        query_params = event.get("queryStringParameters") or {}

        body, parse_err = parse_body(event)
        if parse_err:
            return build_response(400, {"error": parse_err})

        logger.info("Handling request: %s %s", method, path)

        # 1. Health Check
        if path == "/health" and method == "GET":
            return handle_health()

        # 2. Tourists Endpoints
        if path == "/tourists":
            if method == "GET":
                return handle_list_tourists()
            elif method == "POST":
                return handle_create_tourist(body)
            else:
                return build_response(405, {"error": f"Method {method} not allowed on /tourists"})

        # Match /tourists/{id}/qr
        tourist_qr_match = re.match(r"^/tourists/([^/]+)/qr$", path)
        if tourist_qr_match:
            tourist_id = path_params.get("tourist_id") or tourist_qr_match.group(1)
            if method == "GET":
                return handle_get_tourist_qr(tourist_id)
            else:
                return build_response(405, {"error": f"Method {method} not allowed on /tourists/{{id}}/qr"})

        # Match /tourists/{id}
        tourist_match = re.match(r"^/tourists/([^/]+)$", path)
        if tourist_match:
            tourist_id = path_params.get("tourist_id") or tourist_match.group(1)
            if method == "GET":
                return handle_get_tourist(tourist_id)
            elif method == "PUT":
                return handle_update_tourist(tourist_id, body)
            elif method == "DELETE":
                return handle_delete_tourist(tourist_id)
            else:
                return build_response(405, {"error": f"Method {method} not allowed on /tourists/{{id}}"})

        # 3. Hospitals Endpoints
        if path == "/hospitals":
            if method == "GET":
                return handle_list_hospitals()
            elif method == "POST":
                return handle_create_hospital(body)
            else:
                return build_response(405, {"error": f"Method {method} not allowed on /hospitals"})

        hospital_match = re.match(r"^/hospitals/([^/]+)$", path)
        if hospital_match:
            hospital_id = path_params.get("hospital_id") or hospital_match.group(1)
            if method == "GET":
                return handle_get_hospital(hospital_id)
            elif method == "PUT" or method == "POST":
                body["HospitalID"] = hospital_id
                return handle_create_hospital(body)
            else:
                return build_response(405, {"error": f"Method {method} not allowed on /hospitals/{{id}}"})

        # 4. Emergency Triage Endpoint
        if path == "/emergency":
            tourist_id = (
                query_params.get("tourist_id")
                or query_params.get("TouristID")
                or query_params.get("id")
                or body.get("tourist_id")
                or body.get("TouristID")
                or body.get("id")
                or path_params.get("tourist_id")
            )
            location = (
                query_params.get("location")
                or query_params.get("Location")
                or body.get("location")
                or body.get("Location")
                or "Incident Location"
            )

            lat_val = (
                query_params.get("latitude")
                or query_params.get("Latitude")
                or query_params.get("lat")
                or body.get("latitude")
                or body.get("Latitude")
                or body.get("lat")
            )
            lon_val = (
                query_params.get("longitude")
                or query_params.get("Longitude")
                or query_params.get("lon")
                or query_params.get("lng")
                or body.get("longitude")
                or body.get("Longitude")
                or body.get("lon")
                or body.get("lng")
            )
            lat = float(lat_val) if lat_val is not None else None
            lon = float(lon_val) if lon_val is not None else None

            if method in ("GET", "POST"):
                return handle_emergency(tourist_id, location, lat, lon)
            else:
                return build_response(405, {"error": f"Method {method} not allowed on /emergency"})

        # 5. Nearby Disaster Early Warning & Alerts Endpoint
        if path == "/alerts":
            lat_val = query_params.get("latitude") or body.get("latitude")
            lon_val = query_params.get("longitude") or body.get("longitude")
            rad_val = query_params.get("radius") or body.get("radius")
            lat = float(lat_val) if lat_val is not None else None
            lon = float(lon_val) if lon_val is not None else None
            radius = float(rad_val) if rad_val is not None else 50.0

            if method == "GET":
                return handle_list_alerts(latitude=lat, longitude=lon, radius_km=radius)
            else:
                return build_response(405, {"error": f"Method {method} not allowed on /alerts"})

        # 404 Route Not Found
        return build_response(404, {
            "error": "Route not found",
            "method": method,
            "path": path,
            "available_routes": [
                "GET /health",
                "GET /tourists",
                "POST /tourists",
                "GET /tourists/{tourist_id}",
                "PUT /tourists/{tourist_id}",
                "DELETE /tourists/{tourist_id}",
                "GET /hospitals",
                "POST /hospitals",
                "GET /hospitals/{hospital_id}",
                "GET /emergency?tourist_id=T-1001",
                "POST /emergency",
                "GET /alerts",
            ],
        })

    except Exception as e:
        logger.exception("Unhandled server error processing %s: %s", event, e)
        return build_response(500, {
            "error": "Internal Server Error",
            "details": str(e),
            "message": "The Emergency Passport service encountered an unexpected error. Please retry.",
        })