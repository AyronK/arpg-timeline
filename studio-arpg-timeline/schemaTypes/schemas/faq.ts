import type { Rule } from "sanity";
export default {
    name: "faq",
    title: "FAQ",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "content",
            title: "Content",
            type: "array",
            of: [{ type: "block" }],
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "order",
            title: "Order",
            type: "number",
            initialValue: 100,
            validation: (Rule: Rule) => Rule.required(),
        },
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "order",
        },
        prepare(selection: { title: any; subtitle: any }) {
            const { title, subtitle } = selection;
            return {
                title: title,
                subtitle: `Order: ${subtitle}`,
            };
        },
    },
    orderings: [
        {
            title: "Order",
            name: "orderAsc",
            by: [{ field: "order", direction: "asc" }],
        },
    ],
};
