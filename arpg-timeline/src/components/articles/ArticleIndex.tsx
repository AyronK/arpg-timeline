import { ReactNode } from "react";

import { ArticleCard } from "@/components/articles/ArticleCard";
import { ArticlePagination } from "@/components/articles/ArticlePagination";
import { Breadcrumbs } from "@/components/articles/Breadcrumbs";
import type { Crumb } from "@/lib/articles/breadcrumbs";
import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";
import { cn } from "@/lib/utils";

interface ArticleIndexProps {
    title: string;
    intro: string;
    crumbs: Crumb[];
    articles: ArticleListItem[];
    basePath: string;
    page: number;
    pageCount: number;
    showGame?: boolean;
    showBreadcrumbs?: boolean;
    // Rendered after the articles; when set, an empty article list is hidden
    extra?: ReactNode;
    emptyText?: string;
    // Replaces emptyText when there are no articles
    emptyState?: ReactNode;
    // Sidebar like the other game hub tabs; articles and extra stack in the main column
    aside?: ReactNode;
    compact?: boolean;
}

export const ArticleIndex = ({
    title,
    intro,
    crumbs,
    articles,
    basePath,
    page,
    pageCount,
    showGame = true,
    showBreadcrumbs = true,
    extra,
    aside,
    compact,
    emptyState,
    emptyText = "No articles here yet - check back soon.",
}: ArticleIndexProps) => {
    const header = (
        // Compact matches the other game hub tabs
        <header className={cn("max-w-2xl", compact ? "mb-6" : "mb-8")}>
            <h1
                className={cn(
                    "font-heading",
                    compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl",
                )}
            >
                {title}
            </h1>
            <p
                className={cn(
                    "text-muted-foreground leading-relaxed",
                    compact ? "mt-2" : "mt-3 text-lg",
                )}
            >
                {intro}
            </p>
        </header>
    );
    const containerClass = cn("relative container mx-auto", compact ? "py-6" : "py-8 md:py-10");

    // Game hub: same main column | sidebar grid as the other tabs; articles, then the feed below
    if (aside) {
        return (
            <div className={containerClass}>
                {showBreadcrumbs && <Breadcrumbs crumbs={crumbs} />}
                <div className="grid items-start gap-4 md:gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-x-12">
                    <div className="flex min-w-0 flex-col gap-10">
                        <div>
                            {header}
                            {articles.length > 0 ? (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {articles.map((article) => (
                                            <ArticleCard
                                                key={article._id}
                                                article={article}
                                                showGame={showGame}
                                            />
                                        ))}
                                    </div>
                                    <ArticlePagination
                                        basePath={basePath}
                                        page={page}
                                        pageCount={pageCount}
                                    />
                                </>
                            ) : (
                                !extra &&
                                (emptyState ?? <p className="text-muted-foreground">{emptyText}</p>)
                            )}
                        </div>
                        {extra}
                    </div>
                    <aside className="xl:sticky xl:top-12">{aside}</aside>
                </div>
            </div>
        );
    }

    return (
        <div className={containerClass}>
            {showBreadcrumbs && <Breadcrumbs crumbs={crumbs} />}

            {header}

            {articles.length === 0 ? (
                extra ? (
                    <div className="max-w-3xl">{extra}</div>
                ) : (
                    (emptyState ?? <p className="text-muted-foreground">{emptyText}</p>)
                )
            ) : (
                // With extra content, articles and extra sit side by side on wide screens
                <div
                    className={cn(
                        extra && "grid gap-10 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]",
                    )}
                >
                    <div className="min-w-0">
                        <div
                            className={cn(
                                "grid gap-4",
                                !compact && "sm:grid-cols-2 lg:grid-cols-3",
                                compact && "sm:grid-cols-3 lg:grid-cols-4",
                                compact &&
                                    (extra
                                        ? "xl:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]"
                                        : "xl:grid-cols-5"),
                            )}
                        >
                            {articles.map((article) => (
                                <ArticleCard
                                    key={article._id}
                                    article={article}
                                    showGame={showGame}
                                />
                            ))}
                        </div>
                        <ArticlePagination basePath={basePath} page={page} pageCount={pageCount} />
                    </div>
                    {extra && <div className="max-w-3xl min-w-0">{extra}</div>}
                </div>
            )}
        </div>
    );
};
