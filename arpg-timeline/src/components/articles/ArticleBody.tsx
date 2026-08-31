import {
    PortableText,
    type PortableTextBlock,
    type PortableTextComponents,
} from "@portabletext/react";
import { AlertTriangle, Info, Lightbulb } from "lucide-react";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { blockToPlainText, slugifyHeading } from "@/lib/articles/tableOfContents";
import { getYouTubeEmbedUrl, parseYouTubeId } from "@/lib/articles/youtube";
import type { ArticleImage as ArticleImageData } from "@/lib/cms/queries/articleQuery";
import { cn } from "@/lib/utils";

// Must produce the same ids as `extractToc` so TOC anchors resolve.
function buildHeadingIdMap(body: PortableTextBlock[]): Map<string, string> {
    const seen = new Map<string, number>();
    const ids = new Map<string, string>();

    for (const block of body) {
        if (block._type !== "block") continue;
        const style = (block as { style?: string }).style;
        if (style !== "h2" && style !== "h3") continue;
        const text = blockToPlainText(block);
        if (!text) continue;

        const base = slugifyHeading(text) || "section";
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        ids.set(block._key as string, count === 0 ? base : `${base}-${count + 1}`);
    }

    return ids;
}

const linkComponent: NonNullable<PortableTextComponents["marks"]>["link"] = ({
    value,
    children,
}) => {
    const href: string = value?.href ?? "";
    const isExternal = /^https?:\/\//.test(href);
    return (
        <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "nofollow noopener noreferrer" : undefined}
            className="text-primary underline underline-offset-2 transition-all hover:brightness-125"
        >
            {children}
        </a>
    );
};

const sharedMarks: PortableTextComponents["marks"] = {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
        <code className="bg-muted rounded px-1 py-0.5 font-mono text-[0.9em]">{children}</code>
    ),
    underline: ({ children }) => <u>{children}</u>,
    "strike-through": ({ children }) => <del>{children}</del>,
    link: linkComponent,
};

const calloutComponents: PortableTextComponents = {
    block: {
        normal: ({ children }) => <p className="mb-2 leading-relaxed last:mb-0">{children}</p>,
    },
    list: {
        bullet: ({ children }) => <ul className="mb-2 ml-5 list-disc space-y-1">{children}</ul>,
        number: ({ children }) => <ol className="mb-2 ml-5 list-decimal space-y-1">{children}</ol>,
    },
    marks: sharedMarks,
};

const CALLOUT_TONES = {
    info: { icon: Info, className: "border-sky-500/40 bg-sky-500/10" },
    warning: { icon: AlertTriangle, className: "border-amber-500/40 bg-amber-500/10" },
    tip: { icon: Lightbulb, className: "border-emerald-500/40 bg-emerald-500/10" },
} as const;

type CalloutTone = keyof typeof CALLOUT_TONES;

interface TableValue {
    rows?: { _key?: string; cells?: string[] }[];
}

function createComponents(headingIds: Map<string, string>): PortableTextComponents {
    return {
        block: {
            h2: ({ value, children }) => (
                <h2
                    id={headingIds.get(value._key ?? "")}
                    className="font-heading mt-10 mb-4 scroll-mt-24 border-b pb-2 text-2xl md:text-3xl"
                >
                    {children}
                </h2>
            ),
            h3: ({ value, children }) => (
                <h3
                    id={headingIds.get(value._key ?? "")}
                    className="font-heading mt-8 mb-3 scroll-mt-24 text-xl md:text-2xl"
                >
                    {children}
                </h3>
            ),
            h4: ({ children }) => (
                <h4 className="font-heading mt-6 mb-2 text-lg font-semibold">{children}</h4>
            ),
            normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
            blockquote: ({ children }) => (
                <blockquote className="border-primary/60 text-muted-foreground my-6 border-l-4 pl-4 italic">
                    {children}
                </blockquote>
            ),
        },
        list: {
            bullet: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>,
            number: ({ children }) => (
                <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
            ),
        },
        listItem: {
            bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
            number: ({ children }) => <li className="leading-relaxed">{children}</li>,
        },
        marks: sharedMarks,
        types: {
            image: ({ value }) => <ArticleImage image={value as unknown as ArticleImageData} />,
            callout: ({ value }) => {
                const tone: CalloutTone = (["info", "warning", "tip"] as const).includes(
                    value?.tone,
                )
                    ? value.tone
                    : "info";
                const { icon: Icon, className } = CALLOUT_TONES[tone];
                return (
                    <div className={cn("my-6 flex gap-3 rounded-lg border p-4", className)}>
                        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                        <div className="min-w-0 flex-1 text-sm">
                            <PortableText
                                value={value?.body ?? []}
                                components={calloutComponents}
                            />
                        </div>
                    </div>
                );
            },
            embed: ({ value }) => {
                const id = parseYouTubeId(value?.url);
                if (!id) {
                    return (
                        <p className="my-6">
                            <a
                                href={value?.url}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                className="text-primary underline"
                            >
                                {value?.url}
                            </a>
                        </p>
                    );
                }
                return (
                    <div className="my-6 aspect-video w-full overflow-hidden rounded-lg">
                        <iframe
                            src={getYouTubeEmbedUrl(id)}
                            title="YouTube video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                            className="h-full w-full border-0"
                        />
                    </div>
                );
            },
            table: ({ value }) => {
                const rows = (value as TableValue)?.rows ?? [];
                if (rows.length === 0) return null;
                const [head, ...bodyRows] = rows;
                return (
                    <div className="my-6 overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            {head?.cells && (
                                <thead>
                                    <tr>
                                        {head.cells.map((cell, i) => (
                                            <th
                                                key={i}
                                                className="border-border bg-muted border px-3 py-2 text-left font-semibold"
                                            >
                                                {cell}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                            )}
                            <tbody>
                                {bodyRows.map((row, r) => (
                                    <tr key={row._key ?? r}>
                                        {(row.cells ?? []).map((cell, c) => (
                                            <td
                                                key={c}
                                                className="border-border border px-3 py-2 align-top"
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            },
        },
    };
}

export const ArticleBody = ({ body }: { body: PortableTextBlock[] }) => {
    if (!Array.isArray(body) || body.length === 0) return null;
    const headingIds = buildHeadingIdMap(body);
    return (
        <div className="text-base leading-relaxed">
            <PortableText value={body} components={createComponents(headingIds)} />
        </div>
    );
};
