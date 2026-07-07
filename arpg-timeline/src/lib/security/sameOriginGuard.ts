import { NextRequest } from "next/server";

const getAllowedOrigin = (): string | null => {
    const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) return null;
    try {
        return new URL(siteUrl).origin;
    } catch {
        return null;
    }
};

const isLocalOrigin = (origin: string): boolean => {
    try {
        const { hostname } = new URL(origin);
        return hostname === "localhost" || hostname === "127.0.0.1";
    } catch {
        return false;
    }
};

/**
 * PoC-level protection only: Sec-Fetch-Site/Origin/Referer are set by the
 * browser for genuine same-origin fetch() calls, but can be freely spoofed by
 * non-browser HTTP clients (curl, scripts). This stops casual cross-site use,
 * not a determined attacker - production would need a WAF or managed
 * bot-protection layer in front of these routes.
 */
export function isSameOriginRequest(request: NextRequest): boolean {
    if (request.headers.get("sec-fetch-site") === "same-origin") {
        return true;
    }

    const origin = request.headers.get("origin") ?? request.headers.get("referer");
    if (!origin) return false;

    try {
        const originValue = new URL(origin).origin;
        const allowedOrigin = getAllowedOrigin();
        return originValue === allowedOrigin || isLocalOrigin(originValue);
    } catch {
        return false;
    }
}
