import type { Rule } from "sanity";

// Ordered least → most AI involvement; the site shows this as a 0–4 scale.
const AI_DISCLOSURE_OPTIONS = [
    { title: "None - written entirely by a human", value: "none" },
    { title: "Styling - AI used for formatting / layout only", value: "styling" },
    { title: "Assisted - AI research / outline, human-written", value: "assisted" },
    { title: "Redacted - AI-generated, human-reviewed & edited", value: "redacted" },
    { title: "Fully generated - AI-generated, minimal human review", value: "fully-generated" },
];

export default {
    name: "article",
    title: "Article",
    type: "document",
    groups: [
        { name: "main", title: "Content", default: true },
        { name: "seo", title: "SEO" },
    ],
    fields: [
        {
            name: "title",
            title: "Title",
            type: "string",
            group: "main",
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            group: "main",
            options: {
                source: "title",
                maxLength: 96,
                // Unique within the same (category, game) namespace - that pair maps 1:1
                // to a URL prefix, so a slug may legitimately repeat across namespaces.
                isUnique: async (slug: string, context: any) => {
                    const { document, getClient } = context;
                    if (!document) return true;
                    const client = getClient({ apiVersion: "2024-01-01" });
                    const id = String(document._id).replace(/^drafts\./, "");
                    const params = {
                        draft: `drafts.${id}`,
                        published: id,
                        slug,
                        category: document.category ?? null,
                        gameRef: document.game?._ref ?? null,
                    };
                    const query = `!defined(*[
                        _type == "article" &&
                        !(_id in [$draft, $published]) &&
                        slug.current == $slug &&
                        category == $category &&
                        (
                            (defined($gameRef) && game._ref == $gameRef) ||
                            (!defined($gameRef) && !defined(game))
                        )
                    ][0]._id)`;
                    return client.fetch(query, params);
                },
            },
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "publishedAt",
            title: "Published at",
            type: "datetime",
            group: "main",
            initialValue: () => new Date().toISOString(),
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "updatedAt",
            title: "Last modified at",
            description:
                "Optional. The visible “Updated” date and structured-data dateModified use this when set, otherwise the document’s own last-edit time.",
            type: "datetime",
            group: "main",
        },
        {
            name: "category",
            title: "Category",
            type: "string",
            group: "main",
            initialValue: "news",
            options: {
                list: [
                    { title: "News", value: "news" },
                    { title: "Resources", value: "resources" },
                ],
                layout: "radio",
            },
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "game",
            title: "Game",
            description:
                "Optional. When set, the article lives under /game/{slug}/{category}/… and is scoped to that game.",
            type: "reference",
            to: [{ type: "game" }],
            group: "main",
        },
        {
            name: "excerpt",
            title: "Excerpt",
            description: "Short summary used on cards and as the meta-description fallback.",
            type: "text",
            rows: 3,
            group: "main",
            validation: (Rule: Rule) => Rule.required().max(200),
        },
        {
            name: "coverImage",
            title: "Cover image",
            type: "image",
            group: "main",
            options: { hotspot: true },
            fields: [
                {
                    name: "alt",
                    title: "Alt text",
                    type: "string",
                    validation: (Rule: Rule) => Rule.required(),
                },
                {
                    name: "caption",
                    title: "Caption (shown below the image)",
                    type: "string",
                },
            ],
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "body",
            title: "Body",
            type: "array",
            group: "main",
            of: [
                {
                    type: "block",
                    styles: [
                        { title: "Normal", value: "normal" },
                        { title: "Heading 2", value: "h2" },
                        { title: "Heading 3", value: "h3" },
                        { title: "Heading 4", value: "h4" },
                        { title: "Quote", value: "blockquote" },
                    ],
                    lists: [
                        { title: "Bulleted", value: "bullet" },
                        { title: "Numbered", value: "number" },
                    ],
                    marks: {
                        decorators: [
                            { title: "Strong", value: "strong" },
                            { title: "Emphasis", value: "em" },
                            { title: "Code", value: "code" },
                            { title: "Underline", value: "underline" },
                            { title: "Strikethrough", value: "strike-through" },
                        ],
                        annotations: [
                            {
                                name: "link",
                                type: "object",
                                title: "Link",
                                fields: [
                                    {
                                        name: "href",
                                        type: "url",
                                        title: "URL",
                                        validation: (Rule: Rule) =>
                                            Rule.required().uri({
                                                scheme: ["http", "https", "mailto"],
                                            }),
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    type: "image",
                    name: "image",
                    title: "Image",
                    options: { hotspot: true },
                    fields: [
                        {
                            name: "alt",
                            title: "Alt text",
                            type: "string",
                            validation: (Rule: Rule) => Rule.required(),
                        },
                        {
                            name: "caption",
                            title: "Caption (shown below the image)",
                            type: "string",
                        },
                    ],
                },
                {
                    type: "object",
                    name: "callout",
                    title: "Callout",
                    fields: [
                        {
                            name: "tone",
                            title: "Tone",
                            type: "string",
                            initialValue: "info",
                            options: {
                                list: [
                                    { title: "Info", value: "info" },
                                    { title: "Warning", value: "warning" },
                                    { title: "Tip", value: "tip" },
                                ],
                                layout: "radio",
                            },
                            validation: (Rule: Rule) => Rule.required(),
                        },
                        {
                            name: "body",
                            title: "Content",
                            type: "array",
                            of: [{ type: "block" }],
                            validation: (Rule: Rule) => Rule.required(),
                        },
                    ],
                    preview: {
                        select: { tone: "tone", body: "body" },
                        prepare(selection: { tone?: string; body?: any[] }) {
                            const { tone, body } = selection;
                            const first = Array.isArray(body) ? body[0] : undefined;
                            const text =
                                first?.children?.map((c: { text?: string }) => c.text).join("") ??
                                "";
                            return {
                                title: `Callout${tone ? ` · ${tone}` : ""}`,
                                subtitle: text,
                            };
                        },
                    },
                },
                {
                    type: "object",
                    name: "embed",
                    title: "Embed (YouTube)",
                    fields: [
                        {
                            name: "url",
                            title: "YouTube URL",
                            type: "url",
                            validation: (Rule: Rule) =>
                                Rule.required().custom((url: unknown) => {
                                    if (typeof url !== "string" || url.length === 0)
                                        return "Required";
                                    return /(?:youtube\.com|youtu\.be)\//.test(url)
                                        ? true
                                        : "Only YouTube URLs are supported for now";
                                }),
                        },
                    ],
                    preview: {
                        select: { url: "url" },
                        prepare(selection: { url?: string }) {
                            return { title: "YouTube embed", subtitle: selection.url };
                        },
                    },
                },
                // Registered by the `table()` plugin in sanity.config.tsx.
                // Shape: { _type: "table", rows: [{ _key, cells: string[] }] };
                // first row is rendered as the header on the site.
                { type: "table" },
            ],
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "aiDisclosure",
            title: "AI-usage disclosure",
            description:
                "How much AI was involved in writing this article. Shown on the page as a 0–4 scale with a tooltip.",
            type: "string",
            group: "main",
            initialValue: "none",
            options: { list: AI_DISCLOSURE_OPTIONS, layout: "radio" },
            validation: (Rule: Rule) => Rule.required(),
        },
        {
            name: "seoTitle",
            title: "SEO title",
            description: "Falls back to the article title.",
            type: "string",
            group: "seo",
        },
        {
            name: "seoDescription",
            title: "SEO description",
            description: "Falls back to the excerpt.",
            type: "text",
            rows: 3,
            group: "seo",
        },
        {
            name: "ogImage",
            title: "Social share image",
            description: "Falls back to the cover image.",
            type: "image",
            group: "seo",
            options: { hotspot: true },
        },
    ],
    preview: {
        select: {
            title: "title",
            category: "category",
            game: "game.name",
            media: "coverImage",
        },
        prepare(selection: { title?: string; category?: string; game?: string }) {
            const { title, category, game } = selection;
            const scope = game ? `${game} · ${category}` : category;
            return { title, subtitle: scope };
        },
    },
    orderings: [
        {
            title: "Published (newest first)",
            name: "publishedAtDesc",
            by: [{ field: "publishedAt", direction: "desc" }],
        },
    ],
};
