import { urlForImage } from "@/components/SanityImage";

import { capitalizeFirstChar } from "../../../../lib/capitalizeFirstChar";
import { formatDiscordDate } from "../../../../lib/discord/formatDiscordDate";
import { addUTM } from "../addUTM";
import { DetectedChange, LiveStreamProjection, SeasonProjection } from "../sanity";

function createDiscordSeasonEmbed(seasonUpdate: SeasonProjection, changes: DetectedChange[]) {
    const fields = [];

    if (seasonUpdate.start?.confirmed && seasonUpdate.start.startDate) {
        fields.push({
            name: `🚀 ${capitalizeFirstChar(seasonUpdate.seasonKeyword)} ${new Date(seasonUpdate.start.startDate) > new Date() ? "Starts" : "Started"}`,
            value: `${formatDiscordDate(new Date(seasonUpdate.start.startDate), "f")}\n(${formatDiscordDate(new Date(seasonUpdate.start.startDate))})`,
            inline: true,
        });
    }

    if (seasonUpdate.end?.confirmed && seasonUpdate.end.endDate) {
        fields.push({
            name: `🏁 ${capitalizeFirstChar(seasonUpdate.seasonKeyword)} Ends`,
            value: `${formatDiscordDate(new Date(seasonUpdate.end.endDate), "f")}\n(${formatDiscordDate(new Date(seasonUpdate.end.endDate))})`,
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

    if (changes.length > 0) {
        const changeDescriptions = changes.map((change) => `- ${change.discordMessage}`).join("\n");
        fields.push({
            name: "🔄 What changed",
            value:
                changeDescriptions.length > 1024
                    ? changeDescriptions.substring(0, 1021) + "..."
                    : changeDescriptions,
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
            text: "arpg-timeline.com",
        },
        url: addUTM(seasonUpdate.gameUrl ?? "https://www.arpg-timeline.com"),
        timestamp: new Date().toISOString(),
        thumbnail: { url: urlForImage(seasonUpdate.thumbnail)?.width(200).url() },
        author: {
            name: "aRPG Timeline | Event News",
            url: addUTM("https://www.arpg-timeline.com"),
            icon_url: "https://www.arpg-timeline.com/favicon-192.png",
        },
    };

    return embed;
}

function createLiveStreamDiscordEmbed(
    streamUpdate: LiveStreamProjection,
    changes: DetectedChange[],
) {
    const fields = [];

    fields.push({
        name: "📺 Stream Date",
        value: `${formatDiscordDate(new Date(streamUpdate.date), "f")},\n(${formatDiscordDate(new Date(streamUpdate.date))}) live on [twitch.tv/${streamUpdate.twitchUrl}](https://twitch.tv/${streamUpdate.twitchUrl})`,
        inline: true,
    });

    if (changes.length > 0) {
        const changeDescriptions = changes.map((change) => `• ${change.discordMessage}`).join("\n");
        fields.push({
            name: "🔄 What Changed",
            value:
                changeDescriptions.length > 1024
                    ? changeDescriptions.substring(0, 1021) + "..."
                    : changeDescriptions,
            inline: false,
        });
    }

    return {
        title: `${streamUpdate.game}`,
        description: `**${streamUpdate.name}**`,
        color: streamUpdate.color ? parseInt(streamUpdate.color.replace("#", ""), 16) : 0x7289da,
        fields: fields,
        footer: {
            text: "twitch.tv • arpg-timeline.com",
        },
        url: addUTM(streamUpdate.gameUrl ?? "https://www.arpg-timeline.com"),
        timestamp: new Date().toISOString(),
        thumbnail: { url: urlForImage(streamUpdate.thumbnail)?.width(200).url() },
        author: {
            name: "aRPG Timeline | Stream Updates",
            url: addUTM("https://www.arpg-timeline.com"),
            icon_url: "https://www.arpg-timeline.com/favicon-192.png",
        },
    };
}

export async function sendDiscordSeasonEmbed(
    seasonUpdate: SeasonProjection,
    changes: DetectedChange[],
) {
    const embed = createDiscordSeasonEmbed(seasonUpdate, changes);

    const discordPayload = {
        username: "aRPG Timeline Bot",
        avatar_url: "https://www.arpg-timeline.com/favicon-192.png",
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

    return response;
}

export async function sendDiscordLiveStreamEmbed(
    streamUpdate: LiveStreamProjection,
    changes: DetectedChange[],
) {
    const embed = createLiveStreamDiscordEmbed(streamUpdate, changes);

    const discordPayload = {
        username: "aRPG Timeline Bot",
        avatar_url: "https://www.arpg-timeline.com/favicon-192.png",
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

    return response;
}
