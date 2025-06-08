import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
    if (!process.env.SANITY_HOOK_SECRET) {
        return new Response("Not Found", { status: 404 });
    }

    try {
        const { isValidSignature, body } = await parseBody<BodyInit & { _type: string }>(
            req,
            process.env.SANITY_HOOK_SECRET,
        );

        if (!isValidSignature) {
            const message = "Invalid signature";
            return new Response(JSON.stringify({ message, isValidSignature, body }), {
                status: 401,
            });
        }

        if (!body?._type) {
            return new Response(body, { status: 400 });
        }

        revalidateTag(body._type);

        return NextResponse.json({
            status: 200,
            revalidated: true,
            now: Date.now(),
            body,
        });
    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
        }

        return new Response("Error", { status: 500 });
    }
}
