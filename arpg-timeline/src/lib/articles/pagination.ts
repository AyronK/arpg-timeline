export const ARTICLES_PER_PAGE = 12;

export const parsePageParam = (value?: string | string[]): number => {
    const raw = Array.isArray(value) ? value[0] : value;
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1) return 1;
    return n;
};

// Path-based so index pages stay statically generable: page 1 is the bare index,
// pages 2+ live at `{basePath}/page/{n}`.
export const buildPageHref = (basePath: string, page: number): string =>
    page <= 1 ? basePath : `${basePath}/page/${page}`;

export type PageToken = number | "ellipsis";

export const getPageTokens = (page: number, pageCount: number): PageToken[] => {
    if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    const tokens: PageToken[] = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(pageCount - 1, page + 1);

    if (start > 2) tokens.push("ellipsis");
    for (let i = start; i <= end; i++) tokens.push(i);
    if (end < pageCount - 1) tokens.push("ellipsis");

    tokens.push(pageCount);
    return tokens;
};
