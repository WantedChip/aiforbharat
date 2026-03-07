import { CheckCircle, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface SchemeCardProps {
    name: string;
    fullName: string;
    benefit: string;
    category: string;
    eligibility: string[];
    documents: string[];
    eligible: boolean;
    description: string;
    onApply?: () => void;
}

export default function SchemeCard({
    name,
    fullName,
    benefit,
    category,
    eligibility,
    documents,
    eligible,
    description,
    onApply,
}: SchemeCardProps) {
    const { t } = useTranslation();
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
            {/* Header */}
            <div className="p-5 pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-600">
                                {category}
                            </span>
                            {eligible ? (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                                    <CheckCircle className="w-3 h-3" /> {t('components.eligible')}
                                </span>
                            ) : (
                                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                                    {t('components.check_eligibility')}
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{name}</h3>
                        <p className="text-sm text-gray-500">{fullName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{benefit}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{description}</p>
            </div>

            {/* Details */}
            <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">{t('components.eligibility')}</p>
                        <ul className="space-y-1">
                            {eligibility.map((item) => (
                                <li
                                    key={item}
                                    className="text-xs text-gray-600 flex items-start gap-1.5"
                                >
                                    <span className="text-green-500 mt-0.5">•</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
                            <FileText className="w-3 h-3" /> {t('components.documents')}
                        </p>
                        <ul className="space-y-1">
                            {documents.map((doc) => (
                                <li
                                    key={doc}
                                    className="text-xs text-gray-600 flex items-start gap-1.5"
                                >
                                    <span className="text-blue-500 mt-0.5">•</span> {doc}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Action */}
            <div className="px-5 py-3 border-t border-gray-100">
                <Button
                    onClick={onApply}
                    disabled={!eligible}
                    className={
                        eligible
                            ? "w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-sm"
                            : "w-full"
                    }
                    variant={eligible ? "default" : "secondary"}
                >
                    {eligible ? (
                        <>
                            {t('components.apply_now')} <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        </>
                    ) : (
                        <>{t('components.check_eligibility')} &rarr;</>
                    )}
                </Button>
            </div>
        </div>
    );
}
