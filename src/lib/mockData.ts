export const MOCK_GRIEVANCES = [
  {
    id: "GRV-2024-1234",
    title: "Water supply disruption",
    category: "Water & Sanitation",
    description: "No water supply for 3 days in Sector 4, affecting 200+ households",
    location: "Sector 4, Lucknow, Uttar Pradesh",
    status: "Resolved",
    date: "2024-01-15",
    lastUpdate: "2024-01-20",
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
    id: "GRV-2024-1235",
    title: "Road repair needed urgently",
    category: "Roads & Infrastructure",
    description: "Large pothole on Main Market Road causing accidents daily",
    location: "Main Market Road, Lucknow, UP",
    status: "In Progress",
    date: "2024-01-18",
    lastUpdate: "2024-01-21",
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
    id: "GRV-2024-1236",
    title: "Street lights not working",
    category: "Electricity",
    description: "Street lights on Gandhi Nagar Colony have been off for over a week",
    location: "Gandhi Nagar, Lucknow, UP",
    status: "Pending",
    date: "2024-01-22",
    lastUpdate: "2024-01-22",
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
    id: "GRV-2024-1237",
    title: "Garbage not collected",
    category: "Sanitation",
    description: "Garbage not collected for 5 days near Bus Stand area, causing health hazard",
    location: "Bus Stand Area, Lucknow, UP",
    status: "Pending",
    date: "2024-01-23",
    lastUpdate: "2024-01-23",
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
    id: "GRV-2024-1238",
    title: "School building roof damage",
    category: "Education",
    description: "Govt primary school roof leaking badly, children unable to study during rain",
    location: "Primary School No. 5, Lucknow, UP",
    status: "In Progress",
    date: "2024-01-20",
    lastUpdate: "2024-01-24",
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
    id: "GRV-2024-1239",
    title: "Sewage overflow on main road",
    category: "Water & Sanitation",
    description: "Drainage pipe burst causing sewage overflow near Hazratganj market for 2 days",
    location: "Hazratganj, Lucknow, UP",
    status: "Resolved",
    date: "2024-01-10",
    lastUpdate: "2024-01-13",
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
    id: "GRV-2024-1240",
    title: "Public hospital medicine shortage",
    category: "Healthcare",
    description: "District hospital running out of basic medicines like paracetamol and antibiotics",
    location: "District Hospital, Lucknow, UP",
    status: "In Progress",
    date: "2024-01-21",
    lastUpdate: "2024-01-25",
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
    id: "GRV-2024-1241",
    title: "Tree fallen blocking road",
    category: "Roads & Infrastructure",
    description: "Large tree fell on Vikas Nagar road after storm, blocking entire lane since morning",
    location: "Vikas Nagar, Lucknow, UP",
    status: "Resolved",
    date: "2024-01-19",
    lastUpdate: "2024-01-19",
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
    id: "GRV-2024-1242",
    title: "Public toilet non-functional",
    category: "Sanitation",
    description: "Swachh Bharat public toilet at Railway Station has been locked and non-functional for 2 weeks",
    location: "Lucknow Railway Station, UP",
    status: "Pending",
    date: "2024-01-24",
    lastUpdate: "2024-01-24",
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
    id: "GRV-2024-1243",
    title: "Illegal construction blocking public lane",
    category: "Other",
    description: "Neighbour has illegally extended boundary wall blocking the public footpath completely",
    location: "Indira Nagar, Lucknow, UP",
    status: "In Progress",
    date: "2024-01-17",
    lastUpdate: "2024-01-23",
    assignedTo: "Town Planning Dept",
    timeline: [
      { step: "Submitted", done: true, date: "Jan 17" },
      { step: "Received", done: true, date: "Jan 17" },
      { step: "Assigned", done: true, date: "Jan 18" },
      { step: "In Progress", done: true, date: "Jan 23" },
      { step: "Resolved", done: false, date: "" }
    ]
  }
];

export const MOCK_SCHEMES = [
  {
    id: 1,
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    benefit: "₹6,000/year",
    category: "Agriculture",
    eligibility: ["Farmer", "Land owner", "Aadhaar linked bank account"],
    documents: ["Aadhaar Card", "Land ownership papers", "Bank account details"],
    eligible: true,
    description: "Direct income support of ₹6,000/year in 3 installments to farmer families"
  },
  {
    id: 2,
    name: "PMJJBY",
    fullName: "Pradhan Mantri Jeevan Jyoti Bima Yojana",
    benefit: "₹2 Lakh life cover",
    category: "Insurance",
    eligibility: ["Age 18-50", "Bank account holder", "Aadhaar linked"],
    documents: ["Aadhaar Card", "Bank passbook", "Nominee details"],
    eligible: true,
    description: "Life insurance cover of ₹2 lakh at just ₹436/year premium"
  },
  {
    id: 3,
    name: "Ayushman Bharat",
    fullName: "Pradhan Mantri Jan Arogya Yojana",
    benefit: "₹5 Lakh health cover",
    category: "Health",
    eligibility: ["Below poverty line", "SECC database listed", "No private insurance"],
    documents: ["Aadhaar Card", "Ration Card", "Income certificate"],
    eligible: true,
    description: "Cashless health insurance of ₹5 lakh per family per year at empanelled hospitals"
  },
  {
    id: 4,
    name: "PMSBY",
    fullName: "Pradhan Mantri Suraksha Bima Yojana",
    benefit: "₹2 Lakh accident cover",
    category: "Insurance",
    eligibility: ["Age 18-70", "Savings bank account", "Aadhaar linked"],
    documents: ["Aadhaar Card", "Bank account details"],
    eligible: false,
    description: "Accidental death and disability cover for just ₹20/year premium"
  },
  {
    id: 5,
    name: "PM Ujjwala",
    fullName: "Pradhan Mantri Ujjwala Yojana",
    benefit: "Free LPG connection",
    category: "Energy",
    eligibility: ["BPL household", "Adult woman member", "No existing LPG connection"],
    documents: ["Aadhaar Card", "BPL Ration Card", "Bank account details"],
    eligible: true,
    description: "Free LPG gas connection to women from below poverty line households"
  },
  {
    id: 6,
    name: "PM Awas Yojana",
    fullName: "Pradhan Mantri Awas Yojana (Gramin)",
    benefit: "₹1.2 Lakh housing grant",
    category: "Housing",
    eligibility: ["Homeless or kutcha house", "Rural resident", "Not availed housing scheme before"],
    documents: ["Aadhaar Card", "Ration Card", "Land documents", "Bank account"],
    eligible: false,
    description: "Financial assistance of ₹1.2 lakh to build a pucca house in rural areas"
  },
  {
    id: 7,
    name: "Sukanya Samriddhi",
    fullName: "Sukanya Samriddhi Yojana",
    benefit: "8.2% interest rate",
    category: "Savings",
    eligibility: ["Girl child below 10 years", "Parent/guardian account", "Indian resident"],
    documents: ["Girl child birth certificate", "Parent Aadhaar", "Address proof"],
    eligible: false,
    description: "High-interest savings scheme for girl child's education and marriage expenses"
  },
  {
    id: 8,
    name: "PM Mudra Yojana",
    fullName: "Pradhan Mantri Mudra Yojana",
    benefit: "Loan up to ₹10 Lakh",
    category: "Business",
    eligibility: ["Non-farm small business", "No existing loan default", "Valid business plan"],
    documents: ["Aadhaar Card", "Business proof", "Bank statements", "PAN Card"],
    eligible: true,
    description: "Collateral-free loans from ₹50,000 to ₹10 lakh for small and micro enterprises"
  },
  {
    id: 9,
    name: "PM Fasal Bima",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    benefit: "Crop loss compensation",
    category: "Agriculture",
    eligibility: ["Farmer with crop loan", "Land owner or tenant farmer", "Enrolled before sowing"],
    documents: ["Aadhaar Card", "Land records", "Bank account", "Crop sowing certificate"],
    eligible: true,
    description: "Crop insurance covering losses due to natural calamities, pests and diseases"
  },
  {
    id: 10,
    name: "NSP Scholarship",
    fullName: "National Scholarship Portal — Pre-Matric & Post-Matric",
    benefit: "₹500–₹1,200/month",
    category: "Education",
    eligibility: ["SC/ST/OBC student", "Family income below ₹2.5 lakh/year", "Enrolled in govt school/college"],
    documents: ["Aadhaar Card", "Income certificate", "Caste certificate", "Marksheet", "Bank account"],
    eligible: false,
    description: "Monthly stipend for SC/ST/OBC students from pre-matric through post-matric education"
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
