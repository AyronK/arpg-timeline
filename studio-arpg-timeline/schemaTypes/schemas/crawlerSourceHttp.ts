import type { Rule } from "sanity";
export default {
    name: "crawlerSourceHttp",
    title: "Crawler HTTP Source",
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
            name: "source",
            title: "Source URL",
            type: "string",
            validation: (Rule: Rule) => Rule.required().max(3),
        },
    ],
    preview: {
        select: {
            title: "game.name",
            subtitle: "source",
        },
        prepare(selection: { title: any; subtitle: any }) {
            const { title, subtitle } = selection;
            return {
                title: `HTTP source | ${title}`,
                subtitle: subtitle,
            };
        },
    },
};
