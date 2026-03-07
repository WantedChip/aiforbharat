"use client";

import { useState } from "react";
import { MapPin, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import StatusBadge from "./StatusBadge";
import StatusTimeline from "./StatusTimeline";
import { useTranslation } from "react-i18next";

interface TimelineStep {
    step: string;
    done: boolean;
    date: string;
}

interface ComplaintCardProps {
    id: string;
    title: string;
    category: string;
    description: string;
    location: string;
    status: string;
    date: string;
    lastUpdate: string;
    assignedTo: string;
    timeline: TimelineStep[];
}

export default function ComplaintCard({
    id,
    title,
    category,
    description,
    location,
    status,
    date,
    assignedTo,
    timeline,
}: ComplaintCardProps) {
    const [expanded, setExpanded] = useState(false);
    const { t } = useTranslation();

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gray-400">{id}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                {category}
                            </span>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 truncate">{title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
                    </div>
                    <StatusBadge status={status} />
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {date}
                    </span>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400">
                        {t('components.assigned_to')} <span className="text-gray-600 font-medium">{assignedTo}</span>
                    </span>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                        {expanded ? (
                            <>
                                {t('components.hide_details')} <ChevronUp className="w-3.5 h-3.5" />
                            </>
                        ) : (
                            <>
                                {t('components.view_details')} <ChevronDown className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Expandable Timeline */}
            {expanded && (
                <div className="px-5 pb-5 pt-2 bg-gray-50/50 border-t border-gray-100 animate-slide-up">
                    <p className="text-xs font-medium text-gray-500 mb-3">{t('components.progress')}</p>
                    <StatusTimeline steps={timeline} />
                </div>
            )}
        </div>
    );
}
