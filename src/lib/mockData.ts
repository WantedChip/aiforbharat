export const MOCK_GRIEVANCES = [
  {
    id: "GRV-2026-1234",
    title: "Water supply disruption",
    category: "Water & Sanitation",
    description: "No water supply for 3 days in Sector 4, affecting 200+ households",
    location: "Sector 4, Lucknow, Uttar Pradesh",
    status: "Resolved",
    date: "2026-01-15",
    lastUpdate: "2026-01-20",
    assignedTo: "Municipal Corporation",
    timeline: [
      { step: "Submitted", done: true, date: "Jan 15" },
      { step: "Received", done: true, date: "Jan 15" },
      { step: "Assigned", done: true, date: "Jan 16" },
      { step: "In Progress", done: true, date: "Jan 18" },
      { step: "Resolved", done: true, date: "Jan 20" }
    ]
  },
  {
    id: "GRV-2026-1235",
    title: "Road repair needed urgently",
    category: "Roads & Infrastructure",
    description: "Large pothole on Main Market Road causing accidents daily",
    location: "Main Market Road, Lucknow, UP",
    status: "In Progress",
    date: "2026-01-18",
    lastUpdate: "2026-01-21",
    assignedTo: "PWD Department",
    timeline: [
      { step: "Submitted", done: true, date: "Jan 18" },
      { step: "Received", done: true, date: "Jan 18" },
      { step: "Assigned", done: true, date: "Jan 19" },
      { step: "In Progress", done: true, date: "Jan 21" },
      { step: "Resolved", done: false, date: "" }
    ]
  },
  {
    id: "GRV-2026-1236",
    title: "Street lights not working",
    category: "Electricity",
    description: "Street lights on Gandhi Nagar Colony have been off for over a week",
    location: "Gandhi Nagar, Lucknow, UP",
    status: "Pending",
    date: "2026-01-22",
    lastUpdate: "2026-01-22",
    assignedTo: "Pending Assignment",
    timeline: [
      { step: "Submitted", done: true, date: "Jan 22" },
      { step: "Received", done: true, date: "Jan 22" },
      { step: "Assigned", done: false, date: "" },
      { step: "In Progress", done: false, date: "" },
      { step: "Resolved", done: false, date: "" }
    ]
  },
  {
    id: "GRV-2026-1237",
    title: "Garbage not collected",
    category: "Sanitation",
    description: "Garbage not collected for 5 days near Bus Stand area, causing health hazard",
    location: "Bus Stand Area, Lucknow, UP",
    status: "Pending",
    date: "2026-01-23",
    lastUpdate: "2026-01-23",
    assignedTo: "Pending Assignment",
    timeline: [
      { step: "Submitted", done: true, date: "Jan 23" },
      { step: "Received", done: false, date: "" },
      { step: "Assigned", done: false, date: "" },
      { step: "In Progress", done: false, date: "" },
      { step: "Resolved", done: false, date: "" }
    ]
  },
  {
    id: "GRV-2026-1238",
    title: "School building roof damage",
    category: "Education",
    description: "Govt primary school roof leaking badly, children unable to study during rain",
    location: "Primary School No. 5, Lucknow, UP",
    status: "In Progress",
    date: "2026-01-20",
    lastUpdate: "2026-01-24",
    assignedTo: "Education Department",
    timeline: [
      { step: "Submitted", done: true, date: "Jan 20" },
      { step: "Received", done: true, date: "Jan 20" },
      { step: "Assigned", done: true, date: "Jan 21" },
      { step: "In Progress", done: true, date: "Jan 24" },
      { step: "Resolved", done: false, date: "" }
    ]
  },
  {
    id: "GRV-2026-1239",
    title: "Sewage overflow on main road",
    category: "Water & Sanitation",
    description: "Drainage pipe burst causing sewage overflow near Hazratganj market for 2 days",
    location: "Hazratganj, Lucknow, UP",
    status: "Resolved",
    date: "2026-01-10",
    lastUpdate: "2026-01-13",
    assignedTo: "Jal Nigam",
    timeline: [
      { step: "Submitted", done: true, date: "Jan 10" },
      { step: "Received", done: true, date: "Jan 10" },
      { step: "Assigned", done: true, date: "Jan 11" },
      { step: "In Progress", done: true, date: "Jan 11" },
      { step: "Resolved", done: true, date: "Jan 13" }
    ]
  },
  {
    id: "GRV-2026-1240",
    title: "Public hospital medicine shortage",
    category: "Healthcare",
    description: "District hospital running out of basic medicines like paracetamol and antibiotics",
    location: "District Hospital, Lucknow, UP",
    status: "In Progress",
    date: "2026-01-21",
    lastUpdate: "2026-01-25",
    assignedTo: "Health Department",
    timeline: [
      { step: "Submitted", done: true, date: "Jan 21" },
      { step: "Received", done: true, date: "Jan 21" },
      { step: "Assigned", done: true, date: "Jan 22" },
      { step: "In Progress", done: true, date: "Jan 25" },
      { step: "Resolved", done: false, date: "" }
    ]
  },
  {
    id: "GRV-2026-1241",
    title: "Tree fallen blocking road",
    category: "Roads & Infrastructure",
    description: "Large tree fell on Vikas Nagar road after storm, blocking entire lane since morning",
    location: "Vikas Nagar, Lucknow, UP",
    status: "Resolved",
    date: "2026-01-19",
    lastUpdate: "2026-01-19",
    assignedTo: "Municipal Corporation",
    timeline: [
      { step: "Submitted", done: true, date: "Jan 19" },
      { step: "Received", done: true, date: "Jan 19" },
      { step: "Assigned", done: true, date: "Jan 19" },
      { step: "In Progress", done: true, date: "Jan 19" },
      { step: "Resolved", done: true, date: "Jan 19" }
    ]
  },
  {
    id: "GRV-2026-1242",
    title: "Public toilet non-functional",
    category: "Sanitation",
    description: "Swachh Bharat public toilet at Railway Station has been locked and non-functional for 2 weeks",
    location: "Lucknow Railway Station, UP",
    status: "Pending",
    date: "2026-01-24",
    lastUpdate: "2026-01-24",
    assignedTo: "Pending Assignment",
    timeline: [
      { step: "Submitted", done: true, date: "Jan 24" },
      { step: "Received", done: false, date: "" },
      { step: "Assigned", done: false, date: "" },
      { step: "In Progress", done: false, date: "" },
      { step: "Resolved", done: false, date: "" }
    ]
  },
  {
    id: "GRV-2026-1243",
    title: "Illegal construction blocking public lane",
    category: "Other",
    description: "Neighbour has illegally extended boundary wall blocking the public footpath completely",
    location: "Indira Nagar, Lucknow, UP",
    status: "In Progress",
    date: "2026-01-17",
    lastUpdate: "2026-01-23",
    assignedTo: "Town Planning Dept",
    timeline: [
      { step: "Submitted", done: true, date: "Jan 17" },
      { step: "Received", done: true, date: "Jan 17" },
      { step: "Assigned", done: true, date: "Jan 18" },
      { step: "In Progress", done: true, date: "Jan 23" },
      { step: "Resolved", done: false, date: "" }
    ]
  },
  {
    id: "GRV-2026-1244",
    title: "Water logging in society",
    category: "Water & Sanitation",
    description: "Heavy water logging in society premises after mild rain",
    location: "Navrangpura, Ahmedabad, Gujarat",
    status: "Pending",
    date: "2026-02-10",
    lastUpdate: "2026-02-10",
    assignedTo: "Pending Assignment",
    timeline: [
      { step: "Submitted", done: true, date: "Feb 10" },
      { step: "Received", done: false, date: "" },
      { step: "Assigned", done: false, date: "" },
      { step: "In Progress", done: false, date: "" },
      { step: "Resolved", done: false, date: "" }
    ]
  },
  {
    id: "GRV-2026-1245",
    title: "Potholes on ring road",
    category: "Roads & Infrastructure",
    description: "Multiple dangerous potholes appearing on the outer ring road",
    location: "Koramangala, Bengaluru, Karnataka",
    status: "In Progress",
    date: "2026-02-12",
    lastUpdate: "2026-02-14",
    assignedTo: "BBMP",
    timeline: [
      { step: "Submitted", done: true, date: "Feb 12" },
      { step: "Received", done: true, date: "Feb 12" },
      { step: "Assigned", done: true, date: "Feb 13" },
      { step: "In Progress", done: true, date: "Feb 14" },
      { step: "Resolved", done: false, date: "" }
    ]
  }
];

export const MOCK_SCHEMES = [
  {
    "scheme_id": "SCH_001",
    "scheme_name": "PM-KISAN",
    "full_name": "Pradhan Mantri Kisan Samman Nidhi",
    "launch_year": "2019",
    "ministry_or_department": "Ministry of Agriculture and Farmers Welfare",
    "category": "Agriculture",
    "objective": "Provide direct income support to landholding farmers to help with agricultural expenses and reduce reliance on informal credit.",
    "benefits": "Direct income transfer to farmers through DBT.",
    "benefit_amount": "₹9,000 per year paid in three installments",
    "eligibility": {
      "age_requirement": "18+",
      "income_requirement": "Income tax payers are excluded",
      "occupation_requirement": "Landholding farmers",
      "gender_requirement": "All",
      "other_conditions": "Farmer must own cultivable land and complete Aadhaar e-KYC"
    },
    "documents_required": [
      "Aadhaar Card",
      "Land ownership records",
      "Bank account linked with Aadhaar",
      "Mobile number for OTP verification"
    ],
    "application_process": "Farmers register through the PM-KISAN portal, mobile app, CSC centres, or state agriculture departments.",
    "where_to_apply": "PM-KISAN Portal, CSC Centres, State Agriculture Offices",
    "official_website": "https://pmkisan.gov.in",
    "processing_time": "30–60 days after verification",
    "important_notes": "e-KYC is mandatory. Ineligible beneficiaries such as income tax payers are removed and recovery is initiated.",
    "common_rejection_reasons": [
      "Aadhaar authentication failure",
      "Mismatch in land records",
      "Incomplete e-KYC",
      "Bank account not NPCI mapped"
    ],
    "keywords_for_search": [
      "pm kisan",
      "farmer income scheme",
      "6000 farmer scheme",
      "kisan yojana",
      "farmer subsidy",
      "agriculture income support"
    ],
    "eligible": true
  },
  {
    "scheme_id": "SCH_002",
    "scheme_name": "PMFBY",
    "full_name": "Pradhan Mantri Fasal Bima Yojana",
    "launch_year": "2016",
    "ministry_or_department": "Ministry of Agriculture and Farmers Welfare",
    "category": "Insurance",
    "objective": "Provide crop insurance to farmers against losses due to natural calamities, pests, and diseases.",
    "benefits": "Insurance coverage for crop losses including prevented sowing, yield losses, and post-harvest damage.",
    "benefit_amount": "Variable based on crop insured",
    "eligibility": {
      "age_requirement": "18+",
      "income_requirement": "No limit",
      "occupation_requirement": "Farmers cultivating notified crops",
      "gender_requirement": "All",
      "other_conditions": "Must have insurable interest in crop and land records"
    },
    "documents_required": [
      "Aadhaar Card",
      "Land records",
      "Bank account details",
      "Sowing declaration or crop details"
    ],
    "application_process": "Farmers enroll via banks while taking crop loans, through PMFBY portal, or CSC centers.",
    "where_to_apply": "Banks, CSCs, PMFBY portal",
    "official_website": "https://pmfby.gov.in",
    "processing_time": "45–60 days after crop loss verification",
    "important_notes": "Farmers must report localized crop loss within 72 hours.",
    "common_rejection_reasons": [
      "Late claim reporting",
      "Land record mismatch",
      "No sowing declaration",
      "Application after cut-off date"
    ],
    "keywords_for_search": [
      "crop insurance",
      "fasal bima",
      "farm damage compensation",
      "crop loss scheme",
      "weather crop insurance"
    ],
    "eligible": true
  },
  {
    "scheme_id": "SCH_003",
    "scheme_name": "PMJJBY",
    "full_name": "Pradhan Mantri Jeevan Jyoti Bima Yojana",
    "launch_year": "2015",
    "ministry_or_department": "Ministry of Finance",
    "category": "Insurance",
    "objective": "Provide affordable life insurance cover to low-income citizens.",
    "benefits": "₹2 lakh life insurance payout to nominee upon death.",
    "benefit_amount": "₹2,00,000",
    "eligibility": {
      "age_requirement": "18–50 years",
      "income_requirement": "No limit",
      "occupation_requirement": "None",
      "gender_requirement": "All",
      "other_conditions": "Must have bank account with auto debit facility"
    },
    "documents_required": [
      "Aadhaar Card",
      "Bank account",
      "Nominee details"
    ],
    "application_process": "Enroll through bank branch or net banking by giving consent for auto debit.",
    "where_to_apply": "Banks or Post Offices",
    "official_website": "https://financialservices.gov.in",
    "processing_time": "30–60 days claim settlement",
    "important_notes": "30 day waiting period for non accidental death claims.",
    "common_rejection_reasons": [
      "Insufficient bank balance",
      "Death within waiting period",
      "Missing nominee details"
    ],
    "keywords_for_search": [
      "life insurance government",
      "pmjjby",
      "436 insurance scheme",
      "2 lakh life insurance"
    ],
    "eligible": true
  },
  {
    "scheme_id": "SCH_004",
    "scheme_name": "PMSBY",
    "full_name": "Pradhan Mantri Suraksha Bima Yojana",
    "launch_year": "2015",
    "ministry_or_department": "Ministry of Finance",
    "category": "Insurance",
    "objective": "Provide accidental death and disability insurance at very low cost.",
    "benefits": "₹2 lakh accidental death or disability cover.",
    "benefit_amount": "₹2,00,000",
    "eligibility": {
      "age_requirement": "18–70 years",
      "income_requirement": "None",
      "occupation_requirement": "None",
      "gender_requirement": "All",
      "other_conditions": "Must have savings bank account"
    },
    "documents_required": [
      "Aadhaar Card",
      "Bank account details"
    ],
    "application_process": "Enrollment through banks or net banking with auto debit consent.",
    "where_to_apply": "Banks and Post Offices",
    "official_website": "https://financialservices.gov.in",
    "processing_time": "30–60 days",
    "important_notes": "Annual premium ₹20 auto-debited from account.",
    "common_rejection_reasons": [
      "No FIR for accident",
      "Auto debit failure",
      "Disability not permanent"
    ],
    "keywords_for_search": [
      "accident insurance",
      "pmsby",
      "20 rupee insurance",
      "government accident cover"
    ],
    "eligible": false
  },
  {
    "scheme_id": "SCH_005",
    "scheme_name": "PMJAY",
    "full_name": "Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana",
    "launch_year": "2018",
    "ministry_or_department": "Ministry of Health and Family Welfare",
    "category": "Health",
    "objective": "Provide universal health insurance to economically vulnerable families.",
    "benefits": "Cashless treatment for secondary and tertiary hospitalization.",
    "benefit_amount": "₹5 lakh per family per year",
    "eligibility": {
      "age_requirement": "No limit",
      "income_requirement": "SECC 2011 eligible families",
      "occupation_requirement": "Various vulnerable categories",
      "gender_requirement": "All",
      "other_conditions": "Asset based exclusion criteria apply"
    },
    "documents_required": [
      "Aadhaar Card",
      "Ration Card",
      "Mobile number"
    ],
    "application_process": "Verify eligibility on portal or visit CSC/hospital to generate Ayushman card.",
    "where_to_apply": "Hospitals, CSCs, PMJAY portal",
    "official_website": "https://pmjay.gov.in",
    "processing_time": "Instant card generation",
    "important_notes": "Senior citizens above 70 receive separate ₹5 lakh cover.",
    "common_rejection_reasons": [
      "Not in SECC database",
      "Aadhaar mismatch",
      "Already covered under ESIC/CGHS"
    ],
    "keywords_for_search": [
      "ayushman card",
      "health card",
      "5 lakh treatment scheme",
      "free hospital government"
    ],
    "eligible": true
  },
  {
    "scheme_id": "SCH_006",
    "scheme_name": "PMUY",
    "full_name": "Pradhan Mantri Ujjwala Yojana",
    "launch_year": "2016",
    "ministry_or_department": "Ministry of Petroleum and Natural Gas",
    "category": "Energy",
    "objective": "Promote clean cooking fuel by providing LPG connections to poor households.",
    "benefits": "Free LPG connection and subsidy support.",
    "benefit_amount": "₹1,600 assistance + free stove and first refill",
    "eligibility": {
      "age_requirement": "18+",
      "income_requirement": "BPL households",
      "occupation_requirement": "None",
      "gender_requirement": "Female only",
      "other_conditions": "No existing LPG connection in household"
    },
    "documents_required": [
      "Aadhaar Card",
      "BPL certificate or ration card",
      "Bank account"
    ],
    "application_process": "Apply online or at LPG distributor with KYC form.",
    "where_to_apply": "LPG distributors or PMUY portal",
    "official_website": "https://pmuy.gov.in",
    "processing_time": "15–30 days",
    "important_notes": "Migrants can apply using self declaration.",
    "common_rejection_reasons": [
      "Existing LPG connection",
      "KYC mismatch"
    ],
    "keywords_for_search": [
      "free gas cylinder",
      "ujjwala scheme",
      "gas connection subsidy"
    ],
    "eligible": true
  },
  {
    "scheme_id": "SCH_007",
    "scheme_name": "PMAY-G",
    "full_name": "Pradhan Mantri Awas Yojana – Gramin",
    "launch_year": "2016",
    "ministry_or_department": "Ministry of Rural Development",
    "category": "Housing",
    "objective": "Provide financial assistance to rural households for building pucca houses.",
    "benefits": "Grant support plus wage convergence.",
    "benefit_amount": "₹1.2 lakh plains / ₹1.3 lakh hilly areas",
    "eligibility": {
      "age_requirement": "18+",
      "income_requirement": "Low income households",
      "occupation_requirement": "Manual labour or rural poor",
      "gender_requirement": "All",
      "other_conditions": "Must not own pucca house"
    },
    "documents_required": [
      "Aadhaar Card",
      "SECC verification",
      "Bank account"
    ],
    "application_process": "Beneficiaries selected via SECC list and approved by Gram Sabha.",
    "where_to_apply": "Gram Panchayat",
    "official_website": "https://pmayg.nic.in",
    "processing_time": "6–12 months",
    "important_notes": "Includes MGNREGA wages and toilet subsidy.",
    "common_rejection_reasons": [
      "Already owns pucca house",
      "Income tax payer"
    ],
    "keywords_for_search": [
      "pm awas yojana",
      "rural house scheme",
      "government house subsidy"
    ],
    "eligible": false
  },
  {
    "scheme_id": "SCH_008",
    "scheme_name": "SSY",
    "full_name": "Sukanya Samriddhi Yojana",
    "launch_year": "2015",
    "ministry_or_department": "Ministry of Finance",
    "category": "Savings",
    "objective": "Promote savings for the future education and marriage of girl children.",
    "benefits": "High interest savings account with tax benefits.",
    "benefit_amount": "8.2% interest (FY26)",
    "eligibility": {
      "age_requirement": "Girl child below 10",
      "income_requirement": "None",
      "occupation_requirement": "None",
      "gender_requirement": "Female child",
      "other_conditions": "Maximum two accounts per family"
    },
    "documents_required": [
      "Birth certificate",
      "Parent Aadhaar",
      "Address proof"
    ],
    "application_process": "Open account at bank or post office.",
    "where_to_apply": "Post Office or Bank",
    "official_website": "https://nsiindia.gov.in",
    "processing_time": "Same day",
    "important_notes": "Minimum deposit ₹250 yearly.",
    "common_rejection_reasons": [
      "Child above age limit",
      "Duplicate account"
    ],
    "keywords_for_search": [
      "girl child savings",
      "sukanya scheme",
      "daughter future fund"
    ],
    "eligible": false
  },
  {
    "scheme_id": "SCH_009",
    "scheme_name": "PMMY",
    "full_name": "Pradhan Mantri Mudra Yojana",
    "launch_year": "2015",
    "ministry_or_department": "Ministry of Finance",
    "category": "Business",
    "objective": "Provide collateral free loans to micro businesses.",
    "benefits": "Loans categorized into Shishu, Kishore, Tarun, Tarun Plus.",
    "benefit_amount": "Up to ₹20 lakh",
    "eligibility": {
      "age_requirement": "18+",
      "income_requirement": "Business viability required",
      "occupation_requirement": "Micro entrepreneurs",
      "gender_requirement": "All",
      "other_conditions": "Applicant should not be bank defaulter"
    },
    "documents_required": [
      "Aadhaar Card",
      "PAN Card",
      "Business plan",
      "Bank statements"
    ],
    "application_process": "Apply via banks, NBFCs, or Udyamimitra portal.",
    "where_to_apply": "Banks, NBFCs, Udyamimitra portal",
    "official_website": "https://mudra.org.in",
    "processing_time": "7–30 days",
    "important_notes": "Loans backed by Credit Guarantee Fund for Micro Units.",
    "common_rejection_reasons": [
      "Poor credit score",
      "Incomplete business plan"
    ],
    "keywords_for_search": [
      "mudra loan",
      "small business loan",
      "startup loan government"
    ],
    "eligible": true
  },
  {
    "scheme_id": "SCH_010",
    "scheme_name": "NSP",
    "full_name": "National Scholarship Portal Schemes",
    "launch_year": "2015",
    "ministry_or_department": "Ministry of Electronics and IT",
    "category": "Education",
    "objective": "Provide a unified portal for multiple government scholarship schemes.",
    "benefits": "Financial assistance for education.",
    "benefit_amount": "Varies by scheme",
    "eligibility": {
      "age_requirement": "Student age range",
      "income_requirement": "Usually below ₹2.5 lakh",
      "occupation_requirement": "Student",
      "gender_requirement": "All",
      "other_conditions": "Must complete OTR registration"
    },
    "documents_required": [
      "Aadhaar Card",
      "Income certificate",
      "Marksheet",
      "Bank account"
    ],
    "application_process": "Register on NSP portal using OTR and submit application.",
    "where_to_apply": "https://scholarships.gov.in",
    "official_website": "https://scholarships.gov.in",
    "processing_time": "2–3 months",
    "important_notes": "Face authentication required for OTR.",
    "common_rejection_reasons": [
      "Aadhaar mismatch",
      "Incomplete institute verification"
    ],
    "keywords_for_search": [
      "student scholarship",
      "nsp portal",
      "education scholarship"
    ],
    "eligible": false
  }
];

export const ADMIN_STATS = {
  total: 1234,
  pending: 456,
  inProgress: 312,
  resolved: 778,
  todayNew: 23,
  avgResolutionDays: 4.2,
  categoryBreakdown: [
    { name: "Roads", value: 312, fill: "#22c55e" },
    { name: "Water", value: 278, fill: "#10b981" },
    { name: "Electricity", value: 198, fill: "#059669" },
    { name: "Sanitation", value: 156, fill: "#047857" },
    { name: "Others", value: 290, fill: "#065f46" },
  ],
  monthlyTrend: [
    { month: "Aug", submitted: 89, resolved: 72 },
    { month: "Sep", submitted: 102, resolved: 88 },
    { month: "Oct", submitted: 134, resolved: 98 },
    { month: "Nov", submitted: 118, resolved: 112 },
    { month: "Dec", submitted: 156, resolved: 134 },
    { month: "Jan", submitted: 189, resolved: 145 },
  ],
};

export const WHATSAPP_DEMO_FLOW = [
  { sender: "user", message: "🎤 [Voice message 0:08]", type: "voice", delay: 0 },
  {
    sender: "bot",
    message:
      "Namaste! 🙏 Mujhe aapki awaaz sun ke khushi hui. Main abhi AWS Transcribe se process kar raha hoon...",
    type: "text",
    delay: 1500,
  },
  {
    sender: "bot",
    message: "✅ Samajh gaya! Aap PM-KISAN ke baare mein jaanna chahte hain.",
    type: "text",
    delay: 3000,
  },
  {
    sender: "bot",
    message: "🤔 Quick sawaal: Kya aapke paas apni zameen hai?\n\nHaan | Nahi",
    type: "options",
    delay: 4500,
  },
  { sender: "user", message: "Haan", type: "text", delay: 6000 },
  {
    sender: "bot",
    message:
      "✅ Eligible!\n\n📋 PM-KISAN: ₹6,000/year\n📋 Kisan Credit Card\n\n📄 Documents needed:\n• Aadhaar Card\n• Land papers\n• Bank account\n\n🎤 [Voice reply in Hindi]",
    type: "result",
    delay: 7500,
  },
];
