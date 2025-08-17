import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { detectLiveStreamChanges, detectSeasonChanges } from "./detectChanges";
import { sendDiscordLiveStreamEmbed, sendDiscordSeasonEmbed } from "./discord";
import {
    getPreviousRevision,
    LiveStreamProjection,
    SeasonProjection,
    WebhookProjection,
} from "./sanity";

export async function POST(req: NextRequest) {
    if (!process.env.SANITY_HOOK_SECRET) {
        return new Response("Not Found", { status: 404 });
    }

    try {
        const { isValidSignature, body } = await parseBody<BodyInit & WebhookProjection>(
            req,
            process.env.SANITY_HOOK_SECRET,
        );

        if (!isValidSignature) {
            const message = "Invalid signature";
            return new Response(JSON.stringify({ message, isValidSignature, body }), {
                status: 401,
            });
        }

        if (!body?.name || !body.game) {
            return new Response("Missing required fields: name or game", { status: 400 });
        }

        if (body._type === "liveStreamTwitch") {
            return handleLiveStreamChange(body as LiveStreamProjection);
        } else {
            return handleSeasonChange(body as SeasonProjection);
        }
    } catch (error) {
        console.error("Webhook processing error:", error);

        if (error instanceof Error) {
            return new Response(`Server error: ${error.message}`, { status: 500 });
        }

        return new Response("Unknown server error", { status: 500 });
    }
}

async function handleLiveStreamChange(streamUpdate: LiveStreamProjection) {
    if (!streamUpdate?.name || !streamUpdate.game || !streamUpdate._id || !streamUpdate._rev) {
        return new Response("Missing required fields", { status: 400 });
    }

    const previousRevision = await getPreviousRevision(streamUpdate._id, streamUpdate._rev);
    const changes = detectLiveStreamChanges(
        streamUpdate,
        previousRevision as LiveStreamProjection | null,
    );

    if (changes.length > 0) {
        const response = await sendDiscordLiveStreamEmbed(streamUpdate, changes);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Discord webhook error:", errorText);
            return new Response(`Discord webhook failed: ${errorText}`, { status: 500 });
        }

        console.log(
            `Successfully sent Discord notification for stream ${streamUpdate.game} - ${streamUpdate.name}`,
        );
    }

    return NextResponse.json({
        status: 202,
        message: "LiveStream webhook processed successfully",
        timestamp: new Date().toISOString(),
        changesDetected: changes.length,
        changes: changes.map((c) => ({ type: c.type })),
        discordSent: changes.length > 0,
        webhooksSent: false, // TODO: implement webhook receivers
    });
}

async function handleSeasonChange(seasonUpdate: SeasonProjection) {
    if (!seasonUpdate?.name || !seasonUpdate.game || !seasonUpdate._id || !seasonUpdate._rev) {
        return new Response("Missing required fields", { status: 400 });
    }

    const previousRevision = await getPreviousRevision(seasonUpdate._id, seasonUpdate._rev);

    const changes = detectSeasonChanges(seasonUpdate, previousRevision);

    if (changes.length > 0) {
        const response = await sendDiscordSeasonEmbed(seasonUpdate, changes);

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
        changes: changes.map((c) => ({ type: c.type })),
        discordSent: changes.length > 0,
        webhooksSent: false, // TODO: implement webhook receivers
    });
}
