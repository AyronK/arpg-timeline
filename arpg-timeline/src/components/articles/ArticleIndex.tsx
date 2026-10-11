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
    compact,
    emptyText = "No articles here yet - check back soon.",
}: ArticleIndexProps) => (
    <div className="relative container mx-auto py-8 md:py-10">
        {showBreadcrumbs && <Breadcrumbs crumbs={crumbs} />}

        <header className="mb-8 max-w-2xl">
            <h1 className="font-heading text-3xl md:text-4xl">{title}</h1>
            <p className="text-muted-foreground mt-3 text-lg leading-relaxed">{intro}</p>
        </header>

        {articles.length === 0 ? (
            extra ? (
                <div className="max-w-3xl">{extra}</div>
            ) : (
                <p className="text-muted-foreground">{emptyText}</p>
            )
        ) : (
            // With extra content, articles and extra sit side by side on wide screens
            <div className={cn(extra && "grid gap-10 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]")}>
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
                            <ArticleCard key={article._id} article={article} showGame={showGame} />
                        ))}
                    </div>
                    <ArticlePagination basePath={basePath} page={page} pageCount={pageCount} />
                </div>
                {extra && <div className="max-w-3xl min-w-0">{extra}</div>}
            </div>
        )}
    </div>
);
