import Link from "next/link";

export const metadata = {
    title: "Privacy Policy | Neta AI — Civic Connect",
    description:
        "Privacy Policy for Neta AI, a civic‑tech WhatsApp bot that helps Indian citizens discover government schemes and report grievances.",
};

const SECTION_STYLE =
    "mb-10 bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 sm:p-8";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-gray-950 text-gray-200">
            {/* Hero header */}
            <div className="bg-gradient-to-b from-green-900/40 to-gray-950 border-b border-gray-800">
                <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 mb-6 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Last updated: <span className="text-gray-300">March 2026</span>
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 py-12 space-y-0">
                {/* About */}
                <section className={SECTION_STYLE}>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-green-400">§</span> About Neta AI
                    </h2>
                    <p className="leading-relaxed text-gray-300">
                        <strong className="text-white">Neta AI</strong> (also known as{" "}
                        <em>Neta‑ji | Civic Connect</em>) is a civic‑technology WhatsApp
                        bot developed for the{" "}
                        <strong className="text-white">AI for Bharat Hackathon 2026</strong>.
                        It helps Indian citizens discover government welfare schemes they
                        are eligible for and report civic grievances — all through a simple
                        WhatsApp conversation in multiple Indian languages.
                    </p>
                    <p className="leading-relaxed text-gray-300 mt-3">
                        The project is built and maintained by independent developers based
                        in <strong className="text-white">Mumbai, Maharashtra, India</strong>
                        .
                    </p>
                </section>

                {/* Data We Collect */}
                <section className={SECTION_STYLE}>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-green-400">§</span> Data We Collect
                    </h2>
                    <p className="leading-relaxed text-gray-300 mb-4">
                        When you interact with Neta AI via WhatsApp, we may collect and
                        process the following information:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>
                            <strong className="text-white">WhatsApp phone number</strong> —
                            used to identify your session and deliver responses.
                        </li>
                        <li>
                            <strong className="text-white">Conversation state & messages</strong>{" "}
                            — temporary context stored so the bot can continue multi‑step
                            interactions (e.g., eligibility checks, grievance filing).
                        </li>
                        <li>
                            <strong className="text-white">
                                Demographic inputs you voluntarily provide
                            </strong>{" "}
                            — such as age, state, income bracket, or category — used solely to
                            match you with relevant government schemes.
                        </li>
                        <li>
                            <strong className="text-white">Voice messages</strong> — if you
                            send a voice note, it is temporarily processed for
                            speech‑to‑text conversion and is not stored permanently.
                        </li>
                    </ul>
                </section>

                {/* How We Use Data */}
                <section className={SECTION_STYLE}>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-green-400">§</span> How We Use Your Data
                    </h2>
                    <p className="leading-relaxed text-gray-300 mb-4">
                        Your data is used exclusively to power the bot&apos;s core
                        functionality:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>
                            Matching you with eligible government schemes based on the
                            demographic details you share.
                        </li>
                        <li>
                            Filing and tracking civic grievances on your behalf.
                        </li>
                        <li>
                            Generating voice responses in your preferred language.
                        </li>
                        <li>
                            Maintaining conversation context so you can pick up where you left
                            off.
                        </li>
                    </ul>
                    <p className="leading-relaxed text-gray-300 mt-4">
                        We do <strong className="text-white">not</strong> sell, rent, or
                        share your personal data with any third parties for marketing
                        purposes.
                    </p>
                </section>

                {/* Third‑Party Services */}
                <section className={SECTION_STYLE}>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-green-400">§</span> Third‑Party Services
                    </h2>
                    <p className="leading-relaxed text-gray-300 mb-4">
                        Neta AI relies on the following third‑party services to operate. Each
                        service processes data in accordance with its own privacy policy:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {[
                            {
                                name: "Meta WhatsApp Business API",
                                purpose: "Message delivery & receiving",
                            },
                            {
                                name: "Amazon DynamoDB",
                                purpose: "Conversation state storage",
                            },
                            {
                                name: "Amazon Polly",
                                purpose: "Text‑to‑speech voice responses",
                            },
                            {
                                name: "Amazon S3",
                                purpose: "Temporary media storage",
                            },
                            {
                                name: "Supabase",
                                purpose: "Structured data & analytics",
                            },
                            {
                                name: "AWS Amplify",
                                purpose: "Frontend hosting & deployment",
                            },
                        ].map((svc) => (
                            <div
                                key={svc.name}
                                className="bg-gray-800/60 border border-gray-700/40 rounded-xl px-4 py-3"
                            >
                                <p className="text-sm font-medium text-white">{svc.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{svc.purpose}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Your Rights */}
                <section className={SECTION_STYLE}>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-green-400">§</span> Your Rights
                    </h2>
                    <p className="leading-relaxed text-gray-300 mb-4">
                        You have the right to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>
                            <strong className="text-white">Access</strong> — request a copy of
                            the personal data we hold about you.
                        </li>
                        <li>
                            <strong className="text-white">Correction</strong> — ask us to
                            correct any inaccurate information.
                        </li>
                        <li>
                            <strong className="text-white">Deletion</strong> — request
                            deletion of your data from our systems.
                        </li>
                        <li>
                            <strong className="text-white">Opt‑out</strong> — stop using the
                            bot at any time; we will not contact you unless you initiate a
                            conversation.
                        </li>
                    </ul>
                    <p className="leading-relaxed text-gray-300 mt-4">
                        To exercise any of these rights, please reach out using the contact
                        details below.
                    </p>
                </section>

                {/* Contact */}
                <section className={SECTION_STYLE}>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-green-400">§</span> Contact Us
                    </h2>
                    <p className="leading-relaxed text-gray-300">
                        If you have questions, concerns, or requests regarding this Privacy
                        Policy or your data, please contact us:
                    </p>
                    <div className="mt-4 bg-gray-800/60 border border-gray-700/40 rounded-xl px-5 py-4 space-y-2">
                        <p className="text-sm text-gray-300">
                            📧{" "}
                            <a
                                href="mailto:ty121rt@gmail.com"
                                className="text-green-400 hover:text-green-300 underline underline-offset-2"
                            >
                                ty121rt@gmail.com
                            </a>
                        </p>
                        <p className="text-sm text-gray-300">
                            📍 Mumbai, Maharashtra, India
                        </p>
                    </div>
                </section>

                {/* Back link */}
                <div className="text-center pt-4 pb-8">
                    <Link
                        href="/"
                        className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                        ← Return to Neta AI
                    </Link>
                </div>
            </div>
        </main>
    );
}
