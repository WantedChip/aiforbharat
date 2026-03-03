"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { RotateCcw } from "lucide-react";
import { WHATSAPP_DEMO_FLOW } from "@/lib/mockData";

interface Message {
    sender: string;
    message: string;
    type: string;
    visible: boolean;
}

export default function WhatsAppSimulator() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [typing, setTyping] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const scrollToBottom = () => {
        const container = chatContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    };

    const resetDemo = useCallback(() => {
        setMessages([]);
        setCurrentIndex(0);
        setTyping(false);
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    useEffect(() => {
        if (currentIndex >= WHATSAPP_DEMO_FLOW.length) {
            // Auto-loop after 4s
            timerRef.current = setTimeout(() => {
                resetDemo();
            }, 4000);
            return;
        }

        const flow = WHATSAPP_DEMO_FLOW[currentIndex];
        const delay = currentIndex === 0 ? 800 : flow.delay - (WHATSAPP_DEMO_FLOW[currentIndex - 1]?.delay || 0);

        timerRef.current = setTimeout(() => {
            if (flow.sender === "bot") {
                setTyping(true);
                timerRef.current = setTimeout(() => {
                    setTyping(false);
                    setMessages((prev) => [...prev, { ...flow, visible: true }]);
                    setCurrentIndex((i) => i + 1);
                    scrollToBottom();
                }, 800);
            } else {
                setMessages((prev) => [...prev, { ...flow, visible: true }]);
                setCurrentIndex((i) => i + 1);
                scrollToBottom();
            }
        }, delay);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [currentIndex, resetDemo]);

    useEffect(scrollToBottom, [messages]);

    return (
        <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
            {/* Header */}
            <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    NJ
                </div>
                <div className="flex-1">
                    <p className="text-white font-semibold text-sm">Neta-ji Bot</p>
                    <p className="text-green-200 text-xs">Online</p>
                </div>
                <button
                    onClick={resetDemo}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    title="Replay Demo"
                >
                    <RotateCcw className="w-4 h-4 text-white" />
                </button>
            </div>

            {/* Chat Area */}
            <div
                ref={chatContainerRef}
                className="h-[380px] overflow-y-auto p-3 space-y-2"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundColor: "#ece5dd",
                }}
            >
                {/* System message */}
                <div className="flex justify-center mb-2">
                    <span className="bg-white/80 text-gray-500 text-[10px] px-3 py-1 rounded-full shadow-sm">
                        🔒 Messages are end-to-end encrypted
                    </span>
                </div>

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
                    >
                        <div
                            className={`max-w-[85%] rounded-xl px-3 py-2 shadow-sm ${msg.sender === "user"
                                ? "bg-[#dcf8c6] rounded-br-sm"
                                : "bg-white rounded-bl-sm"
                                }`}
                        >
                            {/* Voice message rendering */}
                            {msg.type === "voice" ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                        <span className="text-white text-xs">🎤</span>
                                    </div>
                                    <div className="flex items-end gap-[2px] h-6">
                                        {Array.from({ length: 20 }).map((_, j) => (
                                            <div
                                                key={j}
                                                className="w-[3px] rounded-full bg-green-500 animate-waveform"
                                                style={{
                                                    height: `${4 + Math.random() * 14}px`,
                                                    animationDelay: `${j * 0.05}s`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-gray-500 ml-1">0:08</span>
                                </div>
                            ) : msg.type === "options" ? (
                                <div>
                                    <p className="text-sm text-gray-800 whitespace-pre-line">{msg.message.split("\n\n")[0]}</p>
                                    <div className="flex gap-2 mt-2">
                                        {msg.message.split("\n\n")[1]?.split(" | ").map((opt) => (
                                            <span
                                                key={opt}
                                                className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200 cursor-pointer hover:bg-green-100 transition-colors"
                                            >
                                                {opt}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : msg.type === "result" ? (
                                <div className="bg-green-50 rounded-lg p-2.5 border border-green-100">
                                    <p className="text-sm text-gray-800 whitespace-pre-line">{msg.message}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-800 whitespace-pre-line">{msg.message}</p>
                            )}
                            <p className="text-[10px] text-gray-400 text-right mt-1">
                                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {typing && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="bg-white rounded-xl rounded-bl-sm px-4 py-3 shadow-sm">
                            <div className="flex gap-1">
                                {[0, 1, 2].map((d) => (
                                    <div
                                        key={d}
                                        className="w-2 h-2 bg-gray-400 rounded-full"
                                        style={{
                                            animation: "typing-dots 1.4s infinite",
                                            animationDelay: `${d * 0.2}s`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}


            </div>

            {/* Input Bar */}
            <div className="bg-[#f0f0f0] px-3 py-2 flex items-center gap-2 border-t">
                <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-400">
                    Type a message...
                </div>
                <div className="w-10 h-10 bg-[#075e54] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#064e46] transition-colors">
                    <span className="text-white text-sm">🎤</span>
                </div>
            </div>
        </div>
    );
}
