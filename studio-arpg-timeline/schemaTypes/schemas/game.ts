import { ALL_FIELDS_GROUP, defineField, defineType, type Rule } from "sanity";
export default defineType({
    name: "game",
    title: "Game",
    type: "document",
    groups: [
        { name: "main", title: "Main", default: true },
        { name: "platforms", title: "Platforms" },
        { name: "toggles", title: "Toggles" },
        {
            ...ALL_FIELDS_GROUP,
            hidden: true,
        },
    ],
    fields: [
        {
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule: Rule) => Rule.required(),
            group: "main",
        },
        {
            name: "shortName",
            title: "Short name",
            type: "string",
            group: "main",
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
            group: "main",
        },
        {
            name: "seasonKeyword",
            title: "Season keyword",
            type: "string",
            validation: (Rule: Rule) => Rule.required(),
            group: "main",
        },

        {
            name: "official",
            title: "Official",
            description: "Is this an official game/ladder?",
            type: "boolean",
            initialValue: true,
            validation: (Rule: Rule) => Rule.required(),
            group: "toggles",
        },
        {
            name: "isComingSoon",
            title: "Coming Soon",
            description: "Is this game prior to release?",
            type: "boolean",
            initialValue: false,
            group: "toggles",
        },
        {
            name: "isDormant",
            title: "Dormant",
            description: "Has this game stopped getting regular content updates?",
            type: "boolean",
            initialValue: false,
            group: "toggles",
        },
        {
            name: "isSeasonal",
            title: "Seasonal",
            description: "Does this game have regular seasons?",
            type: "boolean",
            initialValue: true,
            group: "toggles",
        },

        {
            name: "group",
            title: "Group",
            type: "string",
            group: "main",
        },
        {
            name: "logo",
            title: "Logo",
            type: "image",
            options: {
                hotspot: true,
            },
            validation: (Rule: Rule) => Rule.required(),
            group: "main",
        },
        {
            name: "url",
            title: "URL",
            type: "url",
            group: "main",
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
            group: "platforms",
        },
        defineField({
            name: "youtube",
            title: "YouTube",
            group: "platforms",
            type: "object",
            fields: [
                defineField({
                    name: "channel",
                    title: "Official channel",
                    type: "string",
                }),
            ],
        }),
        defineField({
            name: "twitch",
            title: "Twitch",
            group: "platforms",
            type: "object",
            fields: [
                defineField({
                    name: "category",
                    title: "Category slug",
                    description:
                        "Name of category where all streams related to this game are aggregated",
                    type: "string",
                }),
                defineField({
                    name: "channel",
                    title: "Official channel",
                    type: "string",
                }),
            ],
        }),
        defineField({
            name: "steam",
            title: "Steam",
            group: "platforms",
            type: "object",
            fields: [
                defineField({
                    name: "appId",
                    title: "Steam App ID",
                    type: "number",
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: "name",
            media: "logo",
        },
    },
});
