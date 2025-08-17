import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { detectChanges } from "./detectChanges";
import { sendDiscordEmbed } from "./discord";
import { getPreviousRevision, WebhookProjection } from "./sanity";

export async function POST(req: NextRequest) {
    if (!process.env.SANITY_HOOK_SECRET) {
        return new Response("Not Found", { status: 404 });
    }

    try {
        const { isValidSignature, body: seasonUpdate } = await parseBody<
            BodyInit & WebhookProjection
        >(req, process.env.SANITY_HOOK_SECRET);

        if (!isValidSignature) {
            const message = "Invalid signature";
            return new Response(JSON.stringify({ message, isValidSignature, body: seasonUpdate }), {
                status: 401,
            });
        }

        if (!seasonUpdate?.name || !seasonUpdate.game) {
            return new Response("Missing required fields: name or game", { status: 400 });
        }

        const previousRevision = await getPreviousRevision(seasonUpdate._id, seasonUpdate._rev);

        const changes = detectChanges(seasonUpdate, previousRevision);

        if (changes.length > 0) {
            const response = await sendDiscordEmbed(seasonUpdate, changes);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Discord webhook error:", errorText);
                return new Response(`Discord webhook failed: ${errorText}`, { status: 500 });
            }

            console.log(
                `Successfully sent Discord notification for ${seasonUpdate.game} - ${seasonUpdate.name}`,
            );
        }

        return NextResponse.json({
            status: 202,
            message: "Webhook processed successfully",
            timestamp: new Date().toISOString(),
            changesDetected: changes.length,
            changes: changes.map((c) => ({ type: c.type, description: c.discordMessage })),
            discordSent: changes.length > 0,
            webhooksSent: false, // TODO: implement webhook receivers
        });
    } catch (error) {
        console.error("Webhook processing error:", error);

        if (error instanceof Error) {
            return new Response(`Server error: ${error.message}`, { status: 500 });
        }

        return new Response("Unknown server error", { status: 500 });
    }
}
