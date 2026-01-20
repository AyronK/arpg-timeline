import { PortableText, PortableTextBlock, PortableTextReactComponents } from "@portabletext/react";

import { cn } from "@/lib/utils";

export const portableTextComponents: Partial<PortableTextReactComponents> = {
    block: {
        h1: ({ children }) => <h1 className="mb-6 text-4xl leading-tight font-bold">{children}</h1>,
        h2: ({ children }) => (
            <h2 className="mb-5 text-3xl leading-tight font-semibold">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="mb-4 text-2xl leading-tight font-semibold">{children}</h3>
        ),
        h4: ({ children }) => (
            <h4 className="mb-3 text-xl leading-tight font-semibold">{children}</h4>
        ),

        normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,

        blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-gray-300 pl-6 text-gray-600 italic">
                {children}
            </blockquote>
        ),
    },

    list: {
        bullet: ({ children }) => (
            <ul className="mb-4 list-inside list-disc space-y-2">{children}</ul>
        ),
        number: ({ children }) => (
            <ol className="mb-4 list-inside list-decimal space-y-2">{children}</ol>
        ),
    },

    listItem: {
        bullet: ({ children }) => <li className="ml-4">{children}</li>,
        number: ({ children }) => <li className="ml-4">{children}</li>,
    },

    marks: {
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => <code className="font-mono">{children}</code>,
        underline: ({ children }) => <u className="underline">{children}</u>,
        strikethrough: ({ children }) => <del className="line-through">{children}</del>,

        link: ({ value, children }) => {
            const target = (value?.href || "").startsWith("http") ? "_blank" : undefined;
            return (
                <a
                    href={value?.href}
                    target={target}
                    rel={target === "_blank" ? "noindex nofollow" : undefined}
                    className="underline transition-all hover:brightness-150"
                >
                    {children}
                </a>
            );
        },
    },

    unknownType: ({ value }) => {
        console.warn("Unknown portable text type:", value._type);
        return (
            <div className="my-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                Unknown type: {value._type}
            </div>
        );
    },

    unknownMark: ({ markType, children }) => {
        console.warn("Unknown portable text mark:", markType);
        return <span className="bg-yellow-200">{children}</span>;
    },
};

export function RichTextRenderer({ content }: { content: PortableTextBlock[] }) {
    if (!content) {
        return null;
    }

    return (
        <div className="prose prose-lg max-w-none">
            <PortableText value={content} components={portableTextComponents} />
        </div>
    );
}

export function StyledRichText({
    content,
    className = "",
}: {
    content: PortableTextBlock[];
    className?: string | undefined;
}) {
    return (
        <div className={cn("rich-text-content", className)}>
            <PortableText value={content} components={portableTextComponents} />
        </div>
    );
}
