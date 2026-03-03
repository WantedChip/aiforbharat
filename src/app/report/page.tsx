"use client";

import { useState, useCallback } from "react";
import {
    MapPin,
    Upload,
    Camera,
    Loader2,
    ArrowRight,
    CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIProcessingOverlay from "@/components/AIProcessingOverlay";
import Link from "next/link";

export default function ReportPage() {
    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [gpsLoading, setGpsLoading] = useState(false);
    const [gpsSet, setGpsSet] = useState(false);
    const [photo, setPhoto] = useState<string | null>(null);
    const [priority, setPriority] = useState("Medium");
    const [contact, setContact] = useState("WhatsApp");
    const [processing, setProcessing] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [grievanceId, setGrievanceId] = useState("");

    const handleGPS = () => {
        setGpsLoading(true);
        setTimeout(() => {
            setLocation("Lucknow, Uttar Pradesh (26.8467° N, 80.9462° E)");
            setGpsLoading(false);
            setGpsSet(true);
        }, 1500);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPhoto(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!category || !title || !description) return;
        setProcessing(true);
    };

    const handleProcessingComplete = useCallback(() => {
        setProcessing(false);
        setSubmitted(true);
        setGrievanceId(`GRV-2024-${Math.floor(1000 + Math.random() * 9000)}`);
    }, []);

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
                <Navbar />
                <div className="max-w-lg mx-auto py-20 px-4 text-center">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-slide-up">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Grievance Submitted!</h2>
                        <p className="text-gray-500 mb-4">Your complaint has been registered successfully</p>
                        <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-100">
                            <p className="text-sm text-gray-500">Grievance ID</p>
                            <p className="text-2xl font-mono font-bold text-green-700">{grievanceId}</p>
                        </div>
                        <div className="space-y-3">
                            <Link href="/dashboard">
                                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl h-11">
                                    Track Your Grievance <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="w-full rounded-xl h-11"
                                onClick={() => {
                                    setSubmitted(false);
                                    setCategory("");
                                    setTitle("");
                                    setDescription("");
                                    setLocation("");
                                    setGpsSet(false);
                                    setPhoto(null);
                                    setPriority("Medium");
                                }}
                            >
                                Submit Another Grievance
                            </Button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <Navbar />
            <AIProcessingOverlay isOpen={processing} onComplete={handleProcessingComplete} />

            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Report a Grievance</h1>
                    <p className="text-gray-500 mt-1">
                        Submit your complaint and we&apos;ll process it with AI
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Form - Left 60% */}
                    <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
                        {/* Category */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700">Category</Label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mt-1.5 w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
                            >
                                <option value="">Select category...</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Title */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700">Title</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Brief description of the issue"
                                className="mt-1.5 rounded-xl h-11"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700">Description</Label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the issue in detail..."
                                className="mt-1.5 rounded-xl min-h-[120px]"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                {description.length}/200 characters (minimum recommended)
                            </p>
                        </div>

                        {/* Location */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700">Location</Label>
                            <div className="mt-1.5 flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGPS}
                                    disabled={gpsLoading || gpsSet}
                                    className="rounded-xl flex-shrink-0"
                                >
                                    {gpsLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : gpsSet ? (
                                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                    ) : (
                                        <MapPin className="w-4 h-4 mr-2" />
                                    )}
                                    {gpsSet ? "GPS Set" : "Use My Location"}
                                </Button>
                                <Input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Or enter location manually"
                                    className="rounded-xl h-10"
                                />
                            </div>
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700">Photo Evidence</Label>
                            <div className="mt-1.5">
                                {photo ? (
                                    <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-gray-200">
                                        <img src={photo} alt="Upload preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setPhoto(null)}
                                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-2">
                                                <Camera className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                <span className="text-green-600 font-medium">Click to upload</span> or drag
                                                & drop
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoUpload}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Priority */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700">Priority</Label>
                            <div className="mt-1.5 flex gap-3">
                                {[
                                    { label: "Low", color: "bg-green-100 text-green-700 border-green-200", icon: "🟢" },
                                    { label: "Medium", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: "🟡" },
                                    { label: "High", color: "bg-red-100 text-red-700 border-red-200", icon: "🔴" },
                                ].map((p) => (
                                    <button
                                        key={p.label}
                                        type="button"
                                        onClick={() => setPriority(p.label)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${priority === p.label
                                                ? `${p.color} ring-2 ring-offset-1`
                                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span>{p.icon}</span> {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Contact Preference */}
                        <div>
                            <Label className="text-sm font-medium text-gray-700">Contact Preference</Label>
                            <div className="mt-1.5 flex gap-3">
                                {["WhatsApp", "SMS", "Email"].map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setContact(c)}
                                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${contact === c
                                                ? "bg-green-50 text-green-700 border-green-200 ring-2 ring-green-500/20"
                                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={!category || !title || !description}
                            className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl text-base shadow-lg shadow-green-500/20"
                        >
                            <Upload className="w-4 h-4 mr-2" /> Submit Grievance
                        </Button>
                    </form>

                    {/* Live Preview - Right 40% */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">📋 Live Preview</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-400 mb-0.5">Category</p>
                                    <p className="text-sm font-medium text-gray-700">
                                        {category || "Not selected"}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-400 mb-0.5">Title</p>
                                    <p className="text-sm font-medium text-gray-700">
                                        {title || "No title yet"}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-400 mb-0.5">Description</p>
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {description || "No description yet"}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-400 mb-0.5">Location</p>
                                    <p className="text-sm font-medium text-gray-700">
                                        {location ? `📍 ${location}` : "Not set"}
                                    </p>
                                </div>
                                {photo && (
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-400 mb-1">Photo</p>
                                        <img
                                            src={photo}
                                            alt="Preview"
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <div className="flex-1 p-3 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-400 mb-0.5">Priority</p>
                                        <p className="text-sm font-medium">{priority}</p>
                                    </div>
                                    <div className="flex-1 p-3 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-400 mb-0.5">Contact</p>
                                        <p className="text-sm font-medium">{contact}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
