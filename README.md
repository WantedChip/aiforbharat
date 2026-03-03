# 🏛️ Neta-ji | Civic Connect
**Sarkar Ki Schemes, Aapki Awaaz Mein**

**Team: BEER BROS | AI for Bharat Hackathon | Powered by AWS**

---

## 🌟 Overview

**Neta-ji | Civic Connect** is a next-generation civic engagement platform designed to bridge the gap between Indian citizens and government services. Built for the **AI for Bharat Hackathon**, it leverages AWS AI services to provide a voice-first, multilingual experience that is accessible to everyone, regardless of their tech-literacy or language.

### 🚀 Key Features

- **🎙️ Voice-First WhatsApp Bot**: A high-fidelity simulator showing how citizens can interact with the government using voice messages in their native language (Hindi, Tamil, Telugu, etc.).
- **🎯 Scheme Discovery (Feature A)**: An AI-powered eligibility checker that matches users to 100+ government schemes based on their profile (Occupation, Age, Income).
- **📋 Grievance Portal (Feature B)**: A streamlined interface to report local issues (Water, Roads, Electricity) with photo uploads and GPS location tagging.
- **📊 Real-time Tracking**: A comprehensive user dashboard to monitor the status of grievances from "Submitted" to "Resolved".
- **👨‍💼 Admin Analytics**: A powerful dashboard for officials to track regional grievance trends, resolution rates, and system performance via Recharts.
- **🔐 Secure Login**: Simulated AWS Cognito OTP authentication for secure access.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: DM Sans (Sans) + IBM Plex Mono (Mono)
- **AI/Backend (Simulated)**: 
  - **AWS Transcribe**: Multilingual Speech-to-Text
  - **AWS Bedrock**: LLM-powered intent analysis & scheme matching
  - **AWS Polly**: Text-to-Speech responses
  - **AWS Lambda & DynamoDB**: Serverless logic and storage
  - **AWS Cognito**: Secure Authentication

---

## 📁 Project Structure

```bash
src/
├── app/
│   ├── page.tsx               # Hero Landing Page + WhatsApp Simulator
│   ├── login/                 # OTP Login Flow (Simulated Cognito)
│   ├── dashboard/             # User Grievance & Scheme Dashboard
│   ├── report/                # Grievance Submission Form + AI Overlay
│   ├── schemes/               # Scheme Discovery & Voice Demo
│   ├── admin/                 # Admin Analytics & Management
│   └── layout.tsx             # Root layout with fonts & metadata
├── components/
│   ├── WhatsAppSimulator.tsx  # Animated WhatsApp chat demo (Internal Scroll)
│   ├── VoiceDemo.tsx          # Mic -> Waveform -> Transcribe demo
│   ├── AIProcessingOverlay.tsx # Sequential AI animation overlay
│   ├── AnalyticsChart.tsx     # Recharts Bar & Pie components
│   ├── StatusTimeline.tsx     # 5-step progress tracker
│   └── ...                    # Navbar, Footer, Cards, Badges
├── lib/
│   ├── mockData.ts            # Pre-seeded demo data (Grievances, Schemes)
│   ├── constants.ts           # Categories, Languages, AWS metadata
│   └── utils.ts               # Tailwind-merge utility
└── globals.css                # Custom theme & CSS animations
```

---

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository**:
    ```bash
    # (Assuming the files are in the current workspace)
    cd neta-ji
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🎯 Demo Highlights

1.  **Any Phone Number + Any 6-digit OTP**: Successfully logs you into the dashboard.
2.  **GPS Simulation**: In the `/report` page, clicking **"Use My Location"** simulates high-accuracy GPS retrieval.
3.  **AI Processing**: Submitting a grievance triggers a sequential animation representing the AWS backend workflow (S3 -> Bedrock -> Lambda -> DynamoDB).
4.  **Internal Scrolling**: The WhatsApp simulator is optimized for landing page scrolling, ensuring the page content remains accessible while the chat auto-plays.

---

**Built with ❤️ for Bharat.**
**Team BEER BROS | 2026 AI for Bharat Hackathon**
