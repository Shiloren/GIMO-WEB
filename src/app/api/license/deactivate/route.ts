/**
 * POST /api/license/deactivate
 * Libera un slot de instalación.
 */
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyFirebaseToken } from "@/lib/license";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await verifyFirebaseToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { activationId } = await req.json();
  if (!activationId) return NextResponse.json({ error: "activationId required" }, { status: 400 });

  const activRef = adminDb.collection("activations").doc(activationId);
  const activDoc = await activRef.get();
  if (!activDoc.exists) return NextResponse.json({ error: "Activation not found" }, { status: 404 });

  // Verificar que la licencia pertenece al usuario
  const lic = await adminDb.collection("licenses").doc(activDoc.data()!.licenseId).get();
  if (!lic.exists || lic.data()!.userId !== user.uid) {
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  await activRef.update({ status: "deactivated" });
  return NextResponse.json({ success: true });
}
