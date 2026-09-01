import Link from "next/link";

import { buildPageHref, getPageTokens } from "@/lib/articles/pagination";
import { cn } from "@/lib/utils";

interface ArticlePaginationProps {
    basePath: string;
    page: number;
    pageCount: number;
}

const linkClass =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm transition-colors";

export const ArticlePagination = ({ basePath, page, pageCount }: ArticlePaginationProps) => {
    if (pageCount <= 1) return null;

    const tokens = getPageTokens(page, pageCount);

    return (
        <nav
            aria-label="Pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
            {page > 1 ? (
                <Link
                    href={buildPageHref(basePath, page - 1)}
                    rel="prev"
                    className={cn(linkClass, "hover:bg-muted")}
                >
                    Previous
                </Link>
            ) : (
                <span className={cn(linkClass, "opacity-40")} aria-hidden>
                    Previous
                </span>
            )}

            {tokens.map((token, i) =>
                token === "ellipsis" ? (
                    <span key={`e${i}`} className="text-muted-foreground px-1 text-sm">
                        …
                    </span>
                ) : (
                    <Link
                        key={token}
                        href={buildPageHref(basePath, token)}
                        aria-current={token === page ? "page" : undefined}
                        className={cn(
                            linkClass,
                            token === page
                                ? "border-primary bg-primary text-primary-foreground"
                                : "hover:bg-muted",
                        )}
                    >
                        {token}
                    </Link>
                ),
            )}

            {page < pageCount ? (
                <Link
                    href={buildPageHref(basePath, page + 1)}
                    rel="next"
                    className={cn(linkClass, "hover:bg-muted")}
                >
                    Next
                </Link>
            ) : (
                <span className={cn(linkClass, "opacity-40")} aria-hidden>
                    Next
                </span>
            )}
        </nav>
    );
};
