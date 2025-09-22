import { type JWTPayload, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "changeme");

export async function verifyToken(request: NextRequest): Promise<JWTPayload | null> {
    try {
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        const token = authHeader.substring(7);

        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as JWTPayload;
    } catch {
        return null;
    }
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
