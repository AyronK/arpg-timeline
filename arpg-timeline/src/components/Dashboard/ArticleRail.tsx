"use client";

import Link from "next/link";

import { ArticleFeedItem } from "@/components/articles/ArticleFeedItem";
import { articleToFeedItem } from "@/lib/articles/feedItem";
import type { RankedArticle } from "@/lib/articles/rankArticles";

/** Height-matched to the collapsed Timeline so the band keeps one silhouette. */
export const ArticleRail = ({ articles }: { articles: RankedArticle[] }) => (
    <div className="bg-card text-card-foreground relative flex max-h-[272px] min-w-0 flex-1 flex-col gap-2 rounded-md border p-4">
        <h3 className="shrink-0 text-xs">Latest articles</h3>
        <div className="scrollbar scrollbar-thumb-muted-foreground scrollbar-track-muted scrollbar-w-1.5 -mr-2 flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto pr-2">
            {articles.map(({ article }) => (
                <ArticleFeedItem
                    key={article._id}
                    item={articleToFeedItem(article)}
                    variant="rail"
                    className="shrink-0"
                    data-sa-click="dashboard-article-rail"
                />
            ))}
        </div>
        <Link
            href="/news"
            className="text-muted-foreground hover:text-foreground shrink-0 self-end text-xs transition-colors"
            data-sa-click="dashboard-article-rail-all"
        >
            All news →
        </Link>
    </div>
);
