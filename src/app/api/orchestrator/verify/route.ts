/**
 * POST /api/orchestrator/verify
 * Endpoint interno para que el orquestador valide Firebase ID Token
 * y obtenga perfil + licencia + suscripción del usuario.
 */
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

type LicensePlan = "standard" | "admin" | "none";
type LicenseStatus = "active" | "expired" | "suspended" | "none";
type SubscriptionStatus = "active" | "canceled" | "past_due" | "none";

function toIso(value: unknown): string | null {
    if (!value) return null;

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (typeof value === "object" && value !== null && "toDate" in value) {
        const maybeTimestamp = value as { toDate?: () => Date };
        if (typeof maybeTimestamp.toDate === "function") {
            return maybeTimestamp.toDate().toISOString();
        }
    }

    if (typeof value === "string") return value;
    return null;
}

function normalizeLicensePlan(value: unknown): LicensePlan {
    if (value === "admin") return "admin";
    if (value === "standard") return "standard";
    return "none";
}

function normalizeLicenseStatus(value: unknown): LicenseStatus {
    if (value === "active" || value === "expired" || value === "suspended") {
        return value;
    }
    return "none";
}

function normalizeSubscriptionStatus(value: unknown): SubscriptionStatus {
    if (value === "active" || value === "canceled" || value === "past_due") {
        return value;
    }
    // Compatibilidad con estados de Stripe
    if (value === "trialing") return "active";
    return "none";
}

export async function POST(req: NextRequest) {
    try {
        const internalKey = req.headers.get("x-internal-key");
        const expectedInternalKey = process.env.GIMO_INTERNAL_KEY;

        if (!expectedInternalKey) {
            return NextResponse.json(
                { error: "Server misconfigured: GIMO_INTERNAL_KEY not set" },
                { status: 500 }
            );
        }

        if (!internalKey || internalKey !== expectedInternalKey) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const idToken = typeof body?.idToken === "string" ? body.idToken : "";

        if (!idToken) {
            return NextResponse.json({ error: "idToken required" }, { status: 400 });
        }

        const decoded = await adminAuth.verifyIdToken(idToken);
        const uid = decoded.uid;

        const userDoc = await adminDb.collection("users").doc(uid).get();
        const userData = userDoc.data() ?? {};

        const email =
            (typeof decoded.email === "string" && decoded.email) ||
            (typeof userData.email === "string" ? userData.email : "");
        const displayName =
            (typeof decoded.name === "string" && decoded.name) ||
            (typeof userData.displayName === "string" ? userData.displayName : "");
        const role: "user" | "admin" = userData.role === "admin" ? "admin" : "user";

        const activeLicenseQuery = await adminDb
            .collection("licenses")
            .where("userId", "==", uid)
            .where("status", "==", "active")
            .orderBy("createdAt", "desc")
            .limit(1)
            .get();

        let license = {
            plan: "none" as LicensePlan,
            status: "none" as LicenseStatus,
            isLifetime: false,
            keyPreview: "",
            installationsUsed: 0,
            installationsMax: 0,
            expiresAt: null as string | null,
        };

        if (!activeLicenseQuery.empty) {
            const licDoc = activeLicenseQuery.docs[0];
            const lic = licDoc.data();

            const activationsQuery = await adminDb
                .collection("activations")
                .where("licenseId", "==", licDoc.id)
                .where("status", "==", "active")
                .get();

            const isLifetime = Boolean(lic.lifetime ?? false);
            const mappedStatus = normalizeLicenseStatus(lic.status);

            license = {
                plan: normalizeLicensePlan(lic.plan),
                status: mappedStatus === "none" ? "active" : mappedStatus,
                isLifetime,
                keyPreview: typeof lic.keyPreview === "string" ? lic.keyPreview : "",
                installationsUsed: activationsQuery.size,
                installationsMax:
                    typeof lic.maxInstallations === "number" ? lic.maxInstallations : 0,
                expiresAt: isLifetime ? null : toIso(lic.expiresAt),
            };
        }

        const subscriptionQuery = await adminDb
            .collection("subscriptions")
            .where("userId", "==", uid)
            .orderBy("currentPeriodEnd", "desc")
            .limit(1)
            .get();

        const subscription = subscriptionQuery.empty
            ? {
                status: "none" as SubscriptionStatus,
                currentPeriodEnd: null as string | null,
                cancelAtPeriodEnd: false,
            }
            : (() => {
                const s = subscriptionQuery.docs[0].data();
                return {
                    status: normalizeSubscriptionStatus(s.status),
                    currentPeriodEnd: toIso(s.currentPeriodEnd),
                    cancelAtPeriodEnd: Boolean(s.cancelAtPeriodEnd ?? false),
                };
            })();

        return NextResponse.json({
            uid,
            email,
            displayName,
            role,
            license,
            subscription,
        });
    } catch (err) {
        if (err instanceof Error && /auth\/.+|token/i.test(err.message)) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        console.error("[orchestrator/verify]", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
