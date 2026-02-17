"use client";

import { useEffect, useState } from "react";
import { Chrome } from "lucide-react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import Link from "next/link";

import { auth } from "@/lib/firebase";

type GoogleAuthButtonProps = {
    signedInLabel?: string;
    className?: string;
};

export function GoogleAuthButton({ signedInLabel = "Conectado", className = "" }: GoogleAuthButtonProps) {
    const [userName, setUserName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!auth) return;

        return onAuthStateChanged(auth, (user) => {
            setUserName(user?.displayName || user?.email || null);
        });
    }, []);

    const handleSignIn = async () => {
        if (!auth) {
            alert("Falta configuración de Firebase. Revisa variables NEXT_PUBLIC_FIREBASE_*");
            return;
        }

        try {
            setLoading(true);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            setUserName(result.user.displayName || result.user.email || "Usuario");
        } catch (error) {
            console.error(error);
            alert("No se pudo iniciar sesión con Google.");
        } finally {
            setLoading(false);
        }
    };


    if (userName) {
        return (
            <Link
                href="/account"
                className={`text-sm font-medium text-emerald-300 hover:text-white transition-all inline-flex items-center gap-2 group ${className}`}
            >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="group-hover:underline underline-offset-4">
                    {signedInLabel}: {userName}
                </span>
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className={`text-sm font-medium text-slate-300 hover:text-white transition-colors inline-flex items-center gap-2 disabled:opacity-60 ${className}`}
        >
            <Chrome size={14} />
            {loading ? "Conectando..." : "Sign in Google"}
        </button>
    );
}
