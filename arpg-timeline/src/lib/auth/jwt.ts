import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

import { Scope } from "./scopes";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "changeme");

export interface JWTPayload {
    clientId: string;
    userId: string;
    scopes: Scope[];
    iat?: number;
    exp?: number;
}

export async function verifyToken(request: NextRequest): Promise<JWTPayload | null> {
    try {
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        const token = authHeader.substring(7);

        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as JWTPayload;
    } catch {
        return null;
    }
}

export async function verifyTokenWithScopes(
    request: NextRequest,
    requiredScopes: string[],
): Promise<{ payload: JWTPayload | null; hasAccess: boolean }> {
    const payload = await verifyToken(request);

    if (!payload) {
        return { payload: null, hasAccess: false };
    }

    const hasAccess = requiredScopes.some((scope) => payload.scopes.includes(scope as Scope));

    return { payload, hasAccess };
}

export function createAuthResponse(message: string = "Unauthorized") {
    return NextResponse.json(
        { error: message },
        {
            status: 401,
            headers: {
                "WWW-Authenticate": "Bearer",
            },
        },
    );
}
