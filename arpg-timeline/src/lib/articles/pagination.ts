export const ARTICLES_PER_PAGE = 12;

export const parsePageParam = (value?: string | string[]): number => {
    const raw = Array.isArray(value) ? value[0] : value;
    // Digits only: "2.0", "+2", "2e0" must not resolve to a page.
    if (!raw || !/^[0-9]+$/.test(raw)) return 1;
    const n = Number(raw);
    return n >= 1 ? n : 1;
};

// Path form (not `?page=`) so index routes stay statically generable.
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
