# Neta.ai — Civic Connect
### *Sarkar Ki Schemes, Aapki Awaaz Mein*
#### AI-Powered Civic Assistant for Bharat | AI for Bharat Hackathon 2026

<p align="center">
  <a href="https://main.d1hh4kyma0kn0.amplifyapp.com/"><strong>🌐 Live Website</strong></a> &nbsp;|&nbsp;
  <a href="https://wa.me/919653233733?text=Hi"><strong>💬 Try WhatsApp Bot → +91 96532 33733</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AWS-Powered-FF9900?logo=amazon-aws&logoColor=white"/>
  <img src="https://img.shields.io/badge/WhatsApp-Bot-25D366?logo=whatsapp&logoColor=white"/>
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js"/>
  <img src="https://img.shields.io/badge/Languages-8-blue"/>
  <img src="https://img.shields.io/badge/Schemes-10-green"/>
  <img src="https://img.shields.io/badge/Deployed-AWS_Amplify-orange"/>
</p>

---

> ⚠️ **Live Bot Notice:** The WhatsApp number (+91 96532 33733) 
> is temporarily restricted due to an automated Meta policy flag 
> on our business profile URL (now fixed). An appeal has been 
> submitted and is under review (typically 24–48 hrs). 
> The AWS Lambda architecture, DynamoDB sessions, Polly audio, 
> and S3 poster delivery are all fully functional — 
> please refer to the Demo Video for a complete walkthrough.

---

## 🧩 The Problem

India has **535+ million rural citizens** eligible for government welfare schemes who never claim them — not because they don't qualify, but because they can't navigate complex portals or speak a dialect any government website supports.

Simultaneously, civic complaints — broken roads, water failures, streetlight outages — go unreported because filing them requires literacy, internet access, and knowledge of which department to contact.

> *A farmer saying "meri fasal barbaad ho gayi" in Awadhi dialect should be automatically matched to PM Fasal Bima Yojana — no keyword match possible. This is exactly why AI is non-negotiable at scale.*

**Neta.ai** meets citizens where they already are — WhatsApp — and guides them through government services in their own language, with their own voice.

---

## ✨ What Neta.ai Does

| Feature | Channel | Status |
|---|---|---|
| 🏛️ **Scheme Discovery** — AI eligibility check across 10 major schemes | WhatsApp + Web | ✅ Live |
| 🗣️ **8 Indian Languages** — Full UI in Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Kannada, English | WhatsApp + Web | ✅ Live |
| 🔊 **Voice Responses** — AWS Polly neural audio in user's own language | WhatsApp | ✅ Live |
| 🖼️ **Scheme Posters** — Language-matched official posters via S3 | WhatsApp + Web | ✅ Live |
| 📢 **Grievance Reporting** — Report civic issues with AI classification via Bedrock | WhatsApp + Web | ✅ Live |
| 📍 **Complaint Tracking** — End-to-end status tracking by complaint ID | WhatsApp + Web | ✅ Live |
| 👨‍💼 **Admin Dashboard** — Analytics and grievance management for officials | Web | ✅ Live |

---

## 📱 Try the Bot

**WhatsApp:** [+91 96532 33733](https://wa.me/919653233733?text=Hi)

### Flow A — Scheme Discovery
```
You:  Hi
Bot:  🌐 Language picker (1-8)
You:  2  →  Hindi
Bot:  नमस्ते! 3 options shown
You:  1  →  Find Schemes
Bot:  Eligibility checker (5 questions — occupation, age, income, gender, Aadhaar)
Bot:  🎉 Matched schemes + 🔊 Polly audio + 🖼️ Scheme poster
You:  S1
Bot:  Full scheme details + 🔊 Audio + 🖼️ Official language-matched poster
```

### Flow B — Civic Grievance Reporting
```
You:  2  →  Report Civic Issue
Bot:  [Category menu — Roads / Water / Electricity / Sanitation / Noise ...]
You:  Select: Roads
Bot:  [Sub-category menu — Pothole / Road collapse / Flooding ...]
You:  Select: Pothole
Bot:  📝 Describe your issue (text / photo / location pin)
You:  "Large pothole near Malad station, been here a week"
Bot:  ⏳ Registering complaint...
Bot:  ✅ Complaint ID: AB12CD34 | Dept: Municipal Roads | Severity: Medium
You:  status AB12CD34
Bot:  📌 In Progress | Filed: 09 Mar 2026
```

---

## 🏗️ System Architecture

### The Hybrid-DB Strategy

We deliberately split the data layer to optimize for the right trade-off at each level:

| Database | Used For | Why |
|---|---|---|
| **AWS DynamoDB** | WhatsApp session state, message deduplication | Sub-millisecond reads for real-time conversation; TTL-based auto-cleanup |
| **Supabase (PostgreSQL)** | Grievances, citizens, complaint lifecycle | Relational integrity, JOIN queries for admin dashboard, future PostGIS geospatial |
| **AWS S3** | Scheme posters (80 images), Polly audio files | Scalable, publicly accessible CDN for media delivery |

### Full Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER CHANNELS                              │
│   WhatsApp ──────────────────────── Web Portal (Next.js/Amplify) │
└───────────────────┬──────────────────────────┬───────────────────┘
                    │                          │
                    ▼                          ▼
        ┌───────────────────┐      ┌───────────────────────┐
        │  AWS API Gateway  │      │   AWS Amplify Hosting  │
        │  (Webhook)        │      │   (CDN + CI/CD)        │
        └─────────┬─────────┘      └───────────────────────┘
                  │
                  ▼
        ┌───────────────────┐
        │  Lambda 1         │  ← Returns 200 instantly (< 1s)
        │  netaai-bot-test  │  ← Atomic dedup via DynamoDB
        └─────────┬─────────┘  ← Async invokes Processor
                  │  (InvocationType=Event)
                  ▼
        ┌───────────────────┐
        │  Lambda 2         │  ← Full bot state machine
        │  netaai-bot-      │  ← 8-language responses
        │  processor        │  ← Scheme eligibility logic
        └──┬──────┬──────┬──┘
           │      │      │
           ▼      ▼      ▼
      DynamoDB  Polly   S3
      (Session) (Audio) (Posters)
           │
           │  [On complaint flow — menu option 2]
           ▼
        ┌───────────────────┐
        │  neta_ai_router   │  ← Complaint state machine
        │  (Lambda)         │  ← Category / subcategory guided menus
        └─────────┬─────────┘  ← Supports text / image / location pin
                  │
                  ▼
        ┌───────────────────┐
        │  neta_complaint_  │  ← AWS Bedrock AI classification
        │  lambda           │  ← Detects severity, department, location
        └─────────┬─────────┘  ← Idempotency guard against duplicates
                  │
                  ▼
        ┌───────────────────┐
        │  Supabase         │  ← Structured grievance storage
        │  (PostgreSQL)     │  ← Citizen profiles, complaint lifecycle
        └───────────────────┘
```

### Why Two Lambdas for the Bot?

WhatsApp requires a **200 OK response within 5 seconds** or it retries — causing duplicate messages. Lambda 1 acknowledges instantly and deduplicates using a DynamoDB conditional write. Lambda 2 handles all processing asynchronously. This is the same pattern used by enterprise-scale WhatsApp deployments.

---

## 🛠️ Tech Stack

### AWS Services

| Service | Purpose |
|---|---|
| **AWS Lambda** (Python 3.11) | 4 functions: webhook receiver, bot processor, complaint router, complaint classifier |
| **AWS DynamoDB** | Session state + message deduplication (TTL-enabled, 24h auto-expiry) |
| **AWS S3** | 80 scheme posters + Polly-generated audio files |
| **AWS Polly** | Neural TTS — Kajal voice in 8 Indian languages |
| **AWS API Gateway** | HTTP webhook endpoint for WhatsApp |
| **AWS Amplify** | Next.js hosting with GitHub CI/CD |
| **AWS Bedrock** | AI intent classification for grievances (Claude Haiku) |

### Other Technologies

| Technology | Purpose |
|---|---|
| **Next.js 14** | Web portal — App Router, SSR |
| **TypeScript** | Type-safe frontend |
| **Tailwind CSS + Shadcn UI** | Component styling |
| **Supabase (PostgreSQL)** | Grievance database, citizen profiles |
| **Meta WhatsApp Cloud API** | Message delivery + media sending |
| **Recharts** | Admin analytics dashboard |

---

## 📂 Repository Structure

```
aiforbharat/
│
├── src/                             # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx                 # Landing page with WhatsApp simulator
│   │   ├── schemes/page.tsx         # Scheme discovery portal
│   │   ├── dashboard/page.tsx       # Citizen dashboard
│   │   └── admin/                   # Admin panel (grievances, analytics)
│   ├── components/
│   │   ├── WhatsAppSimulator.tsx    # Animated bot conversation demo
│   │   ├── SchemeCard.tsx
│   │   └── admin/                   # Admin-specific components
│   └── lib/
│       ├── mockData.ts              # Scheme + grievance data
│       └── constants.ts             # S3 URLs, language config
│
├── backend/                         # AWS Lambda Functions
│   ├── netaai-bot-test/
│   │   └── lambda_function.py       # Webhook receiver + deduplication
│   ├── netaai-bot-processor/
│   │   ├── lambda_function.py       # Bot state machine + Polly + S3 posters
│   │   └── responses.py             # All 8-language translations
│   ├── neta_ai_router/
│   │   └── lambda_function.py       # Complaint flow router (multilingual menus)
│   └── neta_complaint_lambda/
│       └── lambda_function.py       # Bedrock AI classification + Supabase write
│
├── database/
│   ├── supabase/schema.sql          # PostgreSQL schema (grievances, citizens)
│   └── dynamodb/                    # DynamoDB table design
│
├── public/                          # Static assets
├── .env.example                     # All required environment variables
└── README.md
```

---

## 🗄️ Database Schemas

### Supabase (PostgreSQL) — Grievances & Citizens

```sql
CREATE TABLE citizens (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number            VARCHAR(15) UNIQUE NOT NULL,
    preferred_language      VARCHAR(10) DEFAULT 'en',
    conversation_state      TEXT DEFAULT 'idle',
    selected_category_id    UUID,
    selected_subcategory_id UUID,
    pending_location_lat    DOUBLE PRECISION,
    pending_location_lon    DOUBLE PRECISION,
    created_at              TIMESTAMP DEFAULT NOW()
);

CREATE TABLE complaint_categories (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name TEXT NOT NULL,
    label_en TEXT, label_hi TEXT, label_mr TEXT, label_gu TEXT, label_kn TEXT
);

CREATE TABLE complaint_subcategories (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id      UUID REFERENCES complaint_categories(id),
    subcategory_name TEXT NOT NULL,
    label_en TEXT, label_hi TEXT, label_mr TEXT, label_gu TEXT, label_kn TEXT
);

CREATE TABLE citizen_complaints (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id           UUID REFERENCES citizens(id),
    phone_number         VARCHAR(15),
    raw_message          TEXT,
    language             TEXT,           -- AI-detected (analytics)
    citizen_language     TEXT,           -- User's selected language (replies)
    complaint_category   TEXT,
    complaint_subcategory TEXT,
    category_id          UUID REFERENCES complaint_categories(id),
    subcategory_id       UUID REFERENCES complaint_subcategories(id),
    location_text        TEXT,
    latitude             DOUBLE PRECISION,
    longitude            DOUBLE PRECISION,
    department           TEXT,
    severity             TEXT,           -- low | medium | high | critical
    ai_confidence        FLOAT,
    ai_summary           TEXT,
    image_media_id       TEXT,
    status               TEXT DEFAULT 'pending',
    message_id           TEXT UNIQUE,    -- idempotency guard
    created_at           TIMESTAMP DEFAULT NOW()
);

CREATE TABLE complaint_updates (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID REFERENCES citizen_complaints(id),
    update_type  TEXT,
    update_message TEXT,
    created_at   TIMESTAMP DEFAULT NOW()
);
```

### AWS DynamoDB — Session State & Deduplication

```json
// netaai_sessions  (PK: phone_number)
{
  "phone_number": "919876543210",
  "state": "SCHEME_RESULTS",
  "lang": "hi",
  "scheme_profile": {
    "occupation": "1",
    "age": 36,
    "income_bracket": 2,
    "gender": "1",
    "has_aadhaar_bank": true,
    "has_land": true
  },
  "scheme_results": ["PM-KISAN", "PMFBY", "PMJJBY"]
}

// netaai_message_ids  (PK: message_id, TTL: 24h auto-expiry)
{
  "message_id": "wamid.xxx",
  "ttl": 1741612800
}
```

---

## 🌍 Multilingual Support

| # | Language | Script | Polly Engine |
|---|---|---|---|
| 1 | English | Latin | Kajal Neural |
| 2 | हिंदी (Hindi) | Devanagari | Kajal Neural |
| 3 | বাংলা (Bengali) | Bengali | Kajal Standard |
| 4 | मराठी (Marathi) | Devanagari | Kajal Standard |
| 5 | తెలుగు (Telugu) | Telugu | Kajal Neural |
| 6 | தமிழ் (Tamil) | Tamil | Kajal Neural |
| 7 | ગુજરાતી (Gujarati) | Gujarati | Kajal Standard |
| 8 | ಕನ್ನಡ (Kannada) | Kannada | Kajal Standard |

Every menu, prompt, error message, and scheme detail is pre-translated in `responses.py`. Language is persisted per user in DynamoDB so every conversation continues in their preferred language.

---

## 🏛️ Government Schemes Covered

| # | Code | Full Name | Key Benefit |
|---|---|---|---|
| 1 | PM-KISAN | Pradhan Mantri Kisan Samman Nidhi | ₹9,000/year |
| 2 | PMFBY | Pradhan Mantri Fasal Bima Yojana | Crop insurance |
| 3 | PMJJBY | Pradhan Mantri Jeevan Jyoti Bima Yojana | ₹2L life cover |
| 4 | PMSBY | Pradhan Mantri Suraksha Bima Yojana | ₹2L accident cover |
| 5 | PMJAY | Ayushman Bharat PM-JAY | ₹5L health/family/year |
| 6 | PMUY | Pradhan Mantri Ujjwala Yojana | Free LPG connection |
| 7 | PMAY-G | PM Awas Yojana Gramin | ₹1.2L housing grant |
| 8 | SSY | Sukanya Samriddhi Yojana | 8.2% interest (girls) |
| 9 | PMMY | Pradhan Mantri Mudra Yojana | Loan up to ₹20L |
| 10 | NSP | National Scholarship Portal | Education scholarships |

**80 total posters** in S3 (10 schemes × 8 languages). Every scheme detail delivers: text + Polly audio + language-matched poster image.

---

## 🚀 Getting Started

### Prerequisites
- AWS Account (ap-south-1 / Mumbai region)
- Meta WhatsApp Business API access
- Supabase project
- Node.js 18+, Python 3.11+

### Frontend Setup

```bash
git clone https://github.com/WantedChip/aiforbharat.git
cd aiforbharat
npm install
cp .env.example .env.local
# Fill in env vars
npm run dev
# Open http://localhost:3000
```

### Backend — Lambda Deployment

```bash
# Deploy bot processor
cd backend/netaai-bot-processor
zip -r package.zip lambda_function.py responses.py
aws lambda create-function \
  --function-name netaai-bot-processor \
  --runtime python3.11 \
  --zip-file fileb://package.zip \
  --handler lambda_function.lambda_handler \
  --timeout 30

# Deploy complaint lambda
cd ../neta_complaint_lambda
zip -r package.zip lambda_function.py
aws lambda create-function \
  --function-name neta_complaint_lambda \
  --runtime python3.11 \
  --zip-file fileb://package.zip \
  --handler lambda_function.lambda_handler \
  --timeout 30
```

---

## 🛡️ Key Engineering Decisions

**Why WhatsApp first?**
500M+ Indian users. No app download. Works on 2G. Voice messages natively supported. This is how rural India already communicates daily.

**Why Two Lambdas for the bot?**
WhatsApp retries if it doesn't receive 200 OK within 5 seconds. Lambda 1 returns instantly and deduplicates with an atomic DynamoDB conditional write (no race conditions). Lambda 2 processes without any timeout pressure.

**Why DynamoDB + Supabase together?**
DynamoDB for WhatsApp session state — sub-millisecond reads keep the conversation responsive. Supabase for grievances — relational integrity, `JOIN` queries for the admin dashboard, and future PostGIS geospatial support for clustering complaints by area.

**Why Polly over Transcribe for v1?**
Voice output is immediately impactful for low-literacy users — every scheme result is read aloud in their language. Voice input (Transcribe) is fully architected and slated for Phase 2.

**Why Bedrock for grievance classification?**
A pothole reported as "sadak pe gadha ho gaya" in Bhojpuri cannot be keyword-matched. Semantic AI (Claude Haiku via Bedrock) is the only approach that works across India's 22 official languages and hundreds of dialects.

---

## 🗺️ Roadmap

- [x] WhatsApp bot with 8-language support
- [x] Scheme eligibility interviewer (5-question adaptive flow)
- [x] AWS Polly neural voice responses
- [x] S3 scheme poster delivery (80 images)
- [x] Civic grievance reporting with Bedrock AI classification
- [x] Complaint lifecycle tracking by ID
- [x] Web portal with scheme discovery
- [x] Admin dashboard with grievance analytics
- [ ] AWS Transcribe for inbound voice messages
- [ ] Proactive WhatsApp Channel broadcasts
- [ ] State-level scheme support (1000+ schemes)
- [ ] PostGIS geospatial grievance clustering
- [ ] Offline-first Progressive Web App

---

## 👨‍💻 Team BEER BROS

**Abhiroop Hiremath** — Team Lead | AI for Bharat Hackathon 2026

---

## 📄 License

MIT License

---

<p align="center">
  Built with ❤️ for Bharat &nbsp;|&nbsp;
  <a href="https://main.d1hh4kyma0kn0.amplifyapp.com/">Live Demo</a> &nbsp;|&nbsp;
  <a href="https://wa.me/919653233733?text=Hi">Try the Bot on WhatsApp</a>
</p>
