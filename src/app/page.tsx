"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle, Globe, Zap, Bot, Shield, Mic, Camera, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppSimulator from "@/components/WhatsAppSimulator";
import { FEATURES, HERO_STATS, WHATSAPP_FLOW_STEPS, WEB_FLOW_STEPS, AWS_SERVICES } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
          <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Sarkar Ki Schemes,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Aapki Awaaz Mein
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              Report grievances, discover government schemes, and track resolutions — all
              through voice on WhatsApp or web. Powered by AWS AI services.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/schemes">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all h-12 px-8 text-base"
                >
                  <MessageCircle className="w-5 h-5 mr-2" /> Try WhatsApp Bot →
                </Button>
              </Link>
              <Link href="/report">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl h-12 px-8 text-base border-gray-200 hover:bg-gray-50"
                >
                  Submit Grievance <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Split Demo Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: WhatsApp Simulator */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">WhatsApp Bot Demo</h3>
                <p className="text-xs text-gray-500">Voice-first, multilingual interface</p>
              </div>
            </div>
            <WhatsAppSimulator />
          </div>

          {/* Right: Web Portal Preview */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Web Portal Preview</h3>
                <p className="text-xs text-gray-500">Full-featured civic dashboard</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              {/* Mini Dashboard Preview */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">N</span>
                  </div>
                  <span className="text-sm font-bold text-gray-700">Dashboard</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white rounded-lg p-2 text-center border border-gray-100">
                    <p className="text-lg font-bold text-green-600">5</p>
                    <p className="text-[10px] text-gray-500">Grievances</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-gray-100">
                    <p className="text-lg font-bold text-blue-600">3</p>
                    <p className="text-[10px] text-gray-500">Schemes</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-gray-100">
                    <p className="text-lg font-bold text-yellow-600">2</p>
                    <p className="text-[10px] text-gray-500">Pending</p>
                  </div>
                </div>
              </div>

              {/* Mini Form Preview */}
              <div className="p-4 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">📝 Report Grievance</p>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-50 rounded-lg border border-gray-100 flex items-center px-3">
                    <span className="text-xs text-gray-400">Water & Sanitation</span>
                  </div>
                  <div className="h-8 bg-gray-50 rounded-lg border border-gray-100 flex items-center px-3">
                    <span className="text-xs text-gray-400">No water supply for 3 days...</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 flex-1 bg-green-50 rounded-lg border border-green-100 flex items-center justify-center">
                      <span className="text-xs text-green-600 font-medium">📍 GPS Location</span>
                    </div>
                    <div className="h-8 flex-1 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center">
                      <span className="text-xs text-blue-600 font-medium">📷 Photo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Status Preview */}
              <div className="p-4">
                <p className="text-xs font-medium text-gray-500 mb-2">📊 Status Tracking</p>
                <div className="space-y-2">
                  {[
                    { id: "GRV-2026-1234", title: "Water supply disruption", status: "Resolved" },
                    { id: "GRV-2026-1235", title: "Road repair needed", status: "In Progress" },
                    { id: "GRV-2026-1236", title: "Street light not working", status: "Pending" },
                  ].map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{g.title}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{g.id}</p>
                      </div>
                      <StatusBadge status={g.status} className="text-[10px] px-1.5 py-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-green-200 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Everything You Need for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Civic Engagement
            </span>
          </h2>
          <p className="text-gray-500 mt-2">
            Powered by AI to bridge the gap between citizens and government
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-green-100 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-500 mt-2">Two paths, one mission — empowering citizens</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* WhatsApp Flow */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">WhatsApp Flow</h3>
                  <p className="text-xs text-gray-500">Voice-first experience</p>
                </div>
              </div>
              <div className="space-y-3">
                {WHATSAPP_FLOW_STEPS.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Web Flow */}
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-8 border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Web Portal Flow</h3>
                  <p className="text-xs text-gray-500">Full-featured dashboard</p>
                </div>
              </div>
              <div className="space-y-3">
                {WEB_FLOW_STEPS.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AWS Powered Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Built on World-Class Infrastructure
          </h2>
          <p className="text-gray-500 mt-2">
            Leveraging AWS AI/ML services for scalable, reliable civic tech
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {AWS_SERVICES.slice(0, 4).map((service) => (
            <div
              key={service.name}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group"
            >
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 group-hover:bg-orange-100 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{service.name}</h3>
              <p className="text-xs text-gray-500">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Connect with Your Government?
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Join millions of citizens using AI-powered tools to access schemes and report issues
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-green-50 rounded-xl h-12 px-8 text-base font-semibold shadow-lg"
              >
                Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/schemes">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-white/15 hover:bg-white/25 rounded-xl h-12 px-8 text-base font-medium"
              >
                Explore Schemes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
