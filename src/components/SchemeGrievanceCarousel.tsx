"use client";

import { useMemo } from "react";
import { TestimonialsCarousel } from "@/components/ui/testimonials-carousel";
import { MOCK_SCHEMES } from "@/lib/mockData";

export default function SchemeGrievanceCarousel() {
    const schemesData = useMemo(() => {
        const images = [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
            "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&h=100&fit=crop",
            "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop",
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
        ];
        const names = [
            "Ramesh Kumar", "Priya Sharma", "Suresh Patel", "Anita Devi",
            "Kavitha R", "Mohan Das", "Sunita Yadav", "Arjun Singh",
            "Meena Kumari", "Ravi Shankar"
        ];

        return MOCK_SCHEMES.slice(0, 10).map((scheme, i) => ({
            text: scheme.description,
            highlight: scheme.benefit,
            image: images[i],
            name: names[i],
            role: "Enrolled via Neta-ji"
        }));
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

        return rawGrievances.map((grievance, i) => {
            const isMen = i % 2 === 0;
            const portraitId = 31 + Math.floor(i / 2);
            const genderPath = isMen ? "men" : "women";

            return {
                text: `Reported: ${grievance.issue}. Resolved by ${grievance.category} department.`,
                highlight: `Resolved in ${grievance.resolvedIn}`,
                image: `https://randomuser.me/api/portraits/${genderPath}/${portraitId}.jpg`,
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Live on the Ground</h2>
                    <p className="text-gray-500 text-lg">Real schemes helping citizens. Real issues getting resolved.</p>
                </div>

                <div className="flex flex-col gap-6 schemes-grievance-container">
                    <div className="schemes-carousel">
                        <TestimonialsCarousel
                            testimonials={schemesData}
                            speed={25}
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
                            speed={30}
                            direction="right"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
