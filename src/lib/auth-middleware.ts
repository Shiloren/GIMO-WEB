import { NextRequest, NextResponse } from "next/server";
// Fix E: firebase-admin.ts exporta instancias directas (adminAuth, adminDb), no funciones factory
import { adminAuth, adminDb } from "./firebase-admin";

export interface AuthUser {
  uid: string;
  email: string;
  role: "user" | "admin";
}

/**
 * Verify Firebase ID token from Authorization header.
 * Returns the authenticated user or a 401 response.
 */
export async function verifyAuth(
  request: NextRequest
): Promise<AuthUser | NextResponse> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing Authorization header" },
      { status: 401 }
    );
  }

  const idToken = authHeader.slice(7);

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = decoded.email ?? "";

    // Fetch role from Firestore
    const db = adminDb;
    const userDoc = await db.collection("users").doc(uid).get();
    let role: "user" | "admin" = "user";

    if (userDoc.exists) {
      role = userDoc.data()?.role === "admin" ? "admin" : "user";
    } else {
      // First login: create user document
      await db.collection("users").doc(uid).set({
        email,
        displayName: decoded.name ?? "",
        role: "user",
        stripeCustomerId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return { uid, email, role };
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

/**
 * Verify that the user has admin role.
 */
export async function verifyAdmin(
  request: NextRequest
): Promise<AuthUser | NextResponse> {
  const result = await verifyAuth(request);
  if (result instanceof NextResponse) return result;

  if (result.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  return result;
}
