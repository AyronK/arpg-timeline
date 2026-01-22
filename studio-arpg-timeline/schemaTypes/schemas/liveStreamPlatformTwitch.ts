import type { Rule } from "sanity";
export default {
    name: "liveStreamPlatformTwitch",
    title: "Twitch Platform",
    type: "document",
    fields: [
        {
            name: "game",
            title: "Game",
            type: "reference",
            to: [{ type: "game" }],
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "category",
            title: "Category slug",
            type: "string",
        },
        {
            name: "channel",
            title: "Official channel",
            type: "string",
        },
    ],
    preview: {
        select: {
            title: "game.name",
            subtitle: "category",
        },
        prepare(selection: { title: any; subtitle: any }) {
            const { title, subtitle } = selection;
            return {
                title: `Twitch | ${title}`,
                subtitle: subtitle,
            };
        },
    },
};
