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

const adminApp = initAdmin();
export const adminDb: Firestore = getFirestore(adminApp);
export const adminAuth: Auth = getAuth(adminApp);

/** Admin email list — estos usuarios tienen rol "admin" automáticamente */
export const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ?? "admin@gimo.ai"
)
  .split(",")
  .map((e) => e.trim().toLowerCase());
