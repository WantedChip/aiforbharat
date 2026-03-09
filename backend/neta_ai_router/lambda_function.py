"""
Neta.ai — Router Lambda  (FINAL PRODUCTION VERSION — MULTILINGUAL)
──────────────────────────────────────────────────────────────────
Handles all incoming WhatsApp messages, manages conversation state,
and routes complaints to the complaint lambda.

All user-facing text is driven by the citizen's preferred_language
stored in the citizens table.  No hardcoded strings reach the user.

Conversation states
───────────────────
  awaiting_language   → new citizen selects preferred language (first contact)
  idle                → show main menu OR accept free-text / media complaint
  awaiting_category   → citizen picks a complaint category from a list menu
  awaiting_subcategory→ citizen picks a subcategory
  awaiting_description→ citizen types / photos / pins the issue

Schema additions required in Supabase
───────────────────────────────────────
  ALTER TABLE citizens
    ADD COLUMN IF NOT EXISTS conversation_state      TEXT             DEFAULT 'idle',
    ADD COLUMN IF NOT EXISTS preferred_language      TEXT,
    ADD COLUMN IF NOT EXISTS selected_category_id    UUID,
    ADD COLUMN IF NOT EXISTS selected_subcategory_id UUID,
    ADD COLUMN IF NOT EXISTS pending_location_lat    DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS pending_location_lon    DOUBLE PRECISION;
"""

import json
import os
import logging
import psycopg2
import psycopg2.extras
import psycopg2.extensions
import urllib.request
import urllib.error
import boto3

# ─── LOGGING ──────────────────────────────────────────────────────────────────

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# ─── ENV ──────────────────────────────────────────────────────────────────────

WHATSAPP_TOKEN   = os.environ["WHATSAPP_TOKEN"]
PHONE_NUMBER_ID  = os.environ["PHONE_NUMBER_ID"]
COMPLAINT_LAMBDA = os.environ.get("COMPLAINT_LAMBDA", "neta_complaint_lambda")

DB_HOST = os.environ["DB_HOST"]
DB_NAME = os.environ["DB_NAME"]
DB_USER = os.environ["DB_USER"]
DB_PASS = os.environ["DB_PASS"]
DB_PORT = os.environ.get("DB_PORT", "5432")

lambda_client = boto3.client("lambda")

# ─── SUPPORTED LANGUAGES ──────────────────────────────────────────────────────

SUPPORTED_LANGUAGES = {"english", "hindi", "marathi", "gujarati", "kannada"}
DEFAULT_LANGUAGE    = "english"

# ─── KEYWORD SETS ─────────────────────────────────────────────────────────────

GREETINGS = {
    "hi", "hello", "hey", "start", "menu", "help",
    "नमस्कार", "नमस्ते", "हॅलो",
    "નમસ્તે",
    "ನಮಸ್ಕಾರ",
    "ہیلو",
}

CANCEL_KEYWORDS = {"cancel", "रद्द", "बंद", "stop", "reset", "back"}

# Per-language command sets — checked against citizen's preferred language.
# Global fallback to English commands ensures cross-language coverage.
LANGUAGE_COMMANDS = {
    "english":  {"language", "lang", "change language", "switch language",
                 "language change", "change my language"},
    "hindi":    {"भाषा", "bhasha", "language", "lang"},
    "marathi":  {"भाषा", "bhasha", "language", "lang"},
    "gujarati": {"ભાષા", "language", "lang"},
    "kannada":  {"ಭಾಷೆ", "language", "lang"},
}

CATEGORY_COMMANDS = {
    "english":  {"category", "change category", "select category", "new complaint"},
    "hindi":    {"श्रेणी", "category", "change category"},
    "marathi":  {"श्रेणी", "category"},
    "gujarati": {"શ્રેણી", "category"},
    "kannada":  {"ವರ್ಗ", "category"},
}

VALID_STATES = {
    "idle",
    "awaiting_language",
    "awaiting_category",
    "awaiting_subcategory",
    "awaiting_description",
}

LANGUAGE_MAP = {
    "LANG_EN": "english",  "LANG_HI": "hindi",
    "LANG_MR": "marathi",  "LANG_GU": "gujarati",  "LANG_KN": "kannada",
    "1": "english",  "2": "hindi",  "3": "marathi",
    "4": "gujarati", "5": "kannada",
    "ENGLISH": "english", "HINDI": "hindi", "MARATHI": "marathi",
    "GUJARATI": "gujarati", "KANNADA": "kannada",
}

# WhatsApp API hard limits
WA_TEXT_MAX      = 4096
WA_TITLE_MAX     = 20
WA_DESC_MAX      = 60
WA_LIST_ROWS_MAX = 10

MIN_COMPLAINT_LENGTH = 3


# ══════════════════════════════════════════════════════════════════════════════
# LANGUAGE STRINGS
# ══════════════════════════════════════════════════════════════════════════════
# Every string that reaches the citizen lives here.
# Keys always match SUPPORTED_LANGUAGES exactly.
# ──────────────────────────────────────────────────────────────────────────────

# ── Language saved confirmation ───────────────────────────────────────────────
LANG_SAVED = {
    "english":  "✅ Language saved.",
    "hindi":    "✅ भाषा सहेजी गई।",
    "marathi":  "✅ भाषा जतन केली आहे.",
    "gujarati": "✅ ભાષા સાચવવામાં આવી.",
    "kannada":  "✅ ಭಾಷೆ ಉಳಿಸಲಾಗಿದೆ.",
}

LANG_INVALID = {
    "english":  "⚠️ Please select a valid option from the list.",
    "hindi":    "⚠️ कृपया सूची से एक विकल्प चुनें।",
    "marathi":  "⚠️ कृपया यादीतून एक पर्याय निवडा.",
    "gujarati": "⚠️ કૃપા કરી સૂચિમાંથી એક વિકલ્પ પસંદ કરો.",
    "kannada":  "⚠️ ದಯವಿಟ್ಟು ಪಟ್ಟಿಯಿಂದ ಒಂದು ಆಯ್ಕೆ ಆರಿಸಿ.",
}

# ── Main menu ─────────────────────────────────────────────────────────────────
MAIN_MENU_BODY = {
    "english": (
        "Hello 👋\n\nI am *Neta.ai* — your civic assistant.\n\n"
        "How can I help you?\n\n"
        '🌐 Type "language" to change language'
    ),
    "hindi": (
        "नमस्ते 👋\n\nमैं *Neta.ai* हूँ — आपका नागरिक सहायक।\n\n"
        "मैं आपकी क्या मदद करूँ?\n\n"
        '🌐 भाषा बदलने के लिए "language" टाइप करें'
    ),
    "marathi": (
        "नमस्कार 👋\n\nमी *Neta.ai* आहे — तुमचा नागरी सहाय्यक.\n\n"
        "मी तुम्हाला काय मदत करू?\n\n"
        '🌐 भाषा बदलण्यासाठी "language" लिहा'
    ),
    "gujarati": (
        "નમસ્તે 👋\n\nહું *Neta.ai* છું — તમારો નાગરિક સહાયક.\n\n"
        "હું તમને કેવી રીતે મદદ કરી શકું?\n\n"
        '🌐 ભાષા બદલવા માટે "language" ટાઇપ કરો'
    ),
    "kannada": (
        "ನಮಸ್ಕಾರ 👋\n\nನಾನು *Neta.ai* — ನಿಮ್ಮ ನಾಗರಿಕ ಸಹಾಯಕ.\n\n"
        "ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?\n\n"
        '🌐 ಭಾಷೆ ಬದಲಾಯಿಸಲು "language" ಎಂದು ಟೈಪ್ ಮಾಡಿ'
    ),
}

MAIN_MENU_RAISE = {
    "english":  "📋 Report Issue",
    "hindi":    "📋 शिकायत दर्ज करें",
    "marathi":  "📋 तक्रार नोंदवा",
    "gujarati": "📋 ફરિયાદ નોંધો",
    "kannada":  "📋 ದೂರು ದಾಖಲಿಸಿ",
}

MAIN_MENU_SCHEMES = {
    "english":  "🏛️ Govt Schemes",
    "hindi":    "🏛️ सरकारी योजनाएं",
    "marathi":  "🏛️ सरकारी योजना",
    "gujarati": "🏛️ સરકારી યોજના",
    "kannada":  "🏛️ ಸರ್ಕಾರಿ ಯೋಜನೆ",
}

# ── Category menu ─────────────────────────────────────────────────────────────
CATEGORY_MENU_BODY = {
    "english":  "Which department is your complaint about?\n\nChoose one below 👇",
    "hindi":    "आपकी शिकायत किस विभाग से संबंधित है?\n\nनीचे से चुनें 👇",
    "marathi":  "तुमची तक्रार कोणत्या विभागाशी संबंधित आहे?\n\nखालीलपैकी एक निवडा 👇",
    "gujarati": "તમારી ફરિયાદ કયા વિભાગ સાથે સંબંધિત છે?\n\nનીચેથી પસંદ કરો 👇",
    "kannada":  "ನಿಮ್ಮ ದೂರು ಯಾವ ಇಲಾಖೆಗೆ ಸಂಬಂಧಿಸಿದೆ?\n\nಕೆಳಗಿನಿಂದ ಆಯ್ಕೆ ಮಾಡಿ 👇",
}

CATEGORY_MENU_BTN = {
    "english":  "Select Dept",
    "hindi":    "विभाग चुनें",
    "marathi":  "विभाग निवडा",
    "gujarati": "વિભાગ પસંદ કરો",
    "kannada":  "ಇಲಾಖೆ ಆಯ್ಕೆ",
}

CATEGORY_SECTION_TITLE = {
    "english":  "Complaint Type",
    "hindi":    "शिकायत प्रकार",
    "marathi":  "तक्रार प्रकार",
    "gujarati": "ફરિયાદ પ્રકાર",
    "kannada":  "ದೂರು ಪ್ರಕಾರ",
}

CATEGORY_UNAVAILABLE = {
    "english":  "Sorry, categories are currently unavailable. Please describe your complaint directly.",
    "hindi":    "क्षमा करें, अभी श्रेणियाँ उपलब्ध नहीं हैं। कृपया अपनी शिकायत सीधे लिखें।",
    "marathi":  "माफ करा, सध्या श्रेणी उपलब्ध नाहीत. कृपया तुमची तक्रार थेट सांगा.",
    "gujarati": "માફ કરશો, હાલ વિભાગ ઉપલબ્ધ નથી. કૃપા કરી સીધી ફરિયાદ નોંધો.",
    "kannada":  "ಕ್ಷಮಿಸಿ, ಈಗ ವಿಭಾಗಗಳು ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನೇರವಾಗಿ ದೂರು ನೀಡಿ.",
}

CATEGORY_REPROMPT = {
    "english":  "Please choose one option from the list below 👇",
    "hindi":    "कृपया नीचे दी गई सूची से एक विकल्प चुनें 👇",
    "marathi":  "कृपया खालील यादीतून एक पर्याय निवडा 👇",
    "gujarati": "કૃપા કરી નીચેની સૂચિમાંથી એક વિકલ્પ પસંદ કરો 👇",
    "kannada":  "ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಪಟ್ಟಿಯಿಂದ ಒಂದು ಆಯ್ಕೆ ಮಾಡಿ 👇",
}

# ── Subcategory menu ──────────────────────────────────────────────────────────
SUBCATEGORY_MENU_BODY = {
    "english":  "Please select a sub-type:",
    "hindi":    "कृपया एक उपप्रकार चुनें:",
    "marathi":  "आता अधिक तपशील निवडा:",
    "gujarati": "કૃપા કરી એક પ્રકાર પસંદ કરો:",
    "kannada":  "ದಯವಿಟ್ಟು ಒಂದು ಉಪ-ಪ್ರಕಾರ ಆರಿಸಿ:",
}

SUBCATEGORY_MENU_BTN = {
    "english":  "Select Type",
    "hindi":    "प्रकार चुनें",
    "marathi":  "प्रकार निवडा",
    "gujarati": "પ્રકાર પસંદ કરો",
    "kannada":  "ಪ್ರಕಾರ ಆಯ್ಕೆ",
}

SUBCATEGORY_SECTION_TITLE = {
    "english":  "Sub-type",
    "hindi":    "उपप्रकार",
    "marathi":  "उपप्रकार",
    "gujarati": "ઉપ-પ્રકાર",
    "kannada":  "ಉಪ-ಪ್ರಕಾರ",
}

# ── Description prompt ────────────────────────────────────────────────────────
DESCRIPTION_PROMPT = {
    "english": (
        "📝 Please briefly describe your issue.\n\n"
        "• Where is it?\n"
        "• How long has it been going on?\n\n"
        "📸 You can send a photo  |  📍 You can send a location pin\n\n"
        "Use your own language — we will understand. 🙏"
    ),
    "hindi": (
        "📝 कृपया अपनी समस्या संक्षेप में बताएं।\n\n"
        "• यह कहाँ है?\n"
        "• यह कब से है?\n\n"
        "📸 फोटो भेज सकते हैं  |  📍 Location pin भेज सकते हैं\n\n"
        "अपनी भाषा में लिखें — हम समझेंगे। 🙏"
    ),
    "marathi": (
        "📝 कृपया तुमची समस्या थोडक्यात सांगा.\n\n"
        "• ती कुठे आहे?\n"
        "• किती दिवसांपासून आहे?\n\n"
        "📸 फोटो पाठवू शकता  |  📍 Location pin पाठवू शकता\n\n"
        "तुमची भाषा वापरा — आम्ही समजू. 🙏"
    ),
    "gujarati": (
        "📝 કૃपा करी तमारी समस्या ट्यूंकमां जणावो.\n\n"
        "• ते क्यां छे?\n"
        "• केटला दिवसोथी छे?\n\n"
        "📸 फोटो मोकली शकाय  |  📍 Location pin मोकली शकाय\n\n"
        "तमारी भाषा वापरो — अमे समजीशुं. 🙏"
    ),
    "kannada": (
        "📝 ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಸಂಕ್ಷಿಪ್ತವಾಗಿ ತಿಳಿಸಿ.\n\n"
        "• ಇದು ಎಲ್ಲಿದೆ?\n"
        "• ಎಷ್ಟು ದಿನಗಳಿಂದ ಇದೆ?\n\n"
        "📸 ಫೋಟೋ ಕಳಿಸಬಹುದು  |  📍 Location pin ಕಳಿಸಬಹುದು\n\n"
        "ನಿಮ್ಮ ಭಾಷೆ ಬಳಸಿ — ನಾವು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇವೆ. 🙏"
    ),
}

DESCRIPTION_TOO_SHORT = {
    "english":  "Please describe your issue in a few words.",
    "hindi":    "कृपया कुछ शब्दों में अपनी समस्या बताएं।",
    "marathi":  "कृपया तुमची समस्या थोडक्यात सांगा (किमान काही शब्द).",
    "gujarati": "કૃपा करी तमारी समस्या थोडी विगत में जणावो.",
    "kannada":  "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಕೆಲವು ಪದಗಳಲ್ಲಿ ತಿಳಿಸಿ.",
}

DESCRIPTION_WRONG_TYPE = {
    "english":  "Please describe your issue via text, photo, or location pin.",
    "hindi":    "कृपया अपनी समस्या टेक्स्ट, फोटो या location pin द्वारा बताएं।",
    "marathi":  "कृपया तुमची समस्या मजकुरात, फोटोद्वारे किंवा location pin पाठवून सांगा.",
    "gujarati": "कृपा करी समस्या टेक्स्ट, फोटो के location pin द्वारा जणावो.",
    "kannada":  "ದಯವಿಟ್ಟು ಪಠ್ಯ, ಫೋಟೋ ಅಥವಾ ಸ್ಥಳ ಪಿನ್ ಮೂಲಕ ದೂರು ನೀಡಿ.",
}

# ── Complaint processing ack ──────────────────────────────────────────────────
COMPLAINT_ACK = {
    "english":  "⏳ Your complaint is being processed...\n\nPlease wait a moment.",
    "hindi":    "⏳ आपकी शिकायत दर्ज की जा रही है...\n\nकृपया एक क्षण प्रतीक्षा करें।",
    "marathi":  "⏳ तुमची तक्रार प्रक्रिया केली जात आहे...\n\nकृपया काही क्षण थांबा.",
    "gujarati": "⏳ તમારી ફરિયાદ નોंधवामां आवे छे...\n\nकृपया थोडी क्षण राहो.",
    "kannada":  "⏳ ನಿಮ್ಮ ದೂರು ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ...\n\nದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಕಾಯಿರಿ.",
}

COMPLAINT_REGISTERING = {
    "english":  "⏳ Your complaint is being registered...\n\nPlease wait a moment.",
    "hindi":    "⏳ आपकी शिकायत दर्ज की जा रही है...\n\nकृपया एक क्षण प्रतीक्षा करें।",
    "marathi":  "⏳ तुमची तक्रार नोंदवली जात आहे...\n\nकृपया काही क्षण थांबा.",
    "gujarati": "⏳ તमारी ফरিयাদ নোংधवामां आवे छे...\n\nकृपया क्षण थांभो.",
    "kannada":  "⏳ ನಿಮ್ಮ ದೂರು ನೋಂದಾಯಿಸಲಾಗುತ್ತಿದೆ...\n\nದಯವಿಟ್ಟು ಕಾಯಿರಿ.",
}

# ── Location received ─────────────────────────────────────────────────────────
LOCATION_RECEIVED = {
    "english": (
        "📍 Location received.\n\n"
        "Please briefly describe the issue at this location.\n"
        "Example: 'Large pothole here' or 'Garbage piled up'\n\n"
        "📸 You can also send a photo."
    ),
    "hindi": (
        "📍 Location मिली।\n\n"
        "कृपया इस स्थान की समस्या संक्षेप में बताएं।\n"
        "उदाहरण: 'यहाँ बड़ा गड्ढा है' या 'कचरा जमा है'\n\n"
        "📸 फोटो भी भेज सकते हैं।"
    ),
    "marathi": (
        "📍 Location received.\n\n"
        "कृपया या ठिकाणाची समस्या थोडक्यात सांगा.\n"
        "उदाहरण: 'येथे मोठा खड्डा आहे' किंवा 'कचरा साचला आहे'\n\n"
        "📸 फोटो पाठवू शकता."
    ),
    "gujarati": (
        "📍 Location मळी.\n\n"
        "कृपया आ जग्यानी समस्या टूंकमां जणावो.\n"
        "उदाहरण: 'अहीं मोटो खाडो छे' या 'कचरो जमा थयो छे'\n\n"
        "📸 फोटो पण मोकली शकाय."
    ),
    "kannada": (
        "📍 ಸ್ಥಳ ಸ್ವೀಕರಿಸಲಾಗಿದೆ.\n\n"
        "ದಯವಿಟ್ಟು ಈ ಸ್ಥಳದ ಸಮಸ್ಯೆಯನ್ನು ಸಂಕ್ಷಿಪ್ತವಾಗಿ ತಿಳಿಸಿ.\n"
        "ಉದಾ: 'ಇಲ್ಲಿ ದೊಡ್ಡ ಗುಂಡಿ ಇದೆ' ಅಥವಾ 'ಕಸ ರಾಶಿ ಹಾಕಿದೆ'\n\n"
        "📸 ಫೋಟೋ ಕಳಿಸಬಹುದು."
    ),
}

# ── Photo received ────────────────────────────────────────────────────────────
PHOTO_RECEIVED = {
    "english":  "📸 Photo received. Your complaint is being registered...",
    "hindi":    "📸 फोटो मिली। आपकी शिकायत दर्ज की जा रही है...",
    "marathi":  "📸 Photo received. तुमची तक्रार नोंदवली जात आहे...",
    "gujarati": "📸 फोटो मळी. तमारी ফरियाद नोंधवामां आवे छे...",
    "kannada":  "📸 ಫೋಟೋ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ದೂರು ನೋಂದಾಯಿಸಲಾಗುತ್ತಿದೆ...",
}

# ── Scheme menu ───────────────────────────────────────────────────────────────
SCHEME_MENU_BODY = {
    "english":  "What type of government scheme information do you need?",
    "hindi":    "आपको किस प्रकार की सरकारी योजनाओं की जानकारी चाहिए?",
    "marathi":  "कोणत्या प्रकारच्या योजनांबद्दल माहिती हवी आहे?",
    "gujarati": "तमने कयां प्रकारनी सरकारी योजनानी माहिती जोइए छे?",
    "kannada":  "ಯಾವ ರೀತಿಯ ಸರ್ಕಾರಿ ಯೋಜನೆ ಮಾಹಿತಿ ಬೇಕು?",
}

SCHEME_MENU_BTN = {
    "english":  "Select Scheme",
    "hindi":    "योजना चुनें",
    "marathi":  "योजना निवडा",
    "gujarati": "योजना पसंद करो",
    "kannada":  "ಯೋಜನೆ ಆಯ್ಕೆ",
}

SCHEME_FARMER  = {"english": "🌾 Farmer Schemes",   "hindi": "🌾 किसान योजना",     "marathi": "🌾 शेतकरी योजना", "gujarati": "🌾 ખेडૂत योजना",  "kannada": "🌾 ರೈತ ಯೋಜನೆ"}
SCHEME_WOMEN   = {"english": "👩 Women Schemes",    "hindi": "👩 महिला योजना",     "marathi": "👩 महिला योजना",  "gujarati": "👩 महिला योजना",  "kannada": "👩 ಮಹಿಳಾ ಯೋಜನೆ"}
SCHEME_STUDENT = {"english": "🎓 Student Schemes",  "hindi": "🎓 विद्यार्थी योजना","marathi": "🎓 विद्यार्थी योजना","gujarati": "🎓 विद्यार्थी योजना","kannada": "🎓 ವಿದ್ಯಾರ್ಥಿ ಯೋಜನೆ"}
SCHEME_HOUSING = {"english": "🏠 Housing Schemes",  "hindi": "🏠 घर योजना",        "marathi": "🏠 घर योजना",     "gujarati": "🏠 ઘर योजना",     "kannada": "🏠 ವಸತಿ ಯೋಜನೆ"}

# ── Rate limit ────────────────────────────────────────────────────────────────
RATE_LIMIT_MSG = {
    "english":  "⚠️ You have sent too many complaints. Please try again after 5 minutes.",
    "hindi":    "⚠️ आपने बहुत अधिक शिकायतें भेजी हैं। कृपया 5 मिनट बाद पुनः प्रयास करें।",
    "marathi":  "⚠️ तुम्ही खूप तक्रारी पाठवल्या आहेत.\nकृपया 5 मिनिटांनंतर पुन्हा प्रयत्न करा.",
    "gujarati": "⚠️ तमे खूब फरियादो मोकली छे. कृपया 5 मिनिट पछी प्रयास करो.",
    "kannada":  "⚠️ ನೀವು ತುಂಬಾ ದೂರುಗಳನ್ನು ಕಳಿಸಿದ್ದೀರಿ. ದಯವಿಟ್ಟು 5 ನಿಮಿಷದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
}

# ── Status lookup ─────────────────────────────────────────────────────────────
STATUS_PROMPT = {
    "english":  "Please provide the complaint ID.\nExample: status AB12CD34",
    "hindi":    "कृपया complaint ID दें।\nउदाहरण: status AB12CD34",
    "marathi":  "कृपया complaint ID टाका.\nउदाहरण: status AB12CD34",
    "gujarati": "कृपया complaint ID आपो.\nउदाहरण: status AB12CD34",
    "kannada":  "ದಯವಿಟ್ಟು complaint ID ನೀಡಿ.\nಉದಾ: status AB12CD34",
}

STATUS_NOT_FOUND = {
    "english":  "❌ Complaint '{frag}' not found.\nPlease check the ID.",
    "hindi":    "❌ Complaint '{frag}' नहीं मिली।\nकृपया ID जाँचें।",
    "marathi":  "❌ Complaint '{frag}' सापडली नाही.\nकृपया ID तपासा.",
    "gujarati": "❌ Complaint '{frag}' मळी नहीं.\nकृपया ID तपासो.",
    "kannada":  "❌ Complaint '{frag}' ಕಂಡುಬಂದಿಲ್ಲ.\nದಯವಿಟ್ಟು ID ಪರಿಶೀಲಿಸಿ.",
}

STATUS_HEADER = {
    "english":  "{emoji} *Complaint Status*\n\n🆔 ID: {id}\n📂 Category: {cat}\n🏛️ Department: {dept}\n⚠️ Severity: {sev}\n📌 Status: {status}\n📅 Filed: {date}",
    "hindi":    "{emoji} *शिकायत की स्थिति*\n\n🆔 ID: {id}\n📂 श्रेणी: {cat}\n🏛️ विभाग: {dept}\n⚠️ गंभीरता: {sev}\n📌 स्थिति: {status}\n📅 दर्ज: {date}",
    "marathi":  "{emoji} *तक्रार स्थिती*\n\n🆔 ID: {id}\n📂 विभाग: {cat}\n🏛️ खाते: {dept}\n⚠️ तीव्रता: {sev}\n📌 स्थिती: {status}\n📅 नोंद: {date}",
    "gujarati": "{emoji} *ફरিयाद સ્થિति*\n\n🆔 ID: {id}\n📂 विभाग: {cat}\n🏛️ खाते: {dept}\n⚠️ गंभीरता: {sev}\n📌 स्थिति: {status}\n📅 नोंध: {date}",
    "kannada":  "{emoji} *ದೂರು ಸ್ಥಿತಿ*\n\n🆔 ID: {id}\n📂 ವಿಭಾಗ: {cat}\n🏛️ ಇಲಾಖೆ: {dept}\n⚠️ ತೀವ್ರತೆ: {sev}\n📌 ಸ್ಥಿತಿ: {status}\n📅 ದಾಖಲು: {date}",
}

# ── Generic error ─────────────────────────────────────────────────────────────
GENERIC_ERROR = {
    "english":  "⚠️ Sorry, something went wrong. Please send 'hi' to start again.",
    "hindi":    "⚠️ क्षमा करें, कुछ गलत हो गया। पुनः शुरू करने के लिए 'hi' भेजें।",
    "marathi":  "⚠️ माफ करा, काहीतरी चुकले. पुन्हा सुरू करण्यासाठी 'hi' पाठवा.",
    "gujarati": "⚠️ माफ करशो, कंईक खोटुं थयुं. फरी शरू करवा 'hi' मोकलो.",
    "kannada":  "⚠️ ಕ್ಷಮಿಸಿ, ಏನೋ ತಪ್ಪಾಗಿದೆ. ಮತ್ತೆ ಶುರು ಮಾಡಲು 'hi' ಕಳಿಸಿ.",
}

# ── Something went wrong (lambda invoke fail) ─────────────────────────────────
INVOKE_ERROR = {
    "english":  "⚠️ Something went wrong. Please try again in a moment.",
    "hindi":    "⚠️ कुछ गलत हो गया। कृपया थोड़ी देर बाद पुनः प्रयास करें।",
    "marathi":  "⚠️ काहीतरी चुकले. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.",
    "gujarati": "⚠️ कंईक खोटुं थयुं. कृपया थोडा समय पछी फरी प्रयास करो.",
    "kannada":  "⚠️ ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
}


# ── Unsupported language (router only supports 5 languages) ──────────────────
UNSUPPORTED_LANG_MSG = (
    "⚠️ Complaint reporting is currently available only in:\n\n"
    "• English\n• Hindi / हिंदी\n• Marathi / मराठी\n"
    "• Gujarati / ગુજરાતી\n• Kannada / ಕನ್ನಡ\n\n"
    'Please type "language" to choose a supported language.'
)

# ══════════════════════════════════════════════════════════════════════════════
# LANGUAGE HELPER
# ══════════════════════════════════════════════════════════════════════════════

def resolve_lang(raw):
    """
    Returns a valid language key from any raw value.
    Falls back to DEFAULT_LANGUAGE if raw is None, empty, or unrecognised.
    """
    if raw and raw.lower() in SUPPORTED_LANGUAGES:
        return raw.lower()
    return DEFAULT_LANGUAGE


def t(dictionary, language):
    """
    Safe dictionary lookup with automatic English fallback.
    Usage: t(COMPLAINT_ACK, lang)
    """
    return dictionary.get(language) or dictionary[DEFAULT_LANGUAGE]


# ══════════════════════════════════════════════════════════════════════════════
# DATABASE
# ══════════════════════════════════════════════════════════════════════════════

_db_conn = None

# Category cache — rows rarely change; refresh every 5 min to cut DB load
import time as _time
_CATEGORY_CACHE_ROWS = None   # raw DB rows (lang-independent)
_CATEGORY_CACHE_TS   = 0
CATEGORY_CACHE_TTL   = 300    # seconds


def get_db():
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


def _safe_rollback(conn):
    try:
        conn.rollback()
    except Exception as e:
        logger.warning(f"DB: rollback failed: {e}")


def get_citizen(conn, phone):
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(
            """
            INSERT INTO citizens (phone_number, conversation_state)
            VALUES (%s, 'awaiting_language')
            ON CONFLICT (phone_number) DO NOTHING
            """,
            (phone,)
        )
        conn.commit()
        cur.execute(
            """
            SELECT id, conversation_state, preferred_language,
                   selected_category_id, selected_subcategory_id,
                   pending_location_lat, pending_location_lon
            FROM citizens WHERE phone_number = %s
            """,
            (phone,)
        )
        return dict(cur.fetchone())


def update_citizen(conn, phone, **fields):
    if not fields:
        return
    set_clause = ", ".join(f"{k} = %s" for k in fields)
    values     = list(fields.values()) + [phone]
    with conn.cursor() as cur:
        cur.execute(
            f"UPDATE citizens SET {set_clause} WHERE phone_number = %s",
            values
        )
    conn.commit()
    logger.info(f"DB: updated {list(fields.keys())} for {phone}")


def set_citizen_state(conn, phone, state,
                      category_id=None, subcategory_id=None,
                      location_lat=None, location_lon=None):
    """
    Updates conversation state and only the context fields explicitly provided.
    Omitted fields are LEFT UNCHANGED in the DB — avoids silent data loss.
    Use reset_citizen_state() when you need a full wipe back to idle.
    """
    fields = {"conversation_state": state}
    if category_id    is not None: fields["selected_category_id"]    = category_id
    if subcategory_id is not None: fields["selected_subcategory_id"] = subcategory_id
    if location_lat   is not None: fields["pending_location_lat"]    = location_lat
    if location_lon   is not None: fields["pending_location_lon"]    = location_lon
    update_citizen(conn, phone, **fields)


def reset_citizen_state(conn, phone):
    """Full wipe — explicitly clears all context fields and returns to idle."""
    update_citizen(
        conn, phone,
        conversation_state="idle",
        selected_category_id=None,
        selected_subcategory_id=None,
        pending_location_lat=None,
        pending_location_lon=None,
    )


# Map canonical language names to 2-letter column suffix
_LANG_SUFFIX = {
    "english":  "en",
    "hindi":    "hi",
    "marathi":  "mr",
    "gujarati": "gu",
    "kannada":  "kn",
}


def _apply_lang_to_category_rows(raw_rows, lang):
    """Converts raw DB rows into labelled category dicts for the given language."""
    suffix = _LANG_SUFFIX.get(lang, "en")
    result = []
    for row in raw_rows:
        label = row.get(f"label_{suffix}") or row.get("label_en") or row["category_name"]
        desc  = row.get(f"desc_{suffix}")  or row.get("desc_en")  or ""
        result.append({"id": str(row["id"]), "label": label, "desc": desc})
    return result


def fetch_categories(conn, lang=DEFAULT_LANGUAGE):
    """
    Returns category rows labelled for `lang`.
    Raw rows are cached for CATEGORY_CACHE_TTL seconds — label selection is
    always done fresh so language switches never show stale text.
    """
    global _CATEGORY_CACHE_ROWS, _CATEGORY_CACHE_TS

    now = _time.monotonic()
    if _CATEGORY_CACHE_ROWS is None or (now - _CATEGORY_CACHE_TS) > CATEGORY_CACHE_TTL:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                """
                SELECT id, category_name,
                       label_en, label_hi, label_mr, label_gu, label_kn,
                       desc_en,  desc_hi,  desc_mr,  desc_gu,  desc_kn
                FROM complaint_categories
                ORDER BY category_name
                """
            )
            _CATEGORY_CACHE_ROWS = [dict(r) for r in cur.fetchall()]
            _CATEGORY_CACHE_TS   = now
            logger.info(f"Category cache refreshed ({len(_CATEGORY_CACHE_ROWS)} rows)")

    return _apply_lang_to_category_rows(_CATEGORY_CACHE_ROWS, lang)


def fetch_subcategories(conn, category_uuid, lang=DEFAULT_LANGUAGE):
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(
            """
            SELECT id, subcategory_name,
                   label_en, label_hi, label_mr, label_gu, label_kn
            FROM complaint_subcategories
            WHERE category_id = %s
            ORDER BY subcategory_name
            """,
            (category_uuid,)
        )
        rows = cur.fetchall()

    result = []
    for row in rows:
        label_map = {
            "english":  row["label_en"],
            "hindi":    row["label_hi"],
            "marathi":  row["label_mr"],
            "gujarati": row["label_gu"],
            "kannada":  row["label_kn"],
        }
        label = label_map.get(lang) or row["label_en"] or row["subcategory_name"]
        result.append({
            "id":    str(row["id"]),
            "label": label,
        })
    return result


def fetch_complaint_status(conn, id_fragment):
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT c.id, cat.category_name, c.department,
                   c.severity, c.status, c.created_at
            FROM citizen_complaints c
            LEFT JOIN complaint_categories cat ON c.category_id = cat.id
            WHERE UPPER(LEFT(c.id::text, 8)) = UPPER(%s)
            LIMIT 1
            """,
            (id_fragment[:8],)
        )
        return cur.fetchone()


def check_rate_limit(conn, phone, max_complaints=5, window_minutes=5):
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT COUNT(*) FROM citizen_complaints
            WHERE phone_number = %s
              AND created_at > NOW() - (%s * INTERVAL '1 minute')
            """,
            (phone, window_minutes)
        )
        count = cur.fetchone()[0]
    logger.info(f"Rate check {phone}: {count}/{max_complaints} in {window_minutes}min window")
    return count >= max_complaints


# ══════════════════════════════════════════════════════════════════════════════
# WHATSAPP HELPERS
# ══════════════════════════════════════════════════════════════════════════════

def _wa_post(payload_dict):
    url     = f"https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages"
    payload = json.dumps(payload_dict).encode("utf-8")
    req = urllib.request.Request(url, data=payload)
    req.add_header("Content-Type",  "application/json")
    req.add_header("Authorization", f"Bearer {WHATSAPP_TOKEN}")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            logger.info(f"WA API {resp.status}: {resp.read().decode()[:200]}")
    except urllib.error.HTTPError as e:
        logger.error(f"WA API HTTP {e.code}: {e.read().decode()[:300]}")
    except Exception as e:
        logger.error(f"WA API error: {e}")


def send_text(to, text):
    _wa_post({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": text[:WA_TEXT_MAX]}
    })


def send_button_menu(to, body_text, buttons):
    _wa_post({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {"text": body_text[:WA_TEXT_MAX]},
            "action": {
                "buttons": [
                    {"type": "reply", "reply": {"id": b["id"], "title": b["title"][:WA_TITLE_MAX]}}
                    for b in buttons[:3]
                ]
            }
        }
    })


def send_list_menu(to, body_text, button_label, sections):
    _wa_post({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "interactive",
        "interactive": {
            "type": "list",
            "body":   {"text": body_text[:WA_TEXT_MAX]},
            "action": {
                "button":   button_label[:WA_TITLE_MAX],
                "sections": sections
            }
        }
    })


# ══════════════════════════════════════════════════════════════════════════════
# MENU BUILDERS  (all accept lang parameter)
# ══════════════════════════════════════════════════════════════════════════════

def send_language_menu(phone):
    """Language selection — always shown in all languages simultaneously."""
    send_list_menu(
        phone,
        "🌐 Welcome to Neta.ai!\n\nPlease choose your language / भाषा निवडा",
        "Select Language",
        [{
            "title": "Languages",
            "rows": [
                {"id": "LANG_EN", "title": "English"},
                {"id": "LANG_HI", "title": "हिंदी"},
                {"id": "LANG_MR", "title": "मराठी"},
                {"id": "LANG_GU", "title": "ગુજરાતી"},
                {"id": "LANG_KN", "title": "ಕನ್ನಡ"},
            ]
        }]
    )


def send_main_menu(phone, lang):
    send_button_menu(
        phone,
        t(MAIN_MENU_BODY, lang),
        [
            {"id": "RAISE_ISSUE", "title": t(MAIN_MENU_RAISE,   lang)[:WA_TITLE_MAX]},
            {"id": "ASK_SCHEMES", "title": t(MAIN_MENU_SCHEMES, lang)[:WA_TITLE_MAX]},
        ]
    )


def send_category_menu(phone, conn, lang):
    categories = fetch_categories(conn, lang)
    if not categories:
        send_text(phone, t(CATEGORY_UNAVAILABLE, lang))
        return

    rows = [
        {
            "id":          f"CAT_{c['id']}",
            "title":       c["label"][:WA_TITLE_MAX],
            "description": c["desc"][:WA_DESC_MAX],
        }
        for c in categories[:WA_LIST_ROWS_MAX]
    ]
    send_list_menu(
        phone,
        t(CATEGORY_MENU_BODY, lang),
        t(CATEGORY_MENU_BTN,  lang),
        [{"title": t(CATEGORY_SECTION_TITLE, lang), "rows": rows}]
    )


def send_subcategory_menu(phone, conn, category_uuid, lang):
    subcats = fetch_subcategories(conn, category_uuid, lang)
    if not subcats:
        send_description_prompt(phone, lang)
        return

    rows = [
        {"id": f"SUBCAT_{s['id']}", "title": s["label"][:WA_TITLE_MAX]}
        for s in subcats[:WA_LIST_ROWS_MAX]
    ]
    send_list_menu(
        phone,
        t(SUBCATEGORY_MENU_BODY, lang),
        t(SUBCATEGORY_MENU_BTN,  lang),
        [{"title": t(SUBCATEGORY_SECTION_TITLE, lang), "rows": rows}]
    )


def send_description_prompt(phone, lang):
    send_text(phone, t(DESCRIPTION_PROMPT, lang))


def send_scheme_menu(phone, lang):
    send_list_menu(
        phone,
        t(SCHEME_MENU_BODY, lang),
        t(SCHEME_MENU_BTN,  lang),
        [{
            "title": t(SCHEME_MENU_BODY, lang)[:WA_TITLE_MAX],
            "rows": [
                {"id": "SCHEME_FARMER",  "title": t(SCHEME_FARMER,  lang)[:WA_TITLE_MAX]},
                {"id": "SCHEME_WOMEN",   "title": t(SCHEME_WOMEN,   lang)[:WA_TITLE_MAX]},
                {"id": "SCHEME_STUDENT", "title": t(SCHEME_STUDENT, lang)[:WA_TITLE_MAX]},
                {"id": "SCHEME_HOUSING", "title": t(SCHEME_HOUSING, lang)[:WA_TITLE_MAX]},
            ]
        }]
    )


# ══════════════════════════════════════════════════════════════════════════════
# COMPLAINT LAMBDA INVOKER
# ══════════════════════════════════════════════════════════════════════════════

def invoke_complaint_lambda(phone, message, msg_type="text", lang=DEFAULT_LANGUAGE,
                            category_id=None, subcategory_id=None,
                            location_lat=None, location_lon=None):
    payload = {
        "phone":          phone,
        "type":           msg_type,
        "message":        message,
        "category_id":    str(category_id)    if category_id    else None,
        "subcategory_id": str(subcategory_id) if subcategory_id else None,
        "location_lat":   location_lat,
        "location_lon":   location_lon,
        "language":       lang,
    }
    try:
        lambda_client.invoke(
            FunctionName=COMPLAINT_LAMBDA,
            InvocationType="Event",
            Payload=json.dumps(payload).encode("utf-8")
        )
        logger.info(
            f"Complaint lambda invoked: phone={phone} type={msg_type} "
            f"cat={category_id} subcat={subcategory_id} "
            f"lat={location_lat} lon={location_lon}"
        )
    except Exception as e:
        logger.error(f"Failed to invoke complaint lambda: {e}")
        send_text(phone, t(INVOKE_ERROR, lang))


# ══════════════════════════════════════════════════════════════════════════════
# UTILITIES
# ══════════════════════════════════════════════════════════════════════════════

def _extract_interactive_id(message):
    interactive = message.get("interactive", {})
    for key in ("button_reply", "list_reply"):
        if key in interactive:
            return interactive[key].get("id")
    return None


def _is_cancel_or_greeting(text_lower):
    return text_lower in GREETINGS or text_lower in CANCEL_KEYWORDS


def _is_language_command(text_lower, lang=DEFAULT_LANGUAGE):
    """Substring match against the citizen's language commands + English fallback."""
    normalized = text_lower.strip().lower()
    commands   = LANGUAGE_COMMANDS.get(lang, set()) | LANGUAGE_COMMANDS[DEFAULT_LANGUAGE]
    return any(cmd in normalized for cmd in commands)


def _is_category_command(text_lower, lang=DEFAULT_LANGUAGE):
    """Returns True when the citizen wants to (re-)open the category menu."""
    normalized = text_lower.strip().lower()
    commands   = CATEGORY_COMMANDS.get(lang, set()) | CATEGORY_COMMANDS[DEFAULT_LANGUAGE]
    return any(cmd in normalized for cmd in commands)


def _send_rate_limit_msg(phone, lang):
    send_text(phone, t(RATE_LIMIT_MSG, lang))


# ══════════════════════════════════════════════════════════════════════════════
# LANGUAGE STATE HANDLER
# ══════════════════════════════════════════════════════════════════════════════

def handle_awaiting_language(conn, phone, msg_type, message):
    """
    Parses language selection from list reply / button reply / plain text.
    Confirmation is sent in the chosen language.
    Main menu is then shown in the chosen language.
    """
    selection = None

    if msg_type == "interactive":
        reply_id  = _extract_interactive_id(message)
        selection = (reply_id or "").strip().upper()
    elif msg_type == "text":
        text      = message.get("text", {}).get("body", "").strip()
        selection = text.upper()

    language = LANGUAGE_MAP.get(selection) if selection else None

    if language:
        update_citizen(conn, phone, preferred_language=language, conversation_state="idle")
        logger.info(f"Language set to '{language}' for {phone}")
        send_text(phone, t(LANG_SAVED, language))
        send_main_menu(phone, language)
    else:
        send_text(phone, t(LANG_INVALID, DEFAULT_LANGUAGE))
        send_language_menu(phone)


# ══════════════════════════════════════════════════════════════════════════════
# STATE MACHINE HANDLERS
# ══════════════════════════════════════════════════════════════════════════════

def handle_idle(conn, phone, msg_type, message, citizen, lang):

    # ── Location pin ──────────────────────────────────────────────────────────
    if msg_type == "location":
        lat  = message.get("location", {}).get("latitude")
        lon  = message.get("location", {}).get("longitude")
        name = message.get("location", {}).get("name", "")
        logger.info(f"Location pin: {phone} → {lat},{lon} '{name}'")

        if check_rate_limit(conn, phone):
            _send_rate_limit_msg(phone, lang)
            return

        set_citizen_state(
            conn, phone, "awaiting_description",
            category_id=citizen.get("selected_category_id"),
            subcategory_id=citizen.get("selected_subcategory_id"),
            location_lat=lat, location_lon=lon,
        )
        send_text(phone, t(LOCATION_RECEIVED, lang))
        return

    # ── Image ─────────────────────────────────────────────────────────────────
    if msg_type == "image":
        if check_rate_limit(conn, phone):
            _send_rate_limit_msg(phone, lang)
            return

        logger.info(f"Image complaint: {phone}")
        send_text(phone, t(PHOTO_RECEIVED, lang))
        invoke_complaint_lambda(
            phone, message, msg_type="image", lang=lang,
            category_id=citizen.get("selected_category_id"),
            subcategory_id=citizen.get("selected_subcategory_id"),
        )
        return

    # ── Interactive button ────────────────────────────────────────────────────
    if msg_type == "interactive":
        reply_id = _extract_interactive_id(message)
        if reply_id == "RAISE_ISSUE":
            set_citizen_state(conn, phone, "awaiting_category")
            send_category_menu(phone, conn, lang)
        elif reply_id == "ASK_SCHEMES":
            send_scheme_menu(phone, lang)
        elif reply_id and reply_id.startswith("CAT_"):
            # Stale CAT_ tap in idle — wipe old context before entering new flow
            category_uuid = reply_id[4:]
            reset_citizen_state(conn, phone)
            set_citizen_state(
                conn, phone, "awaiting_subcategory",
                category_id=category_uuid,
                subcategory_id=None,
            )
            send_subcategory_menu(phone, conn, category_uuid, lang)
        elif reply_id and reply_id.startswith("SUBCAT_"):
            # Stale subcategory tap while in idle — restart guided category flow
            logger.info(f"Stale SUBCAT_ tap in idle from {phone} — reopening category menu")
            reset_citizen_state(conn, phone)
            set_citizen_state(conn, phone, "awaiting_category")
            send_category_menu(phone, conn, lang)
        else:
            logger.info(f"Unknown button '{reply_id}' in idle — showing main menu")
            send_main_menu(phone, lang)
        return

    # ── Text ──────────────────────────────────────────────────────────────────
    if msg_type == "text":
        text       = message.get("text", {}).get("body", "").strip()
        text_lower = text.lower()

        if not text or _is_cancel_or_greeting(text_lower):
            send_main_menu(phone, lang)
            return

        if text_lower.startswith("status"):
            parts = text.split(None, 1)
            if len(parts) == 2:
                _handle_status_lookup(conn, phone, parts[1].strip(), lang)
            else:
                send_text(phone, t(STATUS_PROMPT, lang))
            return

        # Category re-select command — open guided flow from any idle sub-state
        if _is_category_command(text_lower, lang):
            logger.info(f"Category menu requested by {phone}")
            set_citizen_state(conn, phone, "awaiting_category")
            send_category_menu(phone, conn, lang)
            return

        if len(text) < MIN_COMPLAINT_LENGTH:
            logger.info(f"Ignoring short message from {phone}: '{text}'")
            send_main_menu(phone, lang)
            return

        if check_rate_limit(conn, phone):
            _send_rate_limit_msg(phone, lang)
            return

        logger.info(f"Free-text complaint from {phone}: {text[:80]}")
        send_text(phone, t(COMPLAINT_ACK, lang))
        invoke_complaint_lambda(phone, message, msg_type="text", lang=lang)
        return

    logger.info(f"Unhandled msg_type '{msg_type}' in idle — ignoring")


def handle_awaiting_category(conn, phone, msg_type, message, lang):
    text_lower = message.get("text", {}).get("body", "").strip().lower() if msg_type == "text" else ""
    text_raw   = message.get("text", {}).get("body", "").strip()           if msg_type == "text" else ""

    if _is_cancel_or_greeting(text_lower):
        reset_citizen_state(conn, phone)
        send_main_menu(phone, lang)
        return

    reply_id = _extract_interactive_id(message)
    if reply_id and reply_id.startswith("CAT_"):
        # Bug 1 fix: always reset subcategory when a new category is chosen
        category_uuid = reply_id[4:]
        set_citizen_state(
            conn, phone, "awaiting_subcategory",
            category_id=category_uuid,
            subcategory_id=None,   # explicitly clear any previous selection
        )
        send_subcategory_menu(phone, conn, category_uuid, lang)
        return

    if msg_type == "text" and len(text_raw) >= MIN_COMPLAINT_LENGTH:
        if check_rate_limit(conn, phone):
            _send_rate_limit_msg(phone, lang)
            return
        logger.info(f"Free-text during awaiting_category: {phone} '{text_lower[:60]}'")
        send_text(phone, t(COMPLAINT_ACK, lang))
        invoke_complaint_lambda(phone, message, msg_type="text", lang=lang)
        reset_citizen_state(conn, phone)
        return

    send_text(phone, t(CATEGORY_REPROMPT, lang))
    send_category_menu(phone, conn, lang)


def handle_awaiting_subcategory(conn, phone, msg_type, message, category_uuid, lang):
    text_lower = message.get("text", {}).get("body", "").strip().lower() if msg_type == "text" else ""
    text_raw   = message.get("text", {}).get("body", "").strip()           if msg_type == "text" else ""

    if _is_cancel_or_greeting(text_lower):
        reset_citizen_state(conn, phone)
        send_main_menu(phone, lang)
        return

    reply_id = _extract_interactive_id(message)

    # Bug 1 fix: user taps a different category while already viewing subcategories.
    # Overwrite previous category, explicitly clear old subcategory, re-render menu.
    if reply_id and reply_id.startswith("CAT_"):
        new_category_uuid = reply_id[4:]
        logger.info(f"Category re-selected in subcategory state: {phone} → {new_category_uuid}")
        set_citizen_state(
            conn, phone, "awaiting_subcategory",
            category_id=new_category_uuid,
            subcategory_id=None,
        )
        send_subcategory_menu(phone, conn, new_category_uuid, lang)
        return

    if reply_id and reply_id.startswith("SUBCAT_"):
        subcategory_uuid = reply_id[7:]
        set_citizen_state(
            conn, phone, "awaiting_description",
            category_id=category_uuid, subcategory_id=subcategory_uuid,
        )
        send_description_prompt(phone, lang)
        return

    if msg_type == "text" and len(text_raw) >= MIN_COMPLAINT_LENGTH:
        if check_rate_limit(conn, phone):
            _send_rate_limit_msg(phone, lang)
            return
        send_text(phone, t(COMPLAINT_ACK, lang))
        invoke_complaint_lambda(phone, message, msg_type="text", lang=lang, category_id=category_uuid)
        reset_citizen_state(conn, phone)
        return

    send_subcategory_menu(phone, conn, category_uuid, lang)


def handle_awaiting_description(conn, phone, msg_type, message, citizen, lang):
    text_raw   = message.get("text", {}).get("body", "").strip() if msg_type == "text" else ""
    text_lower = text_raw.lower()

    if _is_cancel_or_greeting(text_lower):
        reset_citizen_state(conn, phone)
        send_main_menu(phone, lang)
        return

    if msg_type == "text" and len(text_raw) < MIN_COMPLAINT_LENGTH:
        send_text(phone, t(DESCRIPTION_TOO_SHORT, lang))
        return

    if msg_type not in ("text", "image", "location"):
        send_text(phone, t(DESCRIPTION_WRONG_TYPE, lang))
        return

    if check_rate_limit(conn, phone):
        _send_rate_limit_msg(phone, lang)
        return

    category_id    = citizen.get("selected_category_id")
    subcategory_id = citizen.get("selected_subcategory_id")
    lat = citizen.get("pending_location_lat")
    lon = citizen.get("pending_location_lon")

    if msg_type == "location":
        lat = message.get("location", {}).get("latitude",  lat)
        lon = message.get("location", {}).get("longitude", lon)

    send_text(phone, t(COMPLAINT_REGISTERING, lang))
    invoke_complaint_lambda(
        phone, message,
        msg_type=msg_type, lang=lang,
        category_id=category_id, subcategory_id=subcategory_id,
        location_lat=lat, location_lon=lon,
    )
    reset_citizen_state(conn, phone)


# ── Status lookup ─────────────────────────────────────────────────────────────

def _handle_status_lookup(conn, phone, id_fragment, lang):
    row = fetch_complaint_status(conn, id_fragment)
    if not row:
        send_text(phone, t(STATUS_NOT_FOUND, lang).format(frag=id_fragment))
        return

    complaint_id, category, department, severity, status, created_at = row
    status_emoji = {"pending": "⏳", "in_progress": "🔄", "resolved": "✅", "rejected": "❌"}.get(status, "📋")

    send_text(
        phone,
        t(STATUS_HEADER, lang).format(
            emoji=status_emoji,
            id=str(complaint_id)[:8].upper(),
            cat=category or "N/A",
            dept=(department or "N/A").replace("_", " ").title(),
            sev=(severity  or "N/A").title(),
            status=status.replace("_", " ").title(),
            date=created_at.strftime("%d %b %Y") if created_at else "N/A",
        )
    )


# ══════════════════════════════════════════════════════════════════════════════
# LAMBDA HANDLER
# ══════════════════════════════════════════════════════════════════════════════

def lambda_handler(event, context):
    global _db_conn   # declared here so the retry loop and except block can assign it
    request_id = context.aws_request_id if context else "local"
    logger.info(f"Router invoked | requestId={request_id}")
    logger.info(f"phone={event.get('phone')} type={event.get('type')}")

    phone    = event.get("phone")
    msg_type = event.get("type", "")
    message  = event.get("message", {})

    if not phone:
        logger.warning("Missing 'phone' — ignoring")
        return {"status": "ignored", "reason": "missing_phone"}

    if not msg_type:
        logger.warning("Missing 'type' — ignoring")
        return {"status": "ignored", "reason": "missing_type"}

    # ── Language: always trust the preprocessor's payload, never detect ─────────
    # Normalise casing; fall back to english if missing or unrecognised.
    raw_lang = (event.get("language") or DEFAULT_LANGUAGE).lower()
    lang     = raw_lang if raw_lang in SUPPORTED_LANGUAGES else DEFAULT_LANGUAGE
    logger.info(f"Router lang={lang} (raw='{raw_lang}')")

    try:
        # ── Unsupported language guard ─────────────────────────────────────────
        # Router only supports the 5 languages listed in SUPPORTED_LANGUAGES.
        # If the preprocessor forwards an unsupported language, tell the user
        # and stop — do not enter the complaint state machine.
        if raw_lang not in SUPPORTED_LANGUAGES:
            logger.warning(f"Unsupported language '{raw_lang}' from {phone} — rejecting")
            send_text(phone, UNSUPPORTED_LANG_MSG)
            return {"status": "ignored", "reason": f"unsupported_language:{raw_lang}"}

        # Retry once — covers the rare case where a warm container's connection
        # dies between invocations and get_db() hasn't detected it yet.
        conn = None
        for _attempt in range(2):
            try:
                conn = get_db()
                break
            except Exception as _conn_err:
                logger.warning(f"DB connect attempt {_attempt+1} failed: {_conn_err}")
                _db_conn = None
        if conn is None:
            raise RuntimeError("Could not establish DB connection after 2 attempts")

        citizen = get_citizen(conn, phone)
        state   = citizen.get("conversation_state") or "idle"
        # NOTE: lang comes from the event payload (set above), NOT from the DB.
        # The preprocessor owns language state; router must never overwrite it.

        logger.info(
            f"state={state} lang={lang} "
            f"cat={citizen.get('selected_category_id')} "
            f"subcat={citizen.get('selected_subcategory_id')} "
            f"lat={citizen.get('pending_location_lat')}"
        )

        # ── GLOBAL: category menu command (works from any complaint state) ─────
        if msg_type == "text":
            text_body = message.get("text", {}).get("body", "").strip().lower()
            if _is_category_command(text_body, lang):
                logger.info(f"Category menu requested by {phone}")
                reset_citizen_state(conn, phone)
                set_citizen_state(conn, phone, "awaiting_category")
                send_category_menu(phone, conn, lang)
                return {"status": "awaiting_category"}

        # ── Guard against corrupted / out-of-scope state ───────────────────────
        # awaiting_language is a preprocessor state — if we somehow receive it
        # here, treat the citizen as idle so the complaint flow can begin.
        COMPLAINT_STATES = {"idle", "awaiting_category", "awaiting_subcategory", "awaiting_description"}
        if state not in COMPLAINT_STATES:
            logger.warning(f"Non-complaint state '{state}' received by router — treating as idle")
            state = "idle"

        # ── State dispatch ─────────────────────────────────────────────────────
        if state == "idle":
            handle_idle(conn, phone, msg_type, message, citizen, lang)

        elif state == "awaiting_category":
            handle_awaiting_category(conn, phone, msg_type, message, lang)

        elif state == "awaiting_subcategory":
            handle_awaiting_subcategory(
                conn, phone, msg_type, message,
                citizen.get("selected_category_id"), lang
            )

        elif state == "awaiting_description":
            handle_awaiting_description(conn, phone, msg_type, message, citizen, lang)

        return {"status": "handled", "state": state}

    except Exception as e:
        logger.exception(f"Unhandled error | requestId={request_id}")

        try:
            _safe_rollback(get_db())
        except Exception:
            pass
        _db_conn = None

        try:
            send_text(phone, t(GENERIC_ERROR, lang))
        except Exception:
            pass

        return {"status": "error", "message": str(e)}