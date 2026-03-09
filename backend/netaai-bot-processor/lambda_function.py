import json
import urllib.request
import os
import boto3
import time
import re
from decimal import Decimal

# Import our new language assets
from responses import RESPONSES, get_text, LANG_SELECTION, LANGUAGE_PICKER

ACCESS_TOKEN = os.environ.get("WHATSAPP_TOKEN_TEST", "YOUR_TOKEN_HERE")
PHONE_NUMBER_ID = "984284311440525"

dynamodb = boto3.resource("dynamodb")
session_table = dynamodb.Table("netaai_sessions")

polly = boto3.client("polly", region_name="ap-south-1")
s3 = boto3.client("s3", region_name="ap-south-1")
AUDIO_BUCKET = "netaji-assets-posters"

# ── Change 1: Router lambda client ────────────────────────────────────────────
lambda_client = boto3.client("lambda")
ROUTER_LAMBDA = "neta_ai_router"

POLLY_CONFIG = {
    "en": {"VoiceId": "Kajal", "Engine": "neural",   "LanguageCode": "en-IN"},
    "hi": {"VoiceId": "Kajal", "Engine": "neural",   "LanguageCode": "hi-IN"},
    "bn": {"VoiceId": "Kajal", "Engine": "standard", "LanguageCode": "bn-IN"},
    "mr": {"VoiceId": "Kajal", "Engine": "standard", "LanguageCode": "mr-IN"},
    "te": {"VoiceId": "Kajal", "Engine": "neural",   "LanguageCode": "te-IN"},
    "ta": {"VoiceId": "Kajal", "Engine": "neural",   "LanguageCode": "ta-IN"},
    "gu": {"VoiceId": "Kajal", "Engine": "standard", "LanguageCode": "gu-IN"},
    "kn": {"VoiceId": "Kajal", "Engine": "standard", "LanguageCode": "kn-IN"},
}

# ─── S3 & Posters Configuration ───────────────────────────────────────────────

S3_BASE = "https://netaji-assets-posters.s3.ap-south-1.amazonaws.com"

SCHEME_POSTER_MAP = {
    "PM-KISAN": "sch_001",
    "PMFBY":    "sch_002",
    "PMJJBY":   "sch_003",
    "PMSBY":    "sch_004",
    "PMJAY":    "sch_005",
    "PMUY":     "sch_006",
    "PMAY-G":   "sch_007",
    "SSY":      "sch_008",
    "PMMY":     "sch_009",
    "NSP":      "sch_010",
}

def get_poster_url(scheme_name, lang):
    poster_id = SCHEME_POSTER_MAP.get(scheme_name)
    if not poster_id:
        return None
    # Fallback kn to en for sch_003 until renamed in S3
    if poster_id == "sch_003" and lang == "kn":
        lang = "en"
    return f"{S3_BASE}/{poster_id}-{lang}.png"

# ─── Scheme Database ──────────────────────────────────────────────────────────

SCHEMES = {
    "PM-KISAN": {
        "name": "PM-KISAN",
        "full_name": "Pradhan Mantri Kisan Samman Nidhi",
        "benefit_amount": "₹9,000/year in 3 installments",
        "category": "Agriculture",
        "who_can_apply": "Landholding farmers aged 18+ (Income tax payers excluded)",
        "documents": "Aadhaar Card, Land ownership records, Bank account linked with Aadhaar, Mobile number for OTP verification",
        "where_to_apply": "PM-KISAN Portal, CSC Centres, State Agriculture Offices",
        "official_website": "https://pmkisan.gov.in",
        "processing_time": "30–60 days after verification",
        "important_note": "e-KYC is mandatory. Ineligible beneficiaries are removed and recovery is initiated.",
        "keywords": ["pm kisan", "farmer income scheme", "6000 farmer scheme", "kisan yojana", "farmer subsidy", "agriculture income support"]
    },
    "PMFBY": {
        "name": "PMFBY",
        "full_name": "Pradhan Mantri Fasal Bima Yojana",
        "benefit_amount": "Variable based on crop insured",
        "category": "Insurance",
        "who_can_apply": "Farmers (18+) cultivating notified crops with insurable interest",
        "documents": "Aadhaar Card, Land records, Bank account details, Sowing declaration or crop details",
        "where_to_apply": "Banks, CSCs, PMFBY portal",
        "official_website": "https://pmfby.gov.in",
        "processing_time": "45–60 days after crop loss verification",
        "important_note": "Farmers must report localized crop loss within 72 hours.",
        "keywords": ["crop insurance", "fasal bima", "farm damage compensation", "crop loss scheme", "weather crop insurance"]
    },
    "PMJJBY": {
        "name": "PMJJBY",
        "full_name": "Pradhan Mantri Jeevan Jyoti Bima Yojana",
        "benefit_amount": "₹2,00,000 life insurance payout",
        "category": "Insurance",
        "who_can_apply": "Anyone aged 18–50 years with a bank account (auto debit facility)",
        "documents": "Aadhaar Card, Bank account, Nominee details",
        "where_to_apply": "Banks or Post Offices",
        "official_website": "https://financialservices.gov.in",
        "processing_time": "30–60 days claim settlement",
        "important_note": "30 day waiting period for non accidental death claims.",
        "keywords": ["life insurance government", "pmjjby", "436 insurance scheme", "2 lakh life insurance"]
    },
    "PMSBY": {
        "name": "PMSBY",
        "full_name": "Pradhan Mantri Suraksha Bima Yojana",
        "benefit_amount": "₹2,00,000 accidental cover",
        "category": "Insurance",
        "who_can_apply": "Anyone aged 18–70 years with a savings bank account",
        "documents": "Aadhaar Card, Bank account details",
        "where_to_apply": "Banks and Post Offices",
        "official_website": "https://financialservices.gov.in",
        "processing_time": "30–60 days",
        "important_note": "Annual premium ₹20 auto-debited from account.",
        "keywords": ["accident insurance", "pmsby", "20 rupee insurance", "government accident cover"]
    },
    "PMJAY": {
        "name": "PMJAY",
        "full_name": "Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana",
        "benefit_amount": "₹5 lakh per family per year",
        "category": "Health",
        "who_can_apply": "Economically vulnerable families (SECC 2011 eligible)",
        "documents": "Aadhaar Card, Ration Card, Mobile number",
        "where_to_apply": "Hospitals, CSCs, PMJAY portal",
        "official_website": "https://pmjay.gov.in",
        "processing_time": "Instant card generation",
        "important_note": "Senior citizens above 70 receive separate ₹5 lakh cover.",
        "keywords": ["ayushman card", "health card", "5 lakh treatment scheme", "free hospital government"]
    },
    "PMUY": {
        "name": "PMUY",
        "full_name": "Pradhan Mantri Ujjwala Yojana",
        "benefit_amount": "₹1,600 assistance + free stove and first refill",
        "category": "Energy",
        "who_can_apply": "Women (18+) from BPL households without existing LPG connection",
        "documents": "Aadhaar Card, BPL certificate or ration card, Bank account",
        "where_to_apply": "LPG distributors or PMUY portal",
        "official_website": "https://pmuy.gov.in",
        "processing_time": "15–30 days",
        "important_note": "Migrants can apply using self declaration.",
        "keywords": ["free gas cylinder", "ujjwala scheme", "gas connection subsidy"]
    },
    "PMAY-G": {
        "name": "PMAY-G",
        "full_name": "Pradhan Mantri Awas Yojana – Gramin",
        "benefit_amount": "₹1.2 lakh plains / ₹1.3 lakh hilly areas",
        "category": "Housing",
        "who_can_apply": "Rural poor (18+) not owning a pucca house (SECC verified)",
        "documents": "Aadhaar Card, SECC verification, Bank account",
        "where_to_apply": "Gram Panchayat",
        "official_website": "https://pmayg.nic.in",
        "processing_time": "6–12 months",
        "important_note": "Includes MGNREGA wages and toilet subsidy.",
        "keywords": ["pm awas yojana", "rural house scheme", "government house subsidy"]
    },
    "SSY": {
        "name": "SSY",
        "full_name": "Sukanya Samriddhi Yojana",
        "benefit_amount": "8.2% interest (FY26)",
        "category": "Savings",
        "who_can_apply": "Female child below 10 years (Maximum two accounts per family)",
        "documents": "Birth certificate, Parent Aadhaar, Address proof",
        "where_to_apply": "Post Office or Bank",
        "official_website": "https://nsiindia.gov.in",
        "processing_time": "Same day",
        "important_note": "Minimum deposit ₹250 yearly.",
        "keywords": ["girl child savings", "sukanya scheme", "daughter future fund"]
    },
    "PMMY": {
        "name": "PMMY",
        "full_name": "Pradhan Mantri Mudra Yojana",
        "benefit_amount": "Up to ₹20 lakh",
        "category": "Business",
        "who_can_apply": "Micro entrepreneurs (18+) with business viability",
        "documents": "Aadhaar Card, PAN Card, Business plan, Bank statements",
        "where_to_apply": "Banks, NBFCs, Udyamimitra portal",
        "official_website": "https://mudra.org.in",
        "processing_time": "7–30 days",
        "important_note": "Loans backed by Credit Guarantee Fund for Micro Units.",
        "keywords": ["mudra loan", "small business loan", "startup loan government"]
    },
    "NSP": {
        "name": "NSP",
        "full_name": "National Scholarship Portal Schemes",
        "benefit_amount": "Varies by scheme",
        "category": "Education",
        "who_can_apply": "Students with family income usually below ₹2.5 lakh",
        "documents": "Aadhaar Card, Income certificate, Marksheet, Bank account",
        "where_to_apply": "https://scholarships.gov.in",
        "official_website": "https://scholarships.gov.in",
        "processing_time": "2–3 months",
        "important_note": "Face authentication required for OTR registration.",
        "keywords": ["student scholarship", "nsp portal", "education scholarship"]
    }
}

KEYWORD_MAP = {
    "pm kisan": ["PM-KISAN"], "farmer income scheme": ["PM-KISAN"],
    "6000 farmer scheme": ["PM-KISAN"], "kisan yojana": ["PM-KISAN"],
    "farmer subsidy": ["PM-KISAN"], "agriculture income support": ["PM-KISAN"],
    "farmer": ["PM-KISAN", "PMFBY"], "kisan": ["PM-KISAN", "PMFBY"],
    "crop insurance": ["PMFBY"], "fasal bima": ["PMFBY"],
    "farm damage compensation": ["PMFBY"], "crop loss scheme": ["PMFBY"],
    "weather crop insurance": ["PMFBY"], "crop": ["PMFBY"], "fasal": ["PMFBY"],
    "life insurance government": ["PMJJBY"], "pmjjby": ["PMJJBY"],
    "436 insurance scheme": ["PMJJBY"], "2 lakh life insurance": ["PMJJBY"],
    "life insurance": ["PMJJBY"],
    "accident insurance": ["PMSBY"], "pmsby": ["PMSBY"],
    "20 rupee insurance": ["PMSBY"], "government accident cover": ["PMSBY"],
    "accident": ["PMSBY"],
    "insurance": ["PMJJBY", "PMSBY", "PMFBY", "PMJAY"],
    "ayushman card": ["PMJAY"], "health card": ["PMJAY"],
    "5 lakh treatment scheme": ["PMJAY"], "free hospital government": ["PMJAY"],
    "ayushman": ["PMJAY"], "health": ["PMJAY"], "hospital": ["PMJAY"],
    "free gas cylinder": ["PMUY"], "ujjwala scheme": ["PMUY"],
    "gas connection subsidy": ["PMUY"], "gas": ["PMUY"], "lpg": ["PMUY"],
    "ujjwala": ["PMUY"],
    "pm awas yojana": ["PMAY-G"], "rural house scheme": ["PMAY-G"],
    "government house subsidy": ["PMAY-G"], "house": ["PMAY-G"],
    "housing": ["PMAY-G"], "awas": ["PMAY-G"],
    "girl child savings": ["SSY"], "sukanya scheme": ["SSY"],
    "daughter future fund": ["SSY"], "girl": ["SSY"], "daughter": ["SSY"],
    "sukanya": ["SSY"],
    "mudra loan": ["PMMY"], "small business loan": ["PMMY"],
    "startup loan government": ["PMMY"], "business": ["PMMY"], "loan": ["PMMY"],
    "mudra": ["PMMY"],
    "student scholarship": ["NSP"], "nsp portal": ["NSP"],
    "education scholarship": ["NSP"], "student": ["NSP"], "scholarship": ["NSP"],
    "education": ["NSP"]
}

CATEGORY_MAP = {
    "1": ["PM-KISAN", "PMFBY"],
    "2": ["PMJJBY", "PMSBY", "PMJAY"],
    "3": ["PMAY-G"],
    "4": ["NSP"],
    "5": ["PMMY"],
    "6": ["PMUY", "SSY"],
}

# ─── WhatsApp Helpers ─────────────────────────────────────────────────────────

def send_message(to, text):
    url = f"https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages"
    data = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": text}
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {ACCESS_TOKEN}"
        }
    )
    with urllib.request.urlopen(req) as r:
        r.read()

def send_whatsapp_image(to_number, image_url, caption=""):
    url = f"https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages"
    data = {
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "image",
        "image": {"link": image_url, "caption": caption}
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {ACCESS_TOKEN}"
        }
    )
    with urllib.request.urlopen(req) as r:
        r.read()

def send_whatsapp_audio(to_number, audio_url):
    url = f"https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages"
    data = {
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "audio",
        "audio": {"link": audio_url}
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {ACCESS_TOKEN}"
        }
    )
    with urllib.request.urlopen(req) as r:
        r.read()

def generate_and_send_audio(to_number, text, lang):
    try:
        config = POLLY_CONFIG.get(lang, POLLY_CONFIG["en"])
        clean_text = re.sub(r'[*_`]', '', text)
        clean_text = re.sub(r'[^\w\s\u0900-\u097F\u0980-\u09FF\u0A80-\u0AFF\u0C00-\u0C7F\u0B80-\u0BFF\u0C80-\u0CFF.,!?]', ' ', clean_text)
        clean_text = clean_text[:1500].strip()
        if not clean_text:
            return
        response = polly.synthesize_speech(
            Text=clean_text,
            OutputFormat="mp3",
            VoiceId=config["VoiceId"],
            Engine=config["Engine"],
            LanguageCode=config["LanguageCode"]
        )
        audio_key = f"audio/{to_number}-{int(time.time())}.mp3"
        s3.put_object(
            Bucket=AUDIO_BUCKET,
            Key=audio_key,
            Body=response["AudioStream"].read(),
            ContentType="audio/mpeg"
        )
        audio_url = f"https://{AUDIO_BUCKET}.s3.ap-south-1.amazonaws.com/{audio_key}"
        send_whatsapp_audio(to_number, audio_url)
    except Exception as e:
        print(f"Polly error: {str(e)}")

# ─── Session Helpers ──────────────────────────────────────────────────────────

def get_session(phone):
    try:
        r = session_table.get_item(Key={"phone_number": phone})
        return r.get("Item")
    except Exception as e:
        print("DynamoDB Get Error:", e)
        return None

def save_session(phone, state, extra=None):
    item = {"phone_number": phone, "state": state}
    if extra:
        item.update(extra)
    try:
        session_table.put_item(Item=item)
    except Exception as e:
        print("DynamoDB Put Error:", e)

# ─── Change 2: Router Forward Function ───────────────────────────────────────

def forward_to_router(sender, message, msg_type="text", lang="en"):
    """Forward complaint traffic to neta_ai_router — fire-and-forget (Event)."""
    # Map preprocessor short codes to router full names
    LANG_MAP = {"en": "english", "hi": "hindi", "mr": "marathi",
                "gu": "gujarati", "kn": "kannada"}
    payload = {
        "phone":    sender,
        "type":     msg_type,
        "message":  message,
        "language": LANG_MAP.get(lang, "english"),
    }
    try:
        lambda_client.invoke(
            FunctionName=ROUTER_LAMBDA,
            InvocationType="Event",
            Payload=json.dumps(payload).encode("utf-8")
        )
    except Exception as e:
        print("Router invoke failed:", str(e))

# ─── Eligibility Logic ────────────────────────────────────────────────────────

def check_eligibility(profile):
    matched = []
    occ     = profile.get("occupation")
    age     = int(profile.get("age", 0))
    income  = int(profile.get("income_bracket", 5))
    gender  = profile.get("gender")
    aadhaar = profile.get("has_aadhaar_bank", False)
    has_land = profile.get("has_land", False)

    if occ == "1" and has_land and aadhaar: matched.append("PM-KISAN")
    if occ == "1" and aadhaar:              matched.append("PMFBY")
    if 18 <= age <= 55 and aadhaar:         matched.append("PMJJBY")
    if 18 <= age <= 70 and aadhaar:         matched.append("PMSBY")
    if income <= 2:                          matched.append("PMJAY")
    if gender == "2" and income <= 2:       matched.append("PMUY")
    if income <= 2:                          matched.append("PMAY-G")
    if occ == "2" and aadhaar:              matched.append("PMMY")
    if occ == "3" and income <= 2:          matched.append("NSP")
    return matched

def format_results(matched_names, lang):
    if not matched_names:
        return get_text("no_schemes_found", lang), []

    lines = [f"🎉 {get_text('lang_confirmed', lang).split(' ')[0]} *{len(matched_names)} scheme(s)*:\n"]
    codes = []
    for i, name in enumerate(matched_names, 1):
        s    = SCHEMES[name]
        code = f"S{i}"
        codes.append(name)
        lines.append(
            f"{'━'*15}\n"
            f"{i}. *{s['name']}* ✨\n"
            f"🎁 {get_text('label_benefit', lang)}: {s['benefit_amount']}\n"
            f"👉 Type *{code}* for full details"
        )
    lines.append(f"\n{'━'*15}")
    back_line = get_text("back_to_results", lang).split("\n")[1]
    lines.append(back_line)
    return "\n".join(lines), codes

def format_scheme_detail(scheme_name, lang):
    s = SCHEMES.get(scheme_name)
    if not s:
        return get_text("no_schemes_found", lang)
    back_prompts = get_text("back_to_results", lang)
    docs_list    = "\n".join([f"• {doc.strip()}" for doc in s['documents'].split(',')])
    return (
        f"✅ *{s['full_name']}*\n\n"
        f"📋 *{get_text('label_benefit', lang)}:*\n{s['benefit_amount']}\n\n"
        f"👥 *{get_text('label_who_can_apply', lang)}:*\n{s['who_can_apply']}\n\n"
        f"📄 *{get_text('label_documents', lang)}:*\n{docs_list}\n\n"
        f"📍 *{get_text('label_where_to_apply', lang)}:*\n{s['where_to_apply']}\n\n"
        f"🌐 *{get_text('label_website', lang)}:*\n{s['official_website']}\n\n"
        f"⏳ *{get_text('label_processing_time', lang)}:*\n{s['processing_time']}\n\n"
        f"⚠️ *{get_text('label_important_note', lang)}:*\n{s['important_note']}\n\n"
        f"──────────────\n"
        f"{back_prompts}"
    )

# ─── Scheme Flow (UNCHANGED) ──────────────────────────────────────────────────

def handle_scheme_flow(sender, text, session):
    state      = session.get("state", "MENU")
    lang       = session.get("lang", "en")
    text_upper = text.upper().strip()

    if text_upper in ["MENU", "0", "BACK", "HOME"]:
        save_session(sender, "MENU", {"lang": lang})
        return get_text("main_menu", lang)

    if state == "SCHEME_MENU":
        if text == "1":
            save_session(sender, "SCHEME_Q1", {"scheme_profile": {}, "lang": lang})
            return get_text("ask_occupation", lang)
        elif text == "2":
            save_session(sender, "SCHEME_SEARCH", {"lang": lang})
            return get_text("search_prompt", lang)
        elif text == "3":
            save_session(sender, "SCHEME_BROWSE", {"lang": lang})
            return get_text("category_menu", lang)
        else:
            return get_text("scheme_menu", lang)

    elif state == "SCHEME_Q1":
        if text not in ["1", "2", "3", "4", "5"]:
            return get_text("invalid_option", lang)
        profile = {"occupation": text}
        save_session(sender, "SCHEME_Q2", {"scheme_profile": profile, "lang": lang})
        return get_text("ask_age", lang)

    elif state == "SCHEME_Q2":
        try:
            age = int(text)
            if not (1 <= age <= 120):
                raise ValueError
        except ValueError:
            return get_text("invalid_age", lang)
        profile = session.get("scheme_profile", {})
        profile["age"] = age
        save_session(sender, "SCHEME_Q3", {"scheme_profile": profile, "lang": lang})
        return get_text("ask_income", lang)

    elif state == "SCHEME_Q3":
        if text not in ["1", "2", "3", "4"]:
            return get_text("invalid_option", lang)
        profile = session.get("scheme_profile", {})
        profile["income_bracket"] = int(text)
        save_session(sender, "SCHEME_Q4", {"scheme_profile": profile, "lang": lang})
        return get_text("ask_gender", lang)

    elif state == "SCHEME_Q4":
        if text not in ["1", "2"]:
            return get_text("invalid_option", lang)
        profile = session.get("scheme_profile", {})
        profile["gender"] = text
        save_session(sender, "SCHEME_Q5", {"scheme_profile": profile, "lang": lang})
        return get_text("ask_aadhaar", lang)

    elif state == "SCHEME_Q5":
        if text not in ["1", "2"]:
            return get_text("invalid_option", lang)
        profile = session.get("scheme_profile", {})
        profile["has_aadhaar_bank"] = (text == "1")
        if profile.get("occupation") == "1":
            save_session(sender, "SCHEME_Q5B", {"scheme_profile": profile, "lang": lang})
            return get_text("ask_land", lang)
        matched = check_eligibility(profile)
        result_text, codes = format_results(matched, lang)
        save_session(sender, "SCHEME_RESULTS", {"scheme_profile": profile, "scheme_results": codes, "lang": lang})
        send_message(sender, result_text)
        generate_and_send_audio(sender, result_text, lang)
        return ""

    elif state == "SCHEME_Q5B":
        if text not in ["1", "2"]:
            return get_text("invalid_option", lang)
        profile = session.get("scheme_profile", {})
        profile["has_land"] = (text == "1")
        matched = check_eligibility(profile)
        result_text, codes = format_results(matched, lang)
        save_session(sender, "SCHEME_RESULTS", {"scheme_profile": profile, "scheme_results": codes, "lang": lang})
        send_message(sender, result_text)
        generate_and_send_audio(sender, result_text, lang)
        return ""

    elif state == "SCHEME_RESULTS":
        codes = session.get("scheme_results", [])
        if text_upper == "SCHEMES":
            result_text, _ = format_results(codes, lang)
            send_message(sender, result_text)
            generate_and_send_audio(sender, result_text, lang)
            return ""
        if text_upper.startswith("S") and text_upper[1:].isdigit():
            idx = int(text_upper[1:]) - 1
            if 0 <= idx < len(codes):
                scheme_name = codes[idx]
                save_session(sender, "SCHEME_DETAIL", {"scheme_results": codes, "viewing_scheme": scheme_name, "lang": lang})
                detail_text = format_scheme_detail(scheme_name, lang)
                send_message(sender, detail_text)
                generate_and_send_audio(sender, detail_text, lang)
                poster_url = get_poster_url(scheme_name, lang)
                if poster_url:
                    try:
                        send_whatsapp_image(sender, poster_url, caption=SCHEMES[scheme_name]["full_name"])
                    except Exception as e:
                        print(f"Poster send failed for {scheme_name}: {str(e)}")
                return ""
        return get_text("see_details_prompt", lang)

    elif state == "SCHEME_DETAIL":
        codes = session.get("scheme_results", [])
        if text_upper == "SCHEMES":
            result_text, _ = format_results(codes, lang)
            save_session(sender, "SCHEME_RESULTS", {"scheme_results": codes, "lang": lang})
            send_message(sender, result_text)
            generate_and_send_audio(sender, result_text, lang)
            return ""
        return get_text("back_to_results", lang)

    elif state == "SCHEME_SEARCH":
        keyword       = text.lower().strip()
        matched_names = []
        for kw, names in KEYWORD_MAP.items():
            if kw in keyword:
                for n in names:
                    if n not in matched_names:
                        matched_names.append(n)
        if not matched_names:
            return get_text("search_no_results", lang)
        lines = [f"✅ Found {len(matched_names)} scheme(s) for '{text}':\n"]
        for i, name in enumerate(matched_names, 1):
            s = SCHEMES[name]
            lines.append(f"{i}. *{s['name']}*\n🎁 {get_text('label_benefit', lang)}: {s['benefit_amount']}\n")
        lines.append(get_text("see_details_prompt", lang))
        save_session(sender, "SCHEME_SEARCH_RESULTS", {"scheme_results": matched_names, "lang": lang})
        return "\n".join(lines)

    elif state == "SCHEME_SEARCH_RESULTS":
        codes = session.get("scheme_results", [])
        if text.isdigit():
            idx = int(text) - 1
            if 0 <= idx < len(codes):
                scheme_name = codes[idx]
                save_session(sender, "SCHEME_DETAIL", {"scheme_results": codes, "viewing_scheme": scheme_name, "lang": lang})
                detail_text = format_scheme_detail(scheme_name, lang)
                send_message(sender, detail_text)
                generate_and_send_audio(sender, detail_text, lang)
                poster_url = get_poster_url(scheme_name, lang)
                if poster_url:
                    try:
                        send_whatsapp_image(sender, poster_url, caption=SCHEMES[scheme_name]["full_name"])
                    except Exception as e:
                        print(f"Poster send failed for {scheme_name}: {str(e)}")
                return ""
        return get_text("see_details_prompt", lang)

    elif state == "SCHEME_BROWSE":
        names = CATEGORY_MAP.get(text)
        if not names:
            return get_text("category_menu", lang)
        lines = [f"📂 *Here are the schemes in this category:*\n"]
        for i, name in enumerate(names, 1):
            s = SCHEMES[name]
            lines.append(f"{i}. *{s['name']}*\n🎁 {get_text('label_benefit', lang)}: {s['benefit_amount']}\n")
        lines.append(get_text("see_details_prompt", lang))
        save_session(sender, "SCHEME_SEARCH_RESULTS", {"scheme_results": names, "lang": lang})
        return "\n".join(lines)

    return get_text("scheme_menu", lang)

# ─── Main Lambda Handler ──────────────────────────────────────────────────────

def lambda_handler(event, context):
    try:
        body    = json.loads(event["body"])
        message = body["entry"][0]["changes"][0]["value"]["messages"][0]
        sender  = message["from"]

        msg_type = message.get("type")
        text     = ""

        # session + lang resolved early so all branches below (incl. interactive) have access
        session = get_session(sender)
        lang    = session.get("lang", "en") if session else "en"

        if msg_type == "text":
            text = message["text"]["body"].strip()
        elif msg_type == "button":
            text = message["button"]["text"].strip()
        elif msg_type == "interactive":
            interactive_type = message["interactive"]["type"]
            # list_reply can come from router-generated category/subcategory menus
            # forward directly so they are handled by neta_ai_router, not scheme flow
            if interactive_type == "list_reply":
                forward_to_router(sender, message, msg_type, lang)
                return {"statusCode": 200, "body": "Success"}
            if interactive_type == "button_reply":
                text = message["interactive"]["button_reply"]["title"].strip()
        else:
            print(f"Unsupported message type: {msg_type} — skipping")
            return {"statusCode": 200, "body": "Success"}

        text_upper = text.upper().strip()

        # ── Trigger Language Select / Hard Reset ──────────────────────────────
        if text_upper in ["HI", "HELLO", "HEY", "START", "LANGUAGE", "LANG", "BHASHA"]:
            save_session(sender, "LANG_SELECT")
            send_message(sender, LANGUAGE_PICKER)
            return {"statusCode": 200, "body": "Success"}

        # ── First-time user ───────────────────────────────────────────────────
        if not session:
            save_session(sender, "LANG_SELECT")
            send_message(sender, LANGUAGE_PICKER)
            return {"statusCode": 200, "body": "Success"}

        state = session.get("state", "LANG_SELECT")

        # ── ROUTER_MODE: forward everything to router until user exits ─────────
        # User escapes router mode by sending MENU, 0, or HOME.
        if state == "ROUTER_MODE":
            if text_upper in ["MENU", "0", "HOME"]:
                save_session(sender, "MENU", {"lang": lang})
                send_message(sender, get_text("main_menu", lang))
            else:
                forward_to_router(sender, message, msg_type, lang)
            return {"statusCode": 200, "body": "Success"}

        # ── Language selection ────────────────────────────────────────────────
        if state == "LANG_SELECT":
            lang = LANG_SELECTION.get(text)
            if not lang:
                send_message(sender, LANGUAGE_PICKER)
                return {"statusCode": 200, "body": "Success"}
            save_session(sender, "MENU", {"lang": lang})
            reply = f"{get_text('lang_confirmed', lang)}\n\n{get_text('welcome', lang)}"
            send_message(sender, reply)
            return {"statusCode": 200, "body": "Success"}

        # lang already set above; re-read from session in case session just loaded
        lang = session.get("lang", "en") if session else lang

        # ── Forward media/location to router (lang now available) ─────────────
        if msg_type in ["image", "location"]:
            forward_to_router(sender, message, msg_type, lang)
            return {"statusCode": 200, "body": "Success"}

        # ── Menu reset ────────────────────────────────────────────────────────
        if text_upper in ["MENU", "0"]:
            save_session(sender, "MENU", {"lang": lang})
            send_message(sender, get_text("main_menu", lang))
            return {"statusCode": 200, "body": "Success"}

        # ── Main menu routing ─────────────────────────────────────────────────
        if state == "MENU":
            if text == "1":
                save_session(sender, "SCHEME_MENU", {"lang": lang})
                reply = get_text("scheme_menu", lang)
                send_message(sender, reply)
            elif text == "2":
                # ── Enter router mode — all subsequent messages go to router ──
                save_session(sender, "ROUTER_MODE", {"lang": lang})
                forward_to_router(sender, message, msg_type, lang)
            elif text == "3":
                save_session(sender, "TRACKING", {"lang": lang})
                send_message(sender, get_text("tracking_prompt", lang))
            else:
                send_message(sender, get_text("main_menu", lang))
            return {"statusCode": 200, "body": "Success"}

        # ── Scheme flows (UNCHANGED) ──────────────────────────────────────────
        if state.startswith("SCHEME_"):
            reply = handle_scheme_flow(sender, text, session)
            if reply:
                send_message(sender, reply)
            return {"statusCode": 200, "body": "Success"}

        # ── Change 5: REPORTING / WAIT_PHOTO states removed ───────────────────
        # Old REPORTING and WAIT_PHOTO blocks deleted.
        # All complaint traffic now handled by neta_ai_router.

        # ── Tracking ──────────────────────────────────────────────────────────
        if state == "TRACKING":
            send_message(sender, get_text("coming_soon", lang))
            return {"statusCode": 200, "body": "Success"}

        # ── Fallback ──────────────────────────────────────────────────────────
        save_session(sender, "MENU", {"lang": lang})
        send_message(sender, get_text("main_menu", lang))
        return {"statusCode": 200, "body": "Success"}

    except Exception as e:
        print("Processor error:", str(e))
        return {"statusCode": 500, "body": "Error"}