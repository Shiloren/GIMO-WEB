import { NextRequest, NextResponse } from "next/server";

const MAINTENANCE = process.env.MAINTENANCE_MODE?.trim() === "true";

// Dominio(s) donde se activa el mantenimiento (separados por coma si hay varios).
// Ejemplo en .env.local:  MAINTENANCE_DOMAIN=gimo.giltech.dev
// Si está vacío y MAINTENANCE_MODE=true, se bloquea en TODOS los dominios.
const BLOCKED_DOMAINS = (process.env.MAINTENANCE_DOMAIN ?? "")
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);

/**
 * Devuelve true si la petición llega desde uno de los dominios bloqueados.
 * Si no se ha configurado ningún dominio (MAINTENANCE_DOMAIN vacío) devuelve
 * true siempre que MAINTENANCE_MODE esté activo, para mantener compatibilidad.
 */
function shouldBlock(request: NextRequest): boolean {
    if (!MAINTENANCE) return false;

    // Sin dominio configurado → bloquear en todos lados (comportamiento anterior)
    if (BLOCKED_DOMAINS.length === 0) return true;

    const host = (request.headers.get("host") ?? "").toLowerCase();
    return BLOCKED_DOMAINS.some(
        (domain) => host === domain || host.startsWith(`${domain}:`)
    );
}

export function middleware(request: NextRequest) {
    if (!shouldBlock(request)) return NextResponse.next();

    const { pathname } = request.nextUrl;

    // Permitir siempre: la propia página de mantenimiento, assets de Next.js y favicon
    if (
        pathname.startsWith("/maintenance") ||
        pathname.startsWith("/_next/") ||
        pathname.startsWith("/favicon")
    ) {
        return NextResponse.next();
    }

    // Rutas API → respuesta JSON 503
    if (pathname.startsWith("/api/")) {
        return NextResponse.json(
            { error: "Service temporarily unavailable. Maintenance in progress." },
            { status: 503 }
        );
    }

    // Todo lo demás → redirigir a /maintenance (307 temporal, sin cache)
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    const res = NextResponse.redirect(url, { status: 307 });
    res.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return res;
}

export const config = {
    matcher: [
        /*
         * Match everything except:
         * - _next/static (static files)
         * - _next/image  (image optimization)
         * - favicon.ico
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
