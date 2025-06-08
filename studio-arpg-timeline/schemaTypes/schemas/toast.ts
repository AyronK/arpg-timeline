import type { Rule } from "sanity";
export default {
    name: "toast",
    title: "Toast",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "description",
            title: "Description",
            type: "array",
            of: [{ type: "block" }],
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "withLogo",
            title: "With Logo",
            type: "boolean",
            initialValue: true,
        },
        {
            name: "duration",
            title: "Duration",
            type: "number",
        },
    ],
    preview: {
        select: {
            title: "title",
        },
    },
};
