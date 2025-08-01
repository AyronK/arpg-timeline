import type { Rule } from "sanity";
export default {
    name: "game",
    title: "Game",
    type: "document",
    fields: [
        {
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "shortName",
            title: "Short name",
            type: "string",
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
                source: "name",
                maxLength: 96,
            },
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "seasonKeyword",
            title: "Season keyword",
            type: "string",
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "official",
            title: "Official",
            description: "Is this an official game/ladder?",
            type: "boolean",
            initialValue: true,
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "isComingSoon",
            title: "Coming Soon",
            description: "Is this game prior to release?",
            type: "boolean",
            initialValue: false,
        },
        {
            name: "isDormant",
            title: "Dormant",
            description: "Has this game stopped getting regular content updates?",
            type: "boolean",
            initialValue: false,
        },
        {
            name: "group",
            title: "Group",
            type: "string",
        },
        {
            name: "logo",
            title: "Logo",
            type: "image",
            options: {
                hotspot: true,
            },
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "url",
            title: "URL",
            type: "url",
        },
        {
            name: "crawlerSettings",
            title: "Crawler settings",
            type: "object",
            fields: [
                {
                    name: "keywords",
                    title: "Keywords",
                    type: "array",
                    of: [{ type: "string" }],
                },
            ],
        },
    ],
    preview: {
        select: {
            title: "name",
            media: "logo",
        },
    },
};
