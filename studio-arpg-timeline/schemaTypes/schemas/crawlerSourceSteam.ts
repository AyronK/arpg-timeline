import type { Rule } from "sanity";
export default {
    name: "crawlerSourceSteam",
    title: "Crawler Steam Source",
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
            name: "steamId",
            title: "Steam ID",
            type: "string",
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "crawlDescriptions",
            title: "Crawl RSS Descriptions",
            type: "boolean",
            initialValue: false,
        },
        {
            name: "notifyAboutNews",
            title: "Notify about new RSS messages",
            type: "boolean",
            initialValue: false,
        },
    ],
    preview: {
        select: {
            title: "game.name",
        },
        prepare(selection: { title: any }) {
            const { title } = selection;
            return {
                title: `Steam source | ${title}`,
            };
        },
    },
};
