import type { PortableTextBlock } from "next-sanity";

export interface TocHeading {
    id: string;
    text: string;
    level: 2 | 3;
}

export function slugifyHeading(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export function blockToPlainText(block: PortableTextBlock): string {
    const children = (block as { children?: { text?: string }[] }).children;
    if (!Array.isArray(children)) return "";
    return children
        .map((c) => c.text ?? "")
        .join("")
        .trim();
}

/** H2/H3 headings from the body, with collision-suffixed ids matching `ArticleBody`. */
export function extractToc(body: PortableTextBlock[] | undefined | null): TocHeading[] {
    if (!Array.isArray(body)) return [];

    const seen = new Map<string, number>();
    const headings: TocHeading[] = [];

    for (const block of body) {
        if ((block as { _type?: string })._type !== "block") continue;
        const style = (block as { style?: string }).style;
        if (style !== "h2" && style !== "h3") continue;

        const text = blockToPlainText(block);
        if (!text) continue;

        const base = slugifyHeading(text) || "section";
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        const id = count === 0 ? base : `${base}-${count + 1}`;

        headings.push({ id, text, level: style === "h2" ? 2 : 3 });
    }

    return headings;
}
