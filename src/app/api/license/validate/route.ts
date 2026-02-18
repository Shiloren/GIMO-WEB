/**
 * POST /api/license/validate
 * Llamado por GIMO Server para validar una license key.
 * NO requiere Firebase auth — usa la license key directamente.
 */
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { hashLicenseKey, signLicenseJwt } from "@/lib/license";
import { Timestamp } from "firebase-admin/firestore";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { licenseKey, machineFingerprint, machineLabel, os, hostname, appVersion } = body;

    if (!licenseKey || !machineFingerprint) {
      return NextResponse.json({ valid: false, error: "licenseKey and machineFingerprint required" }, { status: 400 });
    }

    // 1. Buscar licencia por keyHash
    const keyHash = hashLicenseKey(licenseKey);
    const licQuery = await adminDb.collection("licenses")
      .where("keyHash", "==", keyHash)
      .limit(1)
      .get();

    if (licQuery.empty) {
      return NextResponse.json({ valid: false, error: "Invalid license key" }, { status: 401 });
    }

    const licDoc = licQuery.docs[0];
    const lic = licDoc.data();
    const licenseId = licDoc.id;

    // 2. Verificar status y expiración
    if (lic.status !== "active") {
      return NextResponse.json({ valid: false, error: `License ${lic.status}` }, { status: 403 });
    }
    if (!lic.lifetime && lic.expiresAt && lic.expiresAt.toDate() < new Date()) {
      await licDoc.ref.update({ status: "expired" });
      return NextResponse.json({ valid: false, error: "License expired" }, { status: 403 });
    }

    // 3. Contar activaciones activas
    const activQuery = await adminDb.collection("activations")
      .where("licenseId", "==", licenseId)
      .where("status", "==", "active")
      .get();

    const existingActiv = activQuery.docs.find(
      (d) => d.data().machineFingerprint === machineFingerprint
    );

    if (existingActiv) {
      // Máquina ya registrada — actualizar heartbeat
      await existingActiv.ref.update({ lastHeartbeat: Timestamp.now() });
    } else if (activQuery.size >= lic.maxInstallations) {
      return NextResponse.json({
        valid: false,
        error: `Installation limit reached (${activQuery.size}/${lic.maxInstallations})`,
      }, { status: 403 });
    } else {
      // Nueva activación
      await adminDb.collection("activations").add({
        licenseId,
        machineFingerprint,
        machineLabel: machineLabel ?? `${os} - ${hostname}`,
        os: os ?? "unknown",
        hostname: hostname ?? "unknown",
        activatedAt: Timestamp.now(),
        lastHeartbeat: Timestamp.now(),
        status: "active",
      });
    }

    // 4. Firmar JWT Ed25519
    const activeCount = existingActiv ? activQuery.size : activQuery.size + 1;
    const expiresAt = lic.lifetime ? null : lic.expiresAt?.toDate()?.toISOString() ?? null;

    const token = await signLicenseJwt({
      sub: lic.userId,
      lic: licenseId,
      plan: lic.plan,
      max: lic.maxInstallations,
      mid: machineFingerprint,
      grace: 7,
      lifetime: lic.lifetime ?? false,
    });

    return NextResponse.json({
      valid: true,
      token,
      plan: lic.plan,
      expiresAt,
      isLifetime: lic.lifetime ?? false,
      activeInstallations: activeCount,
      maxInstallations: lic.maxInstallations,
    });
  } catch (err: any) {
    console.error("[license/validate]", err);
    return NextResponse.json({ valid: false, error: "Internal server error" }, { status: 500 });
  }
}
