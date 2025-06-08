import type { Rule } from "sanity";
export default {
    name: "crawlerSourceReddit",
    title: "Crawler Reddit Source",
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
            name: "subreddit",
            title: "Subreddit",
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
            subtitle: "subreddit",
        },
        prepare(selection: { title: any; subtitle: any }) {
            const { title, subtitle } = selection;
            return {
                title: `Reddit source | ${title}`,
                subtitle: `r/${subtitle}`,
            };
        },
    },
};
