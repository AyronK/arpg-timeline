import { NextRequest } from "next/server";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

const requestLog = new Map<string, { count: number; resetAt: number }>();

/**
 * In-memory fixed-window limiter. Per-instance only - resets on cold start
 * and isn't shared across serverless regions/instances. Good enough to blunt
 * casual abuse for a PoC; production would want a distributed limiter
 * (e.g. Upstash/Redis).
 */
export function isRateLimited(key: string): boolean {
    const now = Date.now();
    const entry = requestLog.get(key);

    if (!entry || now > entry.resetAt) {
        requestLog.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return false;
    }

    entry.count += 1;
    return entry.count > MAX_REQUESTS;
}

export function getClientKey(request: NextRequest): string {
    const forwardedFor = request.headers.get("x-forwarded-for");
    return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}
