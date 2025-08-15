import { type NextRequest, NextResponse } from "next/server";
import { SanityImageAssetDocument } from "next-sanity";
import { parseBody } from "next-sanity/webhook";

import { urlForImage } from "@/components/SanityImage";
import { addUTMParameters } from "@/lib/utm";
import { SeasonEndDateInfo, SeasonStartDateInfo } from "@/queries/indexQuery";

type WebhookProjection = {
    name: string;
    game: string;
    gameUrl: string;
    seasonUrl?: string | null;
    patchNotesUrl?: string | null;
    seasonKeyword: string;
    thumbnail: SanityImageAssetDocument;
    start?: SeasonStartDateInfo;
    end?: SeasonEndDateInfo;
    color: string;
};

const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_content: "discord_embed",
    utm_campaign: "website_update_notification",
    utm_medium: "discord",
});

function formatDate(date: Date): string {
    const timestamp = Math.floor(date.getTime() / 1000);
    return `<t:${timestamp}:R>`;
}
function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function createDiscordEmbed(seasonUpdate: WebhookProjection) {
    const fields = [];

    if (seasonUpdate.start?.confirmed && seasonUpdate.start.startDate) {
        fields.push({
            name: `🚀 ${capitalizeFirst(seasonUpdate.seasonKeyword)} ${new Date(seasonUpdate.start.startDate) > new Date() ? "Starts" : "Started"}`,
            value: formatDate(new Date(seasonUpdate.start.startDate)),
            inline: true,
        });
    }

    if (seasonUpdate.end?.confirmed && seasonUpdate.end.endDate) {
        fields.push({
            name: `🏁 ${capitalizeFirst(seasonUpdate.seasonKeyword)} Ends`,
            value: formatDate(new Date(seasonUpdate.end.endDate)),
            inline: true,
        });
    }

    if (seasonUpdate.patchNotesUrl) {
        fields.push({
            name: "🔗 Links",
            value: `[Patch Notes](${addUTM(seasonUpdate.patchNotesUrl)})`,
            inline: false,
        });
    }

    const embed = {
        title: `${seasonUpdate.game}`,
        description: seasonUpdate.seasonUrl
            ? `**[${seasonUpdate.name}](${addUTM(seasonUpdate.seasonUrl)})**`
            : `**${seasonUpdate.name}**`,
        color: seasonUpdate.color ? parseInt(seasonUpdate.color.replace("#", ""), 16) : 0x7289da,
        fields: fields,
        footer: {
            text: "www.arpg-timeline.com",
        },
        url: addUTM(seasonUpdate.gameUrl ?? "https://www.arpg-timeline.com"),
        timestamp: new Date().toISOString(),
        thumbnail: { url: urlForImage(seasonUpdate.thumbnail)?.width(200).url() },
        author: {
            name: "aRPG Timeline | News",
            url: addUTM("https://www.arpg-timeline.com"),
            icon_url: "https://www.arpg-timeline.com/favicon-192.png",
        },
    };

    return embed;
}

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

        const hasConfirmedUpdates =
            (seasonUpdate.start?.confirmed &&
                seasonUpdate.start.startDate &&
                new Date(seasonUpdate.start.startDate) > new Date()) ||
            (seasonUpdate.end?.confirmed &&
                seasonUpdate.end.endDate &&
                new Date(seasonUpdate.end.endDate) > new Date());

        if (hasConfirmedUpdates) {
            const embed = createDiscordEmbed(seasonUpdate);

            const discordPayload = {
                username: "aRPG Timeline Bot",
                avatar_url: "https://www.arpg-timeline.com/favicon.ico",
                embeds: [embed],
            };

            const response = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "aRPG-Timeline-Bot/1.0",
                },
                body: JSON.stringify(discordPayload),
            });

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
            notificationSent: hasConfirmedUpdates,
            body: seasonUpdate,
        });
    } catch (error) {
        console.error("Webhook processing error:", error);

        if (error instanceof Error) {
            return new Response(`Server error: ${error.message}`, { status: 500 });
        }

        return new Response("Unknown server error", { status: 500 });
    }
}
