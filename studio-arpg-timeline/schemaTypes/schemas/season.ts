import { defineField, type Rule } from "sanity";
import { TimezoneDateControl } from "../../components/TimezoneDateWidget/Elements/TimezoneDateControl";
export default {
    name: "season",
    title: "Season",
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
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "url",
            title: "URL",
            type: "url",
        },
        {
            name: "patchNotesUrl",
            title: "Patch Notes URL",
            type: "url",
        },
        {
            name: "isSideEvent",
            title: "Side event",
            type: "boolean",
            initialValue: false,
            description: "Side events are excluded from average season duration calculations.",
        },
        {
            name: "logo",
            title: "Logo",
            type: "image",
            options: {
                hotspot: true,
            },
        },
        {
            name: "start",
            title: "Start",
            type: "object",
            fields: [
                defineField({
                    name: "startDate",
                    title: "Start Date UTC",
                    type: "datetime",
                    components: {
                        input: TimezoneDateControl,
                    },
                }),
                {
                    name: "confirmed",
                    title: "Confirmed",
                    type: "boolean",
                    initialValue: false,
                },
                {
                    name: "overrideText",
                    title: "Override text",
                    type: "string",
                },
                {
                    name: "additionalText",
                    title: "Additional text",
                    type: "string",
                },
            ],
        },
        {
            name: "end",
            title: "End",
            type: "object",
            fields: [
                {
                    name: "endDate",
                    title: "End Date UTC",
                    type: "datetime",
                    components: {
                        input: TimezoneDateControl,
                    },
                },
                {
                    name: "confirmed",
                    title: "Confirmed",
                    type: "boolean",
                    initialValue: false,
                },
                {
                    name: "overrideText",
                    title: "Override text",
                    type: "string",
                },
                {
                    name: "additionalText",
                    title: "Additional text",
                    type: "string",
                },
            ],
        },
    ],
    preview: {
        select: {
            title: "name",
            subtitle: "game.name",
        },
        prepare(selection: { title: any; subtitle: any }) {
            const { title, subtitle } = selection;
            return {
                title: `${subtitle} | ${title}`,
            };
        },
    },
    orderings: [
        {
            title: "Name",
            name: "nameAsc",
            by: [{ field: "name", direction: "asc" }],
        },
        {
            title: "Start Date",
            name: "startDateAsc",
            by: [{ field: "start.startDate", direction: "asc" }],
        },
    ],
};
