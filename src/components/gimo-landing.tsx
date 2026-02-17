"use client";

import { useEffect, useState } from "react";
import {
    Activity,
    ArrowRight,
    Box,
    Code,
    Cpu,
    GitMerge,
    Layout,
    Layers,
    Menu,
    MousePointer2,
    Play,
    Terminal,
    Users,
    X,
    Zap,
} from "lucide-react";

import type { LandingData } from "@/lib/default-content";
import { GoogleAuthButton } from "@/components/google-auth-button";

type GimoLandingProps = {
    data: LandingData;
};

const accentClasses: Record<string, { bg: string; icon: string; hover: string }> = {
    indigo: { bg: "bg-indigo-500/10", icon: "text-indigo-400", hover: "group-hover:bg-indigo-500/20" },
    purple: { bg: "bg-purple-500/10", icon: "text-purple-400", hover: "group-hover:bg-purple-500/20" },
    emerald: { bg: "bg-emerald-500/10", icon: "text-emerald-400", hover: "group-hover:bg-emerald-500/20" },
};

const iconMap = {
    GitMerge,
    Activity,
    Users,
};

export function GimoLanding({ data }: GimoLandingProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeNode, setActiveNode] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveNode((prev) => (prev >= 3 ? 1 : prev + 1));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const { siteSettings, landingPage } = data;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
            <nav className="fixed w-full z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                            <Layers size={18} />
                        </div>
                        <span className="font-semibold text-lg text-white tracking-tight">{siteSettings.siteName}</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        {siteSettings.navItems.map((item) => (
                            <a key={`${item.label}-${item.href}`} href={item.href} className="hover:text-white transition-colors">
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <GoogleAuthButton className="mr-1" />
                        <button className="text-sm font-medium px-4 py-2 rounded-lg bg-white text-black hover:bg-slate-200 transition-colors">
                            Empezar Gratis
                        </button>
                    </div>

                    <button className="md:hidden text-slate-400" onClick={() => setIsMenuOpen((prev) => !prev)} aria-label="Abrir menú">
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden border-t border-white/10 bg-[#020617] px-6 py-4 space-y-3">
                        {siteSettings.navItems.map((item) => (
                            <a key={`mobile-${item.label}`} href={item.href} className="block text-slate-300 hover:text-white">
                                {item.label}
                            </a>
                        ))}
                        <GoogleAuthButton />
                    </div>
                )}
            </nav>

            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate opacity-20 -z-10" />
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
                        <span className="text-xs font-medium text-indigo-300">{landingPage.heroBadge}</span>
                        <ArrowRight size={12} className="text-indigo-400" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                        {landingPage.heroTitleLine1}
                        <br className="hidden md:block" />
                        <span className="text-gradient-primary">{landingPage.heroTitleLine2}</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">{landingPage.heroDescription}</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
                        {landingPage.heroCtas.map((cta, i) => (
                            <a
                                key={`${cta.label}-${i}`}
                                href={cta.href}
                                className={
                                    cta.variant === "primary"
                                        ? "h-12 px-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25"
                                        : "h-12 px-8 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white font-medium transition-all flex items-center gap-2"
                                }
                            >
                                {cta.variant === "primary" ? <Play size={18} fill="currentColor" /> : <Terminal size={18} />}
                                {cta.label}
                            </a>
                        ))}
                    </div>

                    <div className="relative max-w-5xl mx-auto">
                        <div className="rounded-xl border border-slate-700/50 bg-[#0f172a] shadow-2xl overflow-hidden">
                            <div className="h-10 border-b border-slate-700/50 bg-[#1e293b] flex items-center justify-between px-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-600" />
                                    <div className="w-3 h-3 rounded-full bg-slate-600" />
                                </div>
                                <div className="text-xs font-mono text-slate-400">customer_support_flow_v2.gimo</div>
                                <div className="flex gap-3 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Code size={12} /> Code
                                    </span>
                                    <span className="flex items-center gap-1 text-indigo-400 bg-indigo-500/10 px-2 rounded">
                                        <Layout size={12} /> Visual
                                    </span>
                                </div>
                            </div>

                            <div className="flex h-[500px]">
                                <div className="w-64 border-r border-slate-700/50 bg-[#0f172a] p-4 hidden md:block">
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Componentes</div>
                                    <div className="space-y-2">
                                        {["LLM Node", "Vector DB", "API Request", "Condition", "Human Loop"].map((item) => (
                                            <div key={item} className="flex items-center gap-3 p-2 rounded hover:bg-slate-800 cursor-grab active:cursor-grabbing transition-colors group">
                                                <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300">
                                                    <Box size={14} />
                                                </div>
                                                <span className="text-sm text-slate-300">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 bg-[#020617] relative overflow-hidden cursor-crosshair">
                                    <div className="absolute inset-0 bg-grid-slate opacity-20" />

                                    <div
                                        className={`absolute top-20 left-20 w-48 rounded-lg border bg-[#1e293b] p-0 shadow-xl transition-all duration-500 ${activeNode === 1 ? "node-active border-indigo-500" : "border-slate-700"
                                            }`}
                                    >
                                        <div className="px-3 py-2 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
                                            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                                                <Terminal size={12} className="text-emerald-400" /> User Input
                                            </span>
                                        </div>
                                        <div className="p-3 text-[10px] font-mono text-slate-400">type: webhook<br />trigger: &quot;on_message&quot;</div>
                                        <div className="absolute top-1/2 -right-1 w-2 h-2 rounded-full bg-slate-500" />
                                    </div>

                                    <div
                                        className={`absolute top-40 left-80 w-56 rounded-lg border bg-[#1e293b] p-0 shadow-xl transition-all duration-500 ${activeNode === 2 ? "node-active border-indigo-500" : "border-slate-700"
                                            }`}
                                    >
                                        <div className="px-3 py-2 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
                                            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                                                <Cpu size={12} className="text-indigo-400" /> Intent Classifier
                                            </span>
                                        </div>
                                        <div className="p-3">
                                            <div className="w-full h-1 bg-slate-700 rounded overflow-hidden mb-1">
                                                <div className="h-full bg-indigo-500 w-3/4 animate-pulse" />
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-mono">model: gpt-4o-mini</span>
                                        </div>
                                        <div className="absolute top-1/2 -left-1 w-2 h-2 rounded-full bg-slate-500" />
                                        <div className="absolute top-1/3 -right-1 w-2 h-2 rounded-full bg-indigo-500" />
                                        <div className="absolute bottom-1/3 -right-1 w-2 h-2 rounded-full bg-pink-500" />
                                    </div>

                                    <div
                                        className={`absolute top-10 right-20 w-48 rounded-lg border bg-[#1e293b] p-0 shadow-xl transition-all duration-500 ${activeNode === 3 ? "node-active border-indigo-500" : "border-slate-700"
                                            }`}
                                    >
                                        <div className="px-3 py-2 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
                                            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                                                <Zap size={12} className="text-amber-400" /> Support Agent
                                            </span>
                                        </div>
                                        <div className="p-3 text-[10px] font-mono text-slate-400">role: &quot;technical_help&quot;<br />tools: [docs_search]</div>
                                        <div className="absolute top-1/2 -left-1 w-2 h-2 rounded-full bg-indigo-500" />
                                    </div>

                                    <svg className="absolute inset-0 pointer-events-none w-full h-full">
                                        <path d="M 120 130 C 220 130, 220 210, 320 210" fill="none" stroke="#475569" strokeWidth="2" />
                                        <path
                                            d="M 120 130 C 220 130, 220 210, 320 210"
                                            fill="none"
                                            stroke={activeNode >= 2 ? "#6366f1" : "transparent"}
                                            strokeWidth="2"
                                            className={activeNode >= 2 ? "animate-dash" : ""}
                                        />

                                        <path d="M 545 200 C 600 200, 600 100, 650 80" fill="none" stroke="#475569" strokeWidth="2" />
                                        <path
                                            d="M 545 200 C 600 200, 600 100, 650 80"
                                            fill="none"
                                            stroke={activeNode === 3 ? "#6366f1" : "transparent"}
                                            strokeWidth="2"
                                            className={activeNode === 3 ? "animate-dash" : ""}
                                        />
                                    </svg>

                                    <div className="absolute bottom-10 right-10 flex items-center gap-2 bg-indigo-600/90 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                                        <MousePointer2 size={12} />
                                        User_882 editing...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-10 border-y border-white/5 bg-[#0b1221]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{landingPage.trustTitle}</span>
                    <div className="flex gap-8 items-center flex-wrap justify-center">
                        {landingPage.trustLogos.map((logo) => (
                            <span key={logo.label} className="text-lg font-bold text-slate-400 font-sans">
                                {logo.label}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-[#020617]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">{landingPage.featuresTitle}</h2>
                        <p className="text-slate-400 max-w-2xl text-lg">{landingPage.featuresDescription}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {landingPage.features.map((feature) => {
                            const Icon = iconMap[feature.icon] ?? GitMerge;
                            const accent = accentClasses[feature.accent] ?? accentClasses.indigo;

                            return (
                                <div key={feature.title} className="glass-card p-8 rounded-2xl group transition-all">
                                    <div className={`w-12 h-12 rounded-lg ${accent.bg} flex items-center justify-center mb-6 ${accent.hover} transition-colors`}>
                                        <Icon className={accent.icon} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-24 border-t border-white/5 relative">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">
                            {landingPage.codeSectionTitle1}
                            <br />
                            <span className="text-slate-500">{landingPage.codeSectionTitle2}</span>
                        </h2>
                        <p className="text-slate-400 mb-8 text-lg">{landingPage.codeSectionDescription}</p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">1</div>
                                <div>
                                    <h4 className="text-white font-medium">Exportación Nativa</h4>
                                    <p className="text-sm text-slate-500">Exporte sus grafos como paquetes de Python o Node.js.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">2</div>
                                <div>
                                    <h4 className="text-white font-medium">Control de Versiones</h4>
                                    <p className="text-sm text-slate-500">Cada cambio es un commit. Haga rollback instantáneo si un agente alucina.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-[#0f172a] border border-slate-700 p-6 font-mono text-sm shadow-2xl relative text-slate-300">
                        <div className="absolute -top-4 -right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg">gimo.config.ts</div>
                        <pre className="whitespace-pre-wrap">{`import { createFlow } from '@gimo/sdk';

const supportFlow = createFlow({
  name: "refund_process",
  nodes: [
    { type: "llm", model: "gpt-4" },
    { type: "api_call", endpoint: "/stripe" }
  ],
  edges: [
    { from: "llm", to: "api_call", if: "approved" }
  ]
});

// Deploy directly to edge
supportFlow.deploy();`}</pre>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/5 bg-[#020617] pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">{landingPage.finalCtaTitle}</h2>
                    <div className="flex justify-center gap-4 mb-12 flex-wrap">
                        {landingPage.finalCtas.map((cta, i) => (
                            <a
                                key={`final-${cta.label}-${i}`}
                                href={cta.href}
                                className={
                                    cta.variant === "primary"
                                        ? "px-8 py-3 rounded-lg bg-white text-black font-semibold hover:bg-slate-200 transition-colors"
                                        : "px-8 py-3 rounded-lg border border-slate-700 text-white font-semibold hover:bg-slate-800 transition-colors"
                                }
                            >
                                {cta.label}
                            </a>
                        ))}
                    </div>
                    <p className="text-slate-600 text-sm">{siteSettings.footerCopyright}</p>
                </div>
            </footer>
        </div>
    );
}
