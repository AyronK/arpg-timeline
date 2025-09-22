import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

import { getCachedClient } from "@/lib/auth/client-cache";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "changeme");

export async function POST(request: NextRequest) {
    try {
        const { clientId, clientSecret } = await request.json();

        if (!clientId || !clientSecret) {
            return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

        const apiClient = await getCachedClient(clientId, clientSecret);

        if (!apiClient || !apiClient.is_active) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await new SignJWT({
            clientId: apiClient.client_id,
            scopes: apiClient.scopes,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(JWT_SECRET);

        return NextResponse.json({
            access_token: token,
            token_type: "Bearer",
            expires_in: 2592000, // 30 days in seconds
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
