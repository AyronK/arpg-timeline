import type { Rule } from "sanity";

export default {
    name: "supporter",
    title: "Supporter",
    type: "document",
    fields: [
        {
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Active", value: "active" },
                    { title: "Past", value: "past" },
                    { title: "Hall of Fame", value: "hallOfFame" },
                ],
                layout: "radio",
            },
            initialValue: "active",
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "tier",
            title: "Patreon Tier",
            description: "Optional - Hall of Fame entries may not have a Patreon tier.",
            type: "string",
            options: {
                list: [
                    { title: "Magic", value: "magic" },
                    { title: "Rare", value: "rare" },
                    { title: "Exalted", value: "exalted" },
                    { title: "Unique", value: "unique" },
                ],
                layout: "radio",
            },
        },
        {
            name: "url",
            title: "URL",
            description: "Twitch, Twitter, etc. - links the supporter's name on the credits page.",
            type: "url",
        },
        {
            name: "hallOfFameTitle",
            title: "Hall of Fame Title",
            description: 'e.g. "First Supporter", "Stream Partner"',
            type: "string",
            hidden: ({ document }: { document: any }) => document?.status !== "hallOfFame",
            validation: (Rule: Rule) =>
                Rule.custom((value, context) => {
                    if ((context.document as any)?.status === "hallOfFame" && !value) {
                        return "Required for Hall of Fame entries";
                    }
                    return true;
                }),
        },
        {
            name: "hallOfFameNote",
            title: "Hall of Fame Note",
            description: "Short personal note shown on their Hall of Fame card.",
            type: "text",
            rows: 3,
            hidden: ({ document }: { document: any }) => document?.status !== "hallOfFame",
        },
        {
            name: "joinedAt",
            title: "Joined At",
            type: "date",
            validation: (Rule: Rule) => Rule.required(),
        },
    ],
    preview: {
        select: {
            title: "name",
            status: "status",
            tier: "tier",
        },
        prepare(selection: { title: any; status: any; tier: any }) {
            const { title, status, tier } = selection;
            const subtitleMap: Record<string, string> = {
                hallOfFame: "Hall of Fame",
                past: "Past",
                active: tier ?? "Active (no tier)",
            };
            return {
                title,
                subtitle: subtitleMap[status] ?? status,
            };
        },
    },
    orderings: [
        {
            title: "Joined At",
            name: "joinedAtAsc",
            by: [{ field: "joinedAt", direction: "asc" }],
        },
    ],
};
