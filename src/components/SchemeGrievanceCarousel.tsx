"use client";

import { useMemo } from "react";
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel";
import { MOCK_SCHEMES } from "@/lib/mockData";
import { Droplets, Zap, Trash2, GraduationCap, Building2, Pill, AlertTriangle } from "lucide-react";

export default function SchemeGrievanceCarousel() {
    const schemesData = useMemo(() => {
        const names = [
            "Ramesh Kumar", "Priya Sharma", "Suresh Patel", "Anita Devi",
            "Kavitha R", "Mohan Das", "Sunita Yadav", "Arjun Singh",
            "Meena Kumari", "Ravi Shankar"
        ];

        return MOCK_SCHEMES.slice(0, 10).map((scheme, i) => {
            const nameParts = names[i].split(" ");
            const initials = nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[1][0]}` : nameParts[0][0];

            return {
                text: scheme.objective,
                highlight: scheme.benefit_amount,
                initials: initials,
                name: names[i],
                role: "Enrolled via Neta-ji"
            };
        });
    }, []);

    const grievancesData = useMemo(() => {
        const rawGrievances = [
            {
                name: "Ramesh Kumar", location: "Lucknow, UP", issue: "Water supply disruption",
                resolvedIn: "5 days", category: "Water & Sanitation"
            },
            {
                name: "Priya Sharma", location: "Mumbai, MH", issue: "Pothole on main road",
                resolvedIn: "3 days", category: "Roads"
            },
            {
                name: "Arjun Singh", location: "Patna, Bihar", issue: "Street light outage",
                resolvedIn: "2 days", category: "Electricity"
            },
            {
                name: "Sunita Devi", location: "Jaipur, RJ", issue: "Garbage not collected",
                resolvedIn: "1 day", category: "Sanitation"
            },
            {
                name: "Mohan Reddy", location: "Hyderabad, TS", issue: "School roof damage",
                resolvedIn: "7 days", category: "Education"
            },
            {
                name: "Kavitha R", location: "Chennai, TN", issue: "Sewage overflow",
                resolvedIn: "4 days", category: "Water & Sanitation"
            },
            {
                name: "Suresh Patel", location: "Ahmedabad, GJ", issue: "Hospital medicine shortage",
                resolvedIn: "6 days", category: "Healthcare"
            },
            {
                name: "Meena Kumari", location: "Bhopal, MP", issue: "Tree blocking road",
                resolvedIn: "1 day", category: "Roads"
            },
            {
                name: "Anita Devi", location: "Kanpur, UP", issue: "Public toilet non-functional",
                resolvedIn: "3 days", category: "Sanitation"
            },
            {
                name: "Ravi Shankar", location: "Kolkata, WB", issue: "Illegal construction blocking lane",
                resolvedIn: "8 days", category: "Infrastructure"
            },
        ];

        const getCategoryIcon = (category: string) => {
            if (category.includes("Water")) return <Droplets className="w-6 h-6" />;
            if (category.includes("Electric")) return <Zap className="w-6 h-6" />;
            if (category.includes("Sanitation")) return <Trash2 className="w-6 h-6" />;
            if (category.includes("Education")) return <GraduationCap className="w-6 h-6" />;
            if (category.includes("Healthcare")) return <Pill className="w-6 h-6" />;
            if (category.includes("Roads") || category.includes("Infrastructure")) return <AlertTriangle className="w-6 h-6" />;
            return <Building2 className="w-6 h-6" />;
        };

        return rawGrievances.map((grievance, i) => {
            return {
                text: `Reported: ${grievance.issue}. Resolved by ${grievance.category} department.`,
                highlight: `Resolved in ${grievance.resolvedIn}`,
                icon: getCategoryIcon(grievance.category),
                name: grievance.name,
                role: `${grievance.location} · ✅ Resolved in ${grievance.resolvedIn}`,
            };
        });
    }, []);

    return (
        <div className="hidden sm:block">
            <div
                className="bg-[#f8fafc] py-16"
                style={{
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                    maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
                }}
            >
                <div className="text-center mb-10 px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">The Pulse of Bharat</h2>
                    <p className="text-gray-500 text-lg">Real citizens claiming their rights. Real grievances getting solved.</p>
                </div>

                <div className="flex flex-col gap-6 schemes-grievance-container">
                    <div className="schemes-carousel">
                        <TestimonialsCarousel
                            testimonials={schemesData}
                            speed={50}
                            direction="left"
                        />
                    </div>

                    <div className="grievances-carousel [&_span.text-blue-500]:!text-green-500 [&_.highlight-text]:!text-green-500 relative">
                        <style jsx global>{`
              .grievances-carousel .testimonial-card {
                 position: relative;
              }
              .grievances-carousel .testimonial-card::after {
                 content: "✅ Resolved";
                 position: absolute;
                 top: 16px;
                 right: 16px;
                 background-color: #f0fdf4;
                 color: #166534;
                 padding: 4px 8px;
                 border-radius: 9999px;
                 font-size: 12px;
                 font-weight: 600;
              }
            `}</style>
                        <TestimonialsCarousel
                            testimonials={grievancesData}
                            speed={60}
                            direction="right"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
