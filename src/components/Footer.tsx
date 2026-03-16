import { AWS_SERVICES } from "@/lib/constants";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            {/* AWS Services Bar */}
            <div className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 text-center font-medium">
                        {t('components.powered_by')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {AWS_SERVICES.map((service) => (
                            <div
                                key={service.name}
                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700/50"
                            >
                                <span className="text-sm">{service.icon}</span>
                                <span className="text-xs text-gray-400">{service.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">N</span>
                        </div>
                        <span className="text-sm font-semibold text-white">{t('components.footer_title')}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-xs text-gray-500 text-center">
                            {t('components.footer_sub')}
                        </p>
                        <p className="text-xs text-gray-500">
                            Powered by{" "}
                            <span className="text-orange-400 font-medium">Amazon Web Services</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="text-gray-700">|</span>
                        <Link href="/admin/login" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                            {t('components.admin')}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
