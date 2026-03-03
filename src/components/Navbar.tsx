"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/constants";
import { useState } from "react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/schemes", label: "Schemes" },
    { href: "/report", label: "Report" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin", label: "Admin" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [langOpen, setLangOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState("English");

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-border/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-gray-900">Neta-ji</span>
                            <span className="text-sm text-gray-400 font-light">| Civic Connect</span>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === link.href
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {/* Language Selector */}
                        <div className="relative hidden sm:block">
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                                <span>{selectedLang}</span>
                            </button>
                            {langOpen && (
                                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[140px] z-50 animate-fade-in">
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setSelectedLang(lang.name);
                                                setLangOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 hover:text-green-700 transition-colors"
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* AWS Badge */}
                        <span className="hidden lg:inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full border border-orange-100">
                            ⚡ AWS Powered
                        </span>

                        {/* Login Button */}
                        <Link href="/login">
                            <Button
                                size="sm"
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md shadow-green-500/20 hover:shadow-green-500/40 transition-all"
                            >
                                Login
                            </Button>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-2 animate-slide-up">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-lg text-sm font-medium ${pathname === link.href
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
