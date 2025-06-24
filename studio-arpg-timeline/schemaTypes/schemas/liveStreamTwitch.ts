import type { Rule } from "sanity";
import { TimezoneDateControl } from "../../components/TimezoneDateWidget/Elements/TimezoneDateControl";
export default {
    name: "liveStreamTwitch",
    title: "Live Stream (Twitch)",
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
            name: "platform",
            title: "Platform",
            type: "reference",
            to: [{ type: "liveStreamPlatformTwitch" }],
        },
        {
            name: "date",
            title: "Start Date UTC",
            type: "datetime",
            validation: (Rule: Rule) => Rule.required(),
            components: {
                input: TimezoneDateControl,
            },
        },
        {
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule: Rule) => Rule.required(),
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
    ],
    preview: {
        select: {
            title: "name",
            subtitle: "game.name",
            date: "date",
        },
        prepare(selection: { title: any; subtitle: any; date: any }) {
            const { title, subtitle, date } = selection;
            return {
                title: `Twitch stream | ${subtitle} | ${title}`,
                subtitle: date ? new Date(date).toLocaleDateString() : "",
            };
        },
    },
    orderings: [
        {
            title: "Date",
            name: "dateDesc",
            by: [{ field: "date", direction: "desc" }],
        },
        {
            title: "Game",
            name: "gameAsc",
            by: [{ field: "game.name", direction: "asc" }],
        },
        {
            title: "Name",
            name: "nameAsc",
            by: [{ field: "name", direction: "asc" }],
        },
    ],
};
