"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { LicenseKeyCard } from "@/components/license-key-card";
import { InstallationManager } from "@/components/installation-manager";
import { SubscriptionCard } from "@/components/subscription-card";
import { QuickSetupGuide } from "@/components/quick-setup-guide";
import { AdminPanel } from "@/components/admin-panel";

// ─── Types ──────────────────────────────────────────────────────

interface LicenseData {
  id: string;
  plan: string;
  status: string;
  lifetime: boolean;
  keyPreview: string;
  maxInstallations: number;
  installationsUsed: number;
  expiresAt?: string | null;
  regenerationCount: number;
  rawKey?: string;  // show-once
}

interface Activation {
  id: string;
  machineLabel: string;
  os: string;
  hostname: string;
  activatedAt?: string;
  lastHeartbeat?: string;
}

interface SubscriptionData {
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

interface AccountState {
  license: LicenseData | null;
  activations: Activation[];
  subscription: SubscriptionData | null;
  isAdmin: boolean;
  adminLicenses: unknown[];
}

// ─── Helpers ────────────────────────────────────────────────────

async function getIdToken(user: User): Promise<string> {
  return user.getIdToken();
}

async function apiFetch(user: User, path: string, options: RequestInit = {}) {
  const token = await getIdToken(user);
  const res = await fetch(path, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Page ───────────────────────────────────────────────────────

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AccountState>({
    license: null, activations: [], subscription: null, isAdmin: false, adminLicenses: [],
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  // Auth listener
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) router.push("/login");
    });
    return unsub;
  }, [router]);

  // Load license data
  async function loadData(u: User) {
    setLoading(true);
    try {
      const res = await apiFetch(u, "/api/license");
      let adminLicenses: unknown[] = [];
      if (res.isAdmin) {
        const adminRes = await apiFetch(u, "/api/admin/license");
        adminLicenses = adminRes.licenses ?? [];
      }
      setData({ ...res, adminLicenses });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) loadData(user);
  }, [user]);

  // ── Handlers ──────────────────────────────────────────────────

  async function handleCheckout() {
    if (!user) return;
    const res = await apiFetch(user, "/api/checkout", { method: "POST" });
    window.location.href = res.url;
  }

  async function handleRegenerate() {
    if (!user) return;
    await apiFetch(user, "/api/license/regenerate", { method: "POST" });
    await loadData(user);
  }

  async function handleDeactivate(activationId: string) {
    if (!user) return;
    await apiFetch(user, "/api/license/deactivate", { method: "POST", body: JSON.stringify({ activationId }) });
    await loadData(user);
  }

  async function handleManagePortal() {
    if (!user) return;
    const res = await apiFetch(user, "/api/billing/portal", { method: "POST" });
    window.location.href = res.url;
  }

  async function handleCreateLifetime(email: string, maxInstallations: number) {
    if (!user) throw new Error("Not authenticated");
    return apiFetch(user, "/api/admin/license", {
      method: "POST",
      body: JSON.stringify({ targetEmail: email, maxInstallations }),
    });
  }

  async function handleRevoke(licenseId: string) {
    if (!user) return;
    await apiFetch(user, "/api/admin/license/revoke", { method: "POST", body: JSON.stringify({ licenseId }) });
    await loadData(user);
  }

  // ── Render ────────────────────────────────────────────────────

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Cargando...</div>
      </div>
    );
  }

  const { license, activations, subscription, isAdmin, adminLicenses } = data;
  const checkoutSuccess = searchParams.get("checkout") === "success";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">GIMO</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <button
            onClick={() => signOut(getAuth())}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Mi Cuenta</h1>

        {checkoutSuccess && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800 text-sm">
            🎉 <strong>¡Suscripción activada!</strong> Tu clave de licencia está lista abajo.
          </div>
        )}

        {/* Sin suscripción */}
        {!license && (
          <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
            <h2 className="text-xl font-semibold">Activa GIMO Professional</h2>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✅ Acceso completo al Multiagent Orchestrator</li>
              <li>✅ Hasta 2 instalaciones simultáneas</li>
              <li>✅ Soporte offline con JWT cache cifrado</li>
              <li>✅ $3 / mes — cancela cuando quieras</li>
            </ul>
            <button
              onClick={handleCheckout}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Suscribirse — $3/mes
            </button>
          </div>
        )}

        {/* Con licencia */}
        {license && (
          <>
            <LicenseKeyCard
              rawKey={license.rawKey}
              keyPreview={license.keyPreview}
              onRegenerate={handleRegenerate}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SubscriptionCard
                plan={license.plan}
                status={subscription?.status ?? license.status}
                currentPeriodEnd={subscription?.currentPeriodEnd}
                cancelAtPeriodEnd={subscription?.cancelAtPeriodEnd}
                onManage={handleManagePortal}
              />

              <InstallationManager
                activations={activations}
                maxInstallations={license.maxInstallations}
                onDeactivate={handleDeactivate}
              />
            </div>

            <QuickSetupGuide
              licenseKey={license.rawKey}
              keyPreview={license.keyPreview}
            />
          </>
        )}

        {/* Panel Admin */}
        {isAdmin && (
          <AdminPanel
            licenses={adminLicenses as Parameters<typeof AdminPanel>[0]["licenses"]}
            onCreateLifetime={handleCreateLifetime}
            onRevoke={handleRevoke}
          />
        )}
      </main>
    </div>
  );
}
