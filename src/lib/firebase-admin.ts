/**
 * Firebase Admin SDK — Server-side only
 * Usado en API routes para leer/escribir Firestore y verificar tokens.
 */
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

function initAdmin(): App {
  if (getApps().length > 0) return getApps()[0];

  const serviceAccountEnv = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
  if (!serviceAccountEnv) {
    throw new Error("FIREBASE_ADMIN_SERVICE_ACCOUNT env var not set");
  }

  let serviceAccount: object;
  try {
    // Soporta JSON directo o base64-encoded
    const decoded = Buffer.from(serviceAccountEnv, "base64").toString("utf-8");
    serviceAccount = JSON.parse(decoded);
  } catch {
    serviceAccount = JSON.parse(serviceAccountEnv);
  }

  return initializeApp({ credential: cert(serviceAccount as any) });
}

// Lazy initialization — no lanza error en build time si la variable no está configurada
let _adminApp: App | null = null;

function getAdminApp(): App {
  if (!_adminApp) _adminApp = initAdmin();
  return _adminApp;
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

// Aliases para compatibilidad con código existente que importa adminDb/adminAuth directamente
export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_target, prop) {
    return (getAdminDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
export const adminAuth: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    return (getAdminAuth() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

/** Admin email list — estos usuarios tienen rol "admin" automáticamente */
export const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ?? "admin@gimo.ai"
)
  .split(",")
  .map((e) => e.trim().toLowerCase());
