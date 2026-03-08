import { useState, useEffect } from "react";
import { CheckCircle, FileText, ExternalLink, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { getPosterUrl } from "@/lib/constants";
interface SchemeCardProps {
    scheme_id: string;
    scheme_name: string;
    full_name: string;
    benefit_amount: string;
    category: string;
    eligibility: {
        age_requirement: string;
        income_requirement: string;
        occupation_requirement: string;
        gender_requirement: string;
        other_conditions: string;
    };
    documents_required: string[];
    eligible: boolean;
    objective: string;
    onApply?: () => void;
}

export default function SchemeCard({
    scheme_id,
    scheme_name,
    full_name,
    benefit_amount,
    category,
    eligibility,
    documents_required,
    eligible,
    objective,
    onApply,
    compact,
    onClickCard,
}: SchemeCardProps & { compact?: boolean; onClickCard?: () => void }) {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language || "en";

    // Poster logic
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [imgSrc, setImgSrc] = useState(getPosterUrl(scheme_id, currentLang));
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(getPosterUrl(scheme_id, currentLang));
        setHasError(false);
        setIsImageLoaded(false);
    }, [currentLang, scheme_id]);

    const handleImageError = () => {
        const fallbackUrl = getPosterUrl(scheme_id, "en");
        if (imgSrc !== fallbackUrl) {
            setImgSrc(fallbackUrl);
        } else {
            setHasError(true);
        }
    };

    return (
        <div
            onClick={onClickCard}
            className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${onClickCard ? 'cursor-pointer' : ''}`}
        >
            {/* Poster Header */}
            <div className={`relative w-full ${compact ? 'h-40' : ''} bg-gray-100 rounded-t-xl overflow-hidden`}>
                {!isImageLoaded && !hasError && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-xl" />
                )}
                {hasError ? (
                    <div className={`${compact ? 'absolute inset-0' : 'w-full h-64 relative'} bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center p-4 text-center rounded-t-xl`}>
                        <h3 className="text-white font-bold text-xl leading-snug drop-shadow-md">
                            {scheme_name}
                        </h3>
                    </div>
                ) : (
                    <img
                        src={imgSrc}
                        alt={scheme_name}
                        className={`w-full ${compact ? 'h-full object-cover' : 'h-auto'} rounded-t-xl transition-opacity duration-300 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                        onLoad={() => setIsImageLoaded(true)}
                        onError={handleImageError}
                    />
                )}
            </div>

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
                        <h3 className="text-lg font-bold text-gray-900">{scheme_name}</h3>
                        <p className="text-sm text-gray-500">{full_name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{benefit_amount}</p>
                    </div>
                </div>
                <p className={`text-sm text-gray-600 mt-2 ${compact ? 'line-clamp-2' : ''}`}>{objective}</p>
            </div>

            {/* Details */}
            {!compact && (
                <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1.5">{t('components.eligibility')}</p>
                            <ul className="space-y-1">
                                {[
                                    eligibility.age_requirement && `Age: ${eligibility.age_requirement}`,
                                    eligibility.income_requirement && `Income: ${eligibility.income_requirement}`,
                                    eligibility.occupation_requirement && `Occupation: ${eligibility.occupation_requirement}`,
                                    eligibility.gender_requirement && eligibility.gender_requirement !== "All" && `Gender: ${eligibility.gender_requirement}`,
                                    eligibility.other_conditions
                                ].filter(Boolean).map((item, idx) => (
                                    <li
                                        key={idx}
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
                                {documents_required.map((doc, idx) => (
                                    <li
                                        key={idx}
                                        className="text-xs text-gray-600 flex items-start gap-1.5"
                                    >
                                        <span className="text-blue-500 mt-0.5">•</span> {doc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Action */}
            <div className="px-5 py-3 border-t border-gray-100 space-y-3">
                {compact ? (
                    <Button
                        onClick={(e) => {
                            if (onClickCard) {
                                e.stopPropagation();
                                onClickCard();
                            }
                        }}
                        className="w-full"
                        variant="secondary"
                    >
                        {t('components.view_details')} &rarr;
                    </Button>
                ) : (
                    <>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onApply) onApply();
                            }}
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
                    </>
                )}
            </div>
        </div>
    );
}

