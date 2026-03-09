"""
Neta.ai — Complaint Lambda  (FINAL PRODUCTION VERSION)
────────────────────────────────────────────────────────
Receives complaint events from the Router Lambda, runs AI classification
via AWS Bedrock, stores the complaint in Supabase, and replies to the
citizen in their own language.

Event schema (sent by Router Lambda)
──────────────────────────────────────
{
    "phone":          "+919812345678",
    "type":           "text | image | location",
    "message":        { ...WhatsApp message object... },
    "category_id":    "<uuid> | null",      # pre-selected via guided menu
    "subcategory_id": "<uuid> | null",      # pre-selected via guided menu
    "location_lat":   12.9716,              # from location pin or None
    "location_lon":   77.5946
}

AI contract
────────────
• category_id  provided → AI must NOT override category
• subcategory_id provided → AI must NOT override subcategory
• Both missing   → AI classifies both
• AI always detects: language, severity, department, location_text, summary

DB schema additions used here (add if missing)
───────────────────────────────────────────────
  ALTER TABLE citizen_complaints
    ADD COLUMN IF NOT EXISTS latitude        DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS longitude       DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS ai_summary      TEXT,
    ADD COLUMN IF NOT EXISTS category_id     UUID REFERENCES complaint_categories(id),
    ADD COLUMN IF NOT EXISTS subcategory_id  UUID REFERENCES complaint_subcategories(id),
    ADD COLUMN IF NOT EXISTS image_media_id    TEXT,
    ADD COLUMN IF NOT EXISTS citizen_language  TEXT;
"""

import json
import os
import re
import logging
import urllib.request
import urllib.error
import boto3
import psycopg2
import psycopg2.extras
import psycopg2.extensions

# ─── LOGGING ──────────────────────────────────────────────────────────────────

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# ─── ENV ──────────────────────────────────────────────────────────────────────

WHATSAPP_TOKEN  = os.environ["WHATSAPP_TOKEN"]
PHONE_NUMBER_ID = os.environ["PHONE_NUMBER_ID"]

DB_HOST = os.environ["DB_HOST"]
DB_NAME = os.environ["DB_NAME"]
DB_USER = os.environ["DB_USER"]
DB_PASS = os.environ["DB_PASS"]
DB_PORT = os.environ.get("DB_PORT", "5432")

MODEL_ID = os.environ["BEDROCK_MODEL"]  # e.g. anthropic.claude-3-haiku-20240307-v1:0

bedrock = boto3.client(
    "bedrock-runtime",
    region_name=os.environ.get("AWS_REGION", "us-east-1")
)

# ─── MULTILINGUAL REPLY TEMPLATES ─────────────────────────────────────────────

REPLY_TEMPLATES = {
    "english": (
        "✅ Your complaint has been registered!\n\n"
        "🆔 Complaint ID: {id}\n"
        "🏛️ Department: {dept}\n"
        "⚠️ Severity: {severity}\n"
        "📋 Summary: {summary}\n\n"
        "We will look into this soon. Thank you for reporting."
    ),
    "hindi": (
        "✅ आपकी शिकायत दर्ज कर ली गई है!\n\n"
        "🆔 शिकायत ID: {id}\n"
        "🏛️ विभाग: {dept}\n"
        "⚠️ गंभीरता: {severity}\n"
        "📋 विवरण: {summary}\n\n"
        "हम जल्द ही इस पर कार्रवाई करेंगे। धन्यवाद।"
    ),
    "marathi": (
        "✅ तुमची तक्रार नोंदवली गेली आहे!\n\n"
        "🆔 तक्रार ID: {id}\n"
        "🏛️ विभाग: {dept}\n"
        "⚠️ तीव्रता: {severity}\n"
        "📋 सारांश: {summary}\n\n"
        "आम्ही लवकरच यावर कारवाई करू. धन्यवाद।"
    ),
    "gujarati": (
        "✅ તમારી ફરિયાદ નોંધવામાં આવી છે!\n\n"
        "🆔 ફરિયાદ ID: {id}\n"
        "🏛️ વિભાગ: {dept}\n"
        "⚠️ ગંભીરતા: {severity}\n"
        "📋 સારાંશ: {summary}\n\n"
        "અમે ટૂંક સમયમાં તેની તપાસ કરીશું. આભાર।"
    ),
    "kannada": (
        "✅ ನಿಮ್ಮ ದೂರು ದಾಖಲಾಗಿದೆ!\n\n"
        "🆔 ದೂರು ID: {id}\n"
        "🏛️ ಇಲಾಖೆ: {dept}\n"
        "⚠️ ತೀವ್ರತೆ: {severity}\n"
        "📋 ಸಾರಾಂಶ: {summary}\n\n"
        "ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಇದನ್ನು ನೋಡುತ್ತೇವೆ. ಧನ್ಯವಾದ."
    ),
}

ERROR_REPLIES = {
    "english": "⚠️ Sorry, we could not process your complaint right now. Please try again shortly.",
    "hindi":   "⚠️ क्षमा करें, अभी आपकी शिकायत दर्ज नहीं हो सकी। कृपया थोड़ी देर बाद पुनः प्रयास करें।",
    "marathi": "⚠️ माफ करा, सध्या तुमची तक्रार नोंदवता आली नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.",
    "gujarati": "⚠️ માફ કરશો, અત્યારે તમારી ફરિયાદ નોંધી શકાઈ નથી. કૃપા કરી થોડા સમય પછી ફરી પ્રયાસ કરો.",
    "kannada": "⚠️ ಕ್ಷಮಿಸಿ, ಈಗ ನಿಮ್ಮ ದೂರು ದಾಖಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
}

DUPLICATE_REPLIES = {
    "english": "ℹ️ We already received this complaint. No action needed from your side.",
    "hindi":   "ℹ️ यह शिकायत पहले से दर्ज है। आपको कुछ और करने की जरूरत नहीं।",
    "marathi": "ℹ️ ही तक्रार आधीच नोंदवली आहे। तुम्हाला पुन्हा काही करण्याची गरज नाही.",
    "gujarati": "ℹ️ આ ફરિયાદ પહેલેથી જ નોંધવામાં આવી છે. તમારે બીજું કંઈ કરવાની જરૂર નથી.",
    "kannada": "ℹ️ ಈ ದೂರು ಈಗಾಗಲೇ ದಾಖಲಾಗಿದೆ. ನಿಮ್ಮ ಕಡೆಯಿಂದ ಯಾವುದೇ ಕ್ರಮ ಅಗತ್ಯವಿಲ್ಲ.",
}

# Severity → emoji for reply
SEVERITY_EMOJI = {
    "critical": "🚨",
    "high":     "🔴",
    "medium":   "🟡",
    "low":      "🟢",
}

# AI fallback values when Bedrock fails completely
AI_FALLBACK = {
    "language":    "unknown",
    "category":    "other",
    "subcategory": None,
    "severity":    "medium",
    "department":  "municipal_corporation",
    "location":    None,
    "summary":     "",
    "confidence":  0.3,
}


# ══════════════════════════════════════════════════════════════════════════════
# DATABASE
# ══════════════════════════════════════════════════════════════════════════════

# Global connection — reused across warm Lambda invocations
_db_conn = None


def get_db():
    """
    Returns a live psycopg2 connection.
    Replaces connection if closed, None, or left in a broken transaction state.
    """
    global _db_conn
    needs_new = (
        _db_conn is None
        or _db_conn.closed != 0
        or _db_conn.status == psycopg2.extensions.STATUS_IN_TRANSACTION
    )
    if needs_new:
        if _db_conn and _db_conn.closed == 0:
            try:
                _db_conn.close()
            except Exception:
                pass
        _db_conn = psycopg2.connect(
            host=DB_HOST, database=DB_NAME,
            user=DB_USER, password=DB_PASS,
            port=DB_PORT, sslmode="require",
            connect_timeout=5,
            keepalives=1,
            keepalives_idle=60,
            keepalives_interval=10,
            keepalives_count=3,
        )
        logger.info("DB: new connection established")
    return _db_conn


def _safe_rollback():
    """Rolls back global connection without raising."""
    global _db_conn
    if _db_conn and _db_conn.closed == 0:
        try:
            _db_conn.rollback()
        except Exception as e:
            logger.warning(f"DB: rollback failed: {e}")


def is_duplicate(conn, message_id):
    """
    Returns True if this message_id was already inserted.
    Idempotency guard — WhatsApp webhooks can retry delivery.
    """
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id FROM citizen_complaints WHERE message_id = %s LIMIT 1",
            (message_id,)
        )
        return cur.fetchone() is not None


def get_or_create_citizen(conn, phone):
    """Returns existing citizen UUID or creates a new row. Uses cursor context manager."""
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM citizens WHERE phone_number = %s", (phone,))
        row = cur.fetchone()
        if row:
            return row[0]

        cur.execute(
            "INSERT INTO citizens (phone_number, conversation_state) VALUES (%s, 'idle') RETURNING id",
            (phone,)
        )
        citizen_id = cur.fetchone()[0]
        conn.commit()
        logger.info(f"DB: new citizen {citizen_id} for {phone}")
        return citizen_id


def lookup_category_name(conn, category_uuid):
    """Resolves a category UUID → category_name string for AI prompt context."""
    if not category_uuid:
        return None
    with conn.cursor() as cur:
        cur.execute(
            "SELECT category_name FROM complaint_categories WHERE id = %s", (category_uuid,)
        )
        row = cur.fetchone()
        return row[0] if row else None


def lookup_subcategory_name(conn, subcategory_uuid):
    """Resolves a subcategory UUID → subcategory_name string for AI prompt context."""
    if not subcategory_uuid:
        return None
    with conn.cursor() as cur:
        cur.execute(
            "SELECT subcategory_name FROM complaint_subcategories WHERE id = %s", (subcategory_uuid,)
        )
        row = cur.fetchone()
        return row[0] if row else None


def insert_complaint(conn, citizen_id, phone, raw_text, ai, message_id,
                     category_id, subcategory_id, location_lat, location_lon,
                     image_media_id=None, citizen_language=None):
    """
    Inserts a single complaint row.

    Priority rules for category / subcategory:
      • If router provided category_id  → use it, ignore ai["category"]
      • If router provided subcategory_id → use it, ignore ai["subcategory"]
      • Otherwise fall back to AI values (stored as text in complaint_category /
        complaint_subcategory for legacy compatibility)

    Location rules:
      • latitude / longitude come from the router (location pin coordinates)
      • location_text comes from AI extraction (e.g. "near station road")
      • Both are stored independently — they are different things

    Language columns:
      • language         → AI-detected language (analytics)
      • citizen_language → citizen's WhatsApp menu selection (reply source of truth)
    """
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO citizen_complaints (
                citizen_id, phone_number, raw_message,
                language, citizen_language,
                complaint_category, complaint_subcategory,
                category_id, subcategory_id,
                location_text, latitude, longitude,
                department, severity, ai_confidence,
                ai_summary, image_media_id,
                status, message_id
            ) VALUES (
                %s, %s, %s,
                %s, %s,
                %s, %s,
                %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s,
                'pending', %s
            )
            RETURNING id
            """,
            (
                citizen_id,
                phone,
                raw_text,
                # Language columns
                ai.get("language"),      # AI-detected (analytics only)
                citizen_language,        # router-provided (reply source of truth)
                # Text category — use AI value (human-readable label for dashboards)
                ai.get("category"),
                ai.get("subcategory"),
                # UUID FKs — prefer router-provided, fall back to None
                category_id,
                subcategory_id,
                # Location
                ai.get("location"),      # text extracted by AI
                location_lat,            # pin coordinates from router
                location_lon,
                # Classification
                ai.get("department"),
                ai.get("severity"),
                ai.get("confidence"),
                ai.get("summary"),
                image_media_id,
                # Dedup key
                message_id,
            )
        )
        complaint_id = cur.fetchone()[0]
    conn.commit()
    return complaint_id


def log_update(conn, complaint_id, update_type, message):
    """Writes a lifecycle event to complaint_updates. Failures are non-fatal."""
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO complaint_updates (complaint_id, update_type, update_message) VALUES (%s,%s,%s)",
                (complaint_id, update_type, message)
            )
        conn.commit()
    except Exception as e:
        logger.warning(f"DB: complaint_updates write failed (non-fatal): {e}")


# ══════════════════════════════════════════════════════════════════════════════
# WHATSAPP
# ══════════════════════════════════════════════════════════════════════════════

def send_whatsapp_message(to_number, message):
    url = f"https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages"
    payload = json.dumps({
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "text",
        "text": {"body": message[:4096]}   # WA hard limit
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload)
    req.add_header("Content-Type",  "application/json")
    req.add_header("Authorization", f"Bearer {WHATSAPP_TOKEN}")

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            logger.info(f"WA sent {resp.status}: {resp.read().decode()[:200]}")
    except urllib.error.HTTPError as e:
        logger.error(f"WA HTTP {e.code}: {e.read().decode()[:300]}")
    except Exception as e:
        logger.error(f"WA send failed: {e}")


# ══════════════════════════════════════════════════════════════════════════════
# BEDROCK AI
# ══════════════════════════════════════════════════════════════════════════════

def _build_prompt(complaint_text, msg_type, category_hint, subcategory_hint,
                  has_coords, has_image):
    """
    Builds the classification prompt.

    Key design decisions:
    • If category/subcategory were pre-selected by the citizen via menu,
      they are injected as FIXED values — the AI must not change them.
      This prevents AI from overriding a deliberate human choice.
    • severity rules are explicit so the model doesn't guess.
    • Return ONLY JSON — no preamble, no markdown fences.
    """

    category_instruction = (
        f'  "category": "{category_hint}",   // FIXED — do not change\n'
        if category_hint else
        '  "category": "road | garbage | water | electricity | noise | public_safety | environment | governance | emergency | other",\n'
    )

    subcategory_instruction = (
        f'  "subcategory": "{subcategory_hint}",   // FIXED — do not change\n'
        if subcategory_hint else
        '  "subcategory": "short label e.g. pothole, pipe_leak, streetlight — or null if unclear",\n'
    )

    context_notes = []
    if has_coords:
        context_notes.append("The citizen also sent their GPS coordinates (stored separately).")
    if has_image:
        context_notes.append("The citizen sent a photo. Treat the caption/description as the complaint text.")

    context_block = "\n".join(context_notes)

    return f"""You are an AI classifier for Neta.ai, a civic complaint system in India.

Citizen complaint received via WhatsApp:
\"\"\"{complaint_text}\"\"\"

{context_block}

Extract structured information. Return ONLY a valid JSON object — no markdown, no explanation, no extra text.

JSON schema:
{{
{category_instruction}\
{subcategory_instruction}\
  "language":   "english | hindi | marathi | gujarati | kannada | unknown",
  "severity":   "low | medium | high | critical",
  "department": "municipal_roads | waste_management | water_department | electricity_board | municipal_police | municipal_corporation | fire_department | other",
  "location":   "location reference extracted from text — or null if not mentioned",
  "summary":    "one concise sentence describing the issue, always in English",
  "confidence": 0.0 to 1.0
}}

Severity rules (follow strictly):
- critical → immediate danger to human life (gas leak, building collapse, open live wire)
- high     → infrastructure failure blocking daily life (road collapse, no water for 24h+)
- medium   → standard civic complaint (pothole, garbage pile, dim streetlight)
- low      → minor inconvenience (faded road marking, overgrown footpath)

Language detection: detect the primary language of the complaint text.
Summary: always write in English regardless of complaint language.
Return ONLY the JSON object. Nothing else."""


def _safe_parse_ai(raw):
    """
    Parses AI output defensively:
    1. Strip markdown fences (``` or ```json) the model sometimes adds
    2. Parse JSON
    3. Validate and sanitise each field
    4. Return a clean dict that is safe to write to DB
    """
    # Strip fences
    clean = raw.strip()
    clean = re.sub(r"^```(?:json)?\s*", "", clean)
    clean = re.sub(r"\s*```$", "", clean)

    parsed = json.loads(clean)   # raises JSONDecodeError on failure

    valid_languages  = {"english", "hindi", "marathi", "gujarati", "kannada", "unknown"}
    valid_severities = {"low", "medium", "high", "critical"}

    language  = str(parsed.get("language", "unknown")).lower()
    severity  = str(parsed.get("severity",  "medium")).lower()
    confidence = parsed.get("confidence", 0.5)
    try:
        confidence = float(confidence)
    except (TypeError, ValueError):
        confidence = 0.5

    return {
        "language":    language  if language  in valid_languages  else "unknown",
        "category":    str(parsed.get("category",    "other")).lower().strip(),
        "subcategory": str(parsed.get("subcategory", "")).lower().strip() or None,
        "severity":    severity  if severity  in valid_severities else "medium",
        "department":  str(parsed.get("department",  "municipal_corporation")).lower().strip(),
        "location":    str(parsed.get("location", "")).strip() or None,
        "summary":     str(parsed.get("summary",  "")).strip()[:500],
        "confidence":  confidence,
    }


def analyze_complaint(complaint_text, msg_type="text",
                      category_hint=None, subcategory_hint=None,
                      has_coords=False, has_image=False):
    """
    Sends the complaint to Bedrock for AI classification.

    Parameters
    ──────────
    complaint_text   Raw text from citizen (or image caption)
    category_hint    Human-readable category name if pre-selected via menu
    subcategory_hint Human-readable subcategory name if pre-selected
    has_coords       True if router sent GPS coordinates
    has_image        True if msg_type == "image"

    Returns a dict with: language, category, subcategory, severity,
                         department, location, summary, confidence
    """
    prompt = _build_prompt(
        complaint_text, msg_type,
        category_hint, subcategory_hint,
        has_coords, has_image
    )

    body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens":        600,
        "temperature":       0,       # deterministic output for classification
        "messages": [{"role": "user", "content": prompt}]
    })

    raw = ""
    try:
        response = bedrock.invoke_model(modelId=MODEL_ID, body=body)
        raw = json.loads(response["body"].read())["content"][0]["text"]
        logger.info(f"Bedrock raw response: {raw[:300]}")
        return _safe_parse_ai(raw)

    except json.JSONDecodeError:
        logger.warning(f"Bedrock non-JSON output: {raw[:300]}")
    except Exception as e:
        logger.error(f"Bedrock call failed: {e}")

    # Full fallback — system keeps working even if AI is down
    fallback = dict(AI_FALLBACK)
    fallback["summary"] = complaint_text[:200]
    return fallback


# ══════════════════════════════════════════════════════════════════════════════
# REPLY BUILDER
# ══════════════════════════════════════════════════════════════════════════════

def build_confirmation_reply(language, complaint_id, department, severity, summary):
    lang     = (language or "english").lower()
    template = REPLY_TEMPLATES.get(lang, REPLY_TEMPLATES["english"])
    sev_icon = SEVERITY_EMOJI.get(severity, "⚠️")

    return template.format(
        id=str(complaint_id)[:8].upper(),
        dept=(department or "Municipal Corporation").replace("_", " ").title(),
        severity=f"{sev_icon} {(severity or 'medium').title()}",
        summary=summary or "Civic issue reported.",
    )


# ══════════════════════════════════════════════════════════════════════════════
# MESSAGE EXTRACTION HELPERS
# ══════════════════════════════════════════════════════════════════════════════

def extract_complaint_text(msg_type, message):
    """
    Returns the best available text for AI classification.

    text     → message body
    image    → caption if present, else generic placeholder
    location → address name if present, else generic placeholder
    """
    if msg_type == "text":
        return message.get("text", {}).get("body", "").strip()

    if msg_type == "image":
        caption = message.get("image", {}).get("caption", "").strip()
        return caption if caption else "[Citizen sent a photo of a civic issue]"

    if msg_type == "location":
        name    = message.get("location", {}).get("name",    "").strip()
        address = message.get("location", {}).get("address", "").strip()
        parts   = [p for p in [name, address] if p]
        return f"Civic issue at: {', '.join(parts)}" if parts else "[Citizen sent a location pin]"

    return ""


def extract_image_media_id(msg_type, message):
    """Returns WhatsApp media ID for image messages, None otherwise."""
    if msg_type == "image":
        return message.get("image", {}).get("id")
    return None


# ══════════════════════════════════════════════════════════════════════════════
# LAMBDA HANDLER
# ══════════════════════════════════════════════════════════════════════════════

def lambda_handler(event, context):
    request_id = context.aws_request_id if context else "local"
    logger.info(f"Complaint Lambda triggered | requestId={request_id}")
    logger.info(json.dumps(event))

    # ── Unpack event ──────────────────────────────────────────────────────────
    phone          = event.get("phone")
    msg_type       = event.get("type", "text")
    message        = event.get("message", {})
    router_cat_id   = event.get("category_id")       # UUID or None
    router_sub_id   = event.get("subcategory_id")    # UUID or None
    location_lat    = event.get("location_lat")
    location_lon    = event.get("location_lon")
    router_language = event.get("language", "english")  # citizen's selected language
    router_language = (router_language or "english").lower()  # normalise casing

    if not phone:
        logger.warning("Missing phone — ignoring event")
        return {"status": "ignored", "reason": "missing_phone"}

    message_id     = message.get("id") or f"noid_{phone}_{msg_type}"
    complaint_text = extract_complaint_text(msg_type, message)
    image_media_id = extract_image_media_id(msg_type, message)

    if not complaint_text:
        logger.warning(f"No extractable text for type={msg_type} — ignoring")
        return {"status": "ignored", "reason": "no_complaint_text"}

    # detected_lang  — AI-detected language, stored in DB for analytics only
    # reply_language — what the citizen actually receives (always router-selected)
    detected_lang  = "english"
    reply_language = router_language or "english"

    try:
        conn = get_db()

        # ── 1. Idempotency check ───────────────────────────────────────────────
        if is_duplicate(conn, message_id):
            logger.warning(f"Duplicate message_id={message_id} — skipping")
            send_whatsapp_message(
                phone,
                DUPLICATE_REPLIES.get(reply_language, DUPLICATE_REPLIES["english"])
            )
            return {"status": "duplicate", "message_id": message_id}

        # ── 2. Resolve category/subcategory names for AI prompt hints ──────────
        # We look up human-readable names so the AI prompt says
        # "category: infrastructure // FIXED" not "category: <uuid> // FIXED"
        category_hint    = lookup_category_name(conn, router_cat_id)
        subcategory_hint = lookup_subcategory_name(conn, router_sub_id)

        logger.info(
            f"Classifying: phone={phone} type={msg_type} "
            f"cat_hint={category_hint} subcat_hint={subcategory_hint} "
            f"has_coords={location_lat is not None}"
        )

        # ── 3. AI Classification ───────────────────────────────────────────────
        ai = analyze_complaint(
            complaint_text,
            msg_type=msg_type,
            category_hint=category_hint,
            subcategory_hint=subcategory_hint,
            has_coords=(location_lat is not None),
            has_image=(msg_type == "image"),
        )
        logger.info(f"AI result: {json.dumps(ai)}")
        detected_lang  = ai.get("language", "english").lower()
        # reply_language is always the router-provided citizen language.
        # AI detected language is stored in DB for analytics but never drives replies.
        reply_language = router_language or detected_lang or "english"

        # ── 4. Citizen upsert ──────────────────────────────────────────────────
        citizen_id = get_or_create_citizen(conn, phone)

        # ── 5. Insert complaint ────────────────────────────────────────────────
        # Router-provided category_id / subcategory_id take precedence.
        # AI text values (ai["category"], ai["subcategory"]) are stored too
        # for dashboard filtering on plain-text fields.
        # If AI was given a hint it kept, make sure the text field matches.
        if category_hint:
            ai["category"] = category_hint
        if subcategory_hint:
            ai["subcategory"] = subcategory_hint

        # Enforce field caps before writing to DB
        ai["summary"] = (ai.get("summary") or "")[:500]

        complaint_id = insert_complaint(
            conn=conn,
            citizen_id=citizen_id,
            phone=phone,
            raw_text=complaint_text,
            ai=ai,
            message_id=message_id,
            category_id=router_cat_id,
            subcategory_id=router_sub_id,
            location_lat=location_lat,
            location_lon=location_lon,
            image_media_id=image_media_id,
            citizen_language=router_language,   # citizen's selected language for analytics
        )
        logger.info(f"Complaint inserted: {complaint_id}")

        # ── 6. Lifecycle log ───────────────────────────────────────────────────
        log_update(
            conn, complaint_id,
            update_type="complaint_registered",
            message=(
                f"Received via WhatsApp ({msg_type}). "
                f"AI category={ai.get('category')} "
                f"severity={ai.get('severity')} "
                f"confidence={ai.get('confidence')} "
                f"lang={ai.get('language')}"
            )
        )

        # ── 7. Confirmation reply ──────────────────────────────────────────────
        reply = build_confirmation_reply(
            language=reply_language,
            complaint_id=complaint_id,
            department=ai.get("department"),
            severity=ai.get("severity"),
            summary=ai.get("summary"),
        )
        send_whatsapp_message(phone, reply)

        return {
            "status":       "success",
            "complaint_id": str(complaint_id),
            "language":      detected_lang,   # AI-detected, stored for analytics
            "reply_language": reply_language,  # citizen's selected language
            "category":     ai.get("category"),
            "severity":     ai.get("severity"),
            "confidence":   ai.get("confidence"),
        }

    except Exception as e:
        logger.exception(f"Unhandled error | requestId={request_id}")

        _safe_rollback()
        global _db_conn
        _db_conn = None   # force fresh connection next invocation

        try:
            error_msg = ERROR_REPLIES.get(reply_language, ERROR_REPLIES["english"])
            send_whatsapp_message(phone, error_msg)
        except Exception as reply_err:
            logger.error(f"Could not send error reply: {reply_err}")

        return {"status": "error", "message": str(e)}