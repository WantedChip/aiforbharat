export const CATEGORIES = [
    "Roads & Infrastructure",
    "Water & Sanitation",
    "Electricity",
    "Education",
    "Healthcare",
    "Garbage & Cleanliness",
    "Public Safety",
    "Other",
];

export const LANGUAGES = [
    { code: "hi", label: "हिंदी", name: "Hindi" },
    { code: "en", label: "English", name: "English" },
    { code: "bn", label: "বাংলা", name: "Bengali" },
    { code: "mr", label: "मराठी", name: "Marathi" },
    { code: "te", label: "తెలుగు", name: "Telugu" },
    { code: "ta", label: "தமிழ்", name: "Tamil" }
];

export const AWS_SERVICES = [
    { name: "Amazon Transcribe", description: "Speech-to-Text in 15+ Indian languages", icon: "🎙️" },
    { name: "Amazon Bedrock", description: "AI-powered scheme matching & analysis", icon: "🧠" },
    { name: "Amazon Polly", description: "Text-to-Speech voice responses", icon: "🔊" },
    { name: "AWS Lambda + DynamoDB", description: "Serverless backend & data storage", icon: "⚡" },
    { name: "Amazon Cognito", description: "Secure OTP authentication", icon: "🔐" },
    { name: "Amazon S3", description: "Photo & document storage", icon: "📦" },
];

export const FEATURES = [
    {
        title: "Multilingual Voice",
        description: "Speak in Hindi, Tamil, Telugu, or any Indian language — we understand",
        icon: "🎤",
    },
    {
        title: "Scheme Eligibility",
        description: "AI-powered matching to 100+ government schemes instantly",
        icon: "🎯",
    },
    {
        title: "Grievance Tracking",
        description: "Real-time status updates from submission to resolution",
        icon: "📊",
    },
    {
        title: "AI Interview Bot",
        description: "Conversational follow-up questions for accurate information",
        icon: "🤖",
    },
    {
        title: "Photo Upload",
        description: "Attach photos of issues directly via WhatsApp or web",
        icon: "📸",
    },
    {
        title: "Real-time Status",
        description: "Track your grievance journey with live timeline updates",
        icon: "⚡",
    },
];

export const HERO_STATS = [
    { value: "535.8M", label: "WhatsApp Users" },
    { value: "7B+", label: "Daily Voice Messages" },
    { value: "15+", label: "Languages" },
    { value: "100+", label: "Schemes" },
];

export const WHATSAPP_FLOW_STEPS = [
    "Open WhatsApp → Message Neta-ji Bot",
    "Send voice message in your language",
    "AWS Transcribe converts speech to text",
    "AI understands intent (scheme/grievance)",
    "Asks follow-up questions if needed",
    "Returns personalized results with voice reply",
    "Track status via WhatsApp notifications",
];

export const WEB_FLOW_STEPS = [
    "Visit Civic Connect web portal",
    "Login with OTP (AWS Cognito)",
    "Choose: Find Schemes or Report Grievance",
    "Fill form with voice/text + photo upload",
    "AI processes with AWS Bedrock",
    "Get instant results & tracking ID",
    "Monitor real-time status on dashboard",
];
