"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Shield, CreditCard, Zap, CheckCircle2, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Lista de correos con rango admin (según petición del usuario)
const ADMIN_EMAILS = new Set(["shilo@shilo.com", "admin@gimo.ai"]);

export default function AccountPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/empezar-gratis");
            }
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    const handleSignOut = async () => {
        if (!auth) return;
        await signOut(auth);
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    const isAdmin = user?.email ? ADMIN_EMAILS.has(user.email) || user.email.includes("shilo") : false;
    const planName = isAdmin ? "GIMO Admin" : "Plan Gratuito";
    const tokenStatus = isAdmin ? "Vitalicio (Ilimitado)" : "100 / 100 mensuales";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            <nav className="relative z-10 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap size={18} className="text-white" fill="white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            GIMO
                        </span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <span className="text-sm text-slate-400 hidden sm:inline-block">{user?.email}</span>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                            <LogOut size={14} />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <header className="mb-12">
                    <h1 className="text-3xl font-bold text-white mb-2">Mi Cuenta</h1>
                    <p className="text-slate-400 font-medium">Gestiona tu suscripción y acceso a la plataforma.</p>
                </header>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Subscription Card */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                                <CreditCard className="text-emerald-400" size={24} />
                            </div>
                            {isAdmin && (
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-500/20">
                                    Admin User
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-1">Suscripción Actual</h2>
                        <p className="text-slate-400 text-sm mb-6">Tu plan contratado actualmente.</p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-slate-800/50">
                                <span className="text-sm text-slate-500">Plan</span>
                                <span className="text-sm font-semibold text-emerald-400">{planName}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-slate-800/50">
                                <span className="text-sm text-slate-500">Estado</span>
                                <span className="text-sm font-semibold text-white">Activa</span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-sm text-slate-500">Próximo pago</span>
                                <span className="text-sm font-semibold text-white">{isAdmin ? "Nunca" : "18 Mar, 2026"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tokens Card */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                <Zap className="text-blue-400" size={24} />
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-1">Generación de Tokens</h2>
                        <p className="text-slate-400 text-sm mb-6">Uso de tokens en la plataforma.</p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-slate-800/50">
                                <span className="text-sm text-slate-500">Balance</span>
                                <span className="text-sm font-semibold text-blue-400">{tokenStatus}</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-slate-800/50">
                                <span className="text-sm text-slate-500">Tipo de tokens</span>
                                <span className="text-sm font-semibold text-white">{isAdmin ? "Vitalicios" : "Mensuales"}</span>
                            </div>
                            <div className="mt-6">
                                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20">
                                    Generar nuevo Token
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Security/Admin Card */}
                    <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                                <Shield className="text-slate-400" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Seguridad y Permisos</h2>
                                <p className="text-sm text-slate-500">Configuración avanzada de tu cuenta.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <CheckCircle2 className="text-emerald-500" size={16} />
                                    <span className="text-sm font-medium text-white">Identidad Verificada</span>
                                </div>
                                <p className="text-xs text-slate-500">Tu cuenta está vinculada a Google de forma segura.</p>
                            </div>
                            {isAdmin && (
                                <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Shield className="text-emerald-400" size={16} />
                                        <span className="text-sm font-medium text-emerald-400">Rango Administrativo</span>
                                    </div>
                                    <p className="text-xs text-slate-500">Tienes acceso a funciones de gestión de red y tokens vitalicios.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
