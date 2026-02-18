/**
 * GET /api/license
 * Devuelve info de la licencia activa del usuario.
 * Si existe una pending_key (key aún no vista), la incluye y la elimina.
 */
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyFirebaseToken } from "@/lib/license";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await verifyFirebaseToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Licencia activa del usuario
  const licQuery = await adminDb.collection("licenses")
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (licQuery.empty) {
    return NextResponse.json({ license: null });
  }

  const licDoc = licQuery.docs[0];
  const lic = licDoc.data();

  // Contar activaciones activas
  const activQuery = await adminDb.collection("activations")
    .where("licenseId", "==", licDoc.id)
    .where("status", "==", "active")
    .get();

  const activations = activQuery.docs.map((d) => ({
    id: d.id,
    machineLabel: d.data().machineLabel,
    os: d.data().os,
    hostname: d.data().hostname,
    activatedAt: d.data().activatedAt?.toDate()?.toISOString(),
    lastHeartbeat: d.data().lastHeartbeat?.toDate()?.toISOString(),
  }));

  // Suscripción activa
  const subQuery = await adminDb.collection("subscriptions")
    .where("userId", "==", user.uid)
    .orderBy("currentPeriodEnd", "desc")
    .limit(1)
    .get();

  const subscription = subQuery.empty ? null : (() => {
    const s = subQuery.docs[0].data();
    return {
      status: s.status,
      currentPeriodEnd: s.currentPeriodEnd?.toDate()?.toISOString(),
      cancelAtPeriodEnd: s.cancelAtPeriodEnd,
    };
  })();

  // Pending key (show-once) — si existe, incluir y eliminar
  let rawKey: string | null = null;
  const pendingRef = adminDb.collection("pending_keys").doc(user.uid);
  const pendingDoc = await pendingRef.get();
  if (pendingDoc.exists) {
    const pendingData = pendingDoc.data();
    // Verificar TTL (10 minutos)
    const createdAt = pendingData?.createdAt?.toDate() as Date | undefined;
    if (createdAt && Date.now() - createdAt.getTime() < 10 * 60 * 1000) {
      rawKey = pendingData?.rawKey as string;
    }
    // Eliminar independientemente del TTL (ya fue vista o expiró)
    await pendingRef.delete();
  }

  return NextResponse.json({
    license: {
      id: licDoc.id,
      plan: lic.plan,
      status: lic.status,
      lifetime: lic.lifetime,
      keyPreview: lic.keyPreview,
      maxInstallations: lic.maxInstallations,
      installationsUsed: activations.length,
      expiresAt: lic.expiresAt?.toDate()?.toISOString() ?? null,
      regenerationCount: lic.regenerationCount,
      // rawKey solo presente si hay pending key (show-once)
      ...(rawKey ? { rawKey } : {}),
    },
    activations,
    subscription,
    isAdmin: user.role === "admin",
  });
}
