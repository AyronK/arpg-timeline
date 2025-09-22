import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

const CLIENTS = {
    client_id_123: "supersecret",
};

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "changeme");

export async function POST(request: NextRequest) {
    try {
        const { clientId, clientSecret } = await request.json();

        if (!clientId || !clientSecret) {
            return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

        const validSecret = CLIENTS[clientId as keyof typeof CLIENTS];
        if (!validSecret || validSecret !== clientSecret) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await new SignJWT({ clientId })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(JWT_SECRET);

        return NextResponse.json({
            access_token: token,
            token_type: "Bearer",
            expires_in: 2592000, // 30 days in seconds
        });
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
