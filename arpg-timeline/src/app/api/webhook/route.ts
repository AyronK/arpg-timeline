import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { detectLiveStreamChanges, detectSeasonChanges } from "./detectChanges";
import { sendDiscordLiveStreamEmbed, sendDiscordSeasonEmbed } from "./discord";
import { getPreviousRevision } from "./sanity";
import { LiveStreamProjection, SeasonProjection, WebhookProjection } from "./types";

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

        const updatedAt =
            "_updatedAt" in body ? (body as { _updatedAt?: string })._updatedAt : undefined;

        if (body._type === "liveStreamTwitch") {
            return handleLiveStreamChange(body as LiveStreamProjection);
        } else {
            return handleSeasonChange(body as SeasonProjection, updatedAt);
        }
    } catch (error) {
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
        if (!response || !response.ok) {
            const errorText = response ? await response.text() : "No response from Discord";
            console.error("Discord webhook error:", errorText);
            return new Response(`Discord webhook failed: ${errorText}`, { status: 202 });
        }
    }

    return NextResponse.json({
        status: 200,
        message: "LiveStream webhook processed successfully",
        timestamp: new Date().toISOString(),
        changesDetected: changes.length,
        changes: changes.map((c) => ({ type: c.type })),
        discordSent: changes.length > 0,
    });
}

async function handleSeasonChange(seasonUpdate: SeasonProjection, updatedAt?: string) {
    if (!seasonUpdate?.name || !seasonUpdate.game || !seasonUpdate._id || !seasonUpdate._rev) {
        return new Response("Missing required fields", { status: 400 });
    }

    const previousRevision = await getPreviousRevision(
        seasonUpdate._id,
        seasonUpdate._rev,
        updatedAt,
    );
    const changes = detectSeasonChanges(seasonUpdate, previousRevision);

    if (changes.length > 0) {
        const response = await sendDiscordSeasonEmbed(seasonUpdate, changes);
        if (!response || !response.ok) {
            const errorText = response ? await response.text() : "No response from Discord";
            console.error("Discord webhook error:", errorText);
            return new Response(`Discord webhook failed: ${errorText}`, { status: 202 });
        }
    }

    return NextResponse.json({
        status: 200,
        message: "Webhook processed successfully",
        timestamp: new Date().toISOString(),
        changesDetected: changes.length,
        changes: changes.map((c) => ({ type: c.type })),
        discordSent: changes.length > 0,
    });
}
