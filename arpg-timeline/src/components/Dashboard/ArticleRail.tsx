"use client";

import Link from "next/link";

import { ArticleFeedItem } from "@/components/articles/ArticleFeedItem";
import { articleToFeedItem } from "@/lib/articles/feedItem";
import type { RankedArticle } from "@/lib/articles/rankArticles";

/** Rows that fit beside the collapsed Timeline without scrolling. */
export const ARTICLE_RAIL_SIZE = 3;

/**
 * Compact article list for the extras band. Height-matched to the collapsed
 * Timeline (max-h-[272px]) so the band keeps one silhouette.
 */
export const ArticleRail = ({ articles }: { articles: RankedArticle[] }) => (
    <div className="bg-card text-card-foreground relative flex max-h-[272px] min-h-auto! min-w-0 flex-col gap-2 rounded-md border p-4">
        <h3 className="mb-1.5 text-xs">Latest</h3>
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
            {articles.map(({ article }) => (
                <ArticleFeedItem
                    key={article._id}
                    item={articleToFeedItem(article)}
                    variant="rail"
                    data-sa-click="dashboard-article-rail"
                />
            ))}
        </div>
        <Link
            href="/news"
            className="text-muted-foreground hover:text-foreground mt-auto shrink-0 self-end text-xs transition-colors"
            data-sa-click="dashboard-article-rail-all"
        >
            All news →
        </Link>
    </div>
);
