"use client";

import { useEffect, useState } from "react";
import { Chrome } from "lucide-react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

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

    const handleSignOut = async () => {
        if (!auth) return;
        await signOut(auth);
        setUserName(null);
    };

    if (userName) {
        return (
            <button
                type="button"
                onClick={handleSignOut}
                className={`text-sm font-medium text-emerald-300 hover:text-emerald-200 transition-colors ${className}`}
            >
                {signedInLabel}: {userName}
            </button>
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
