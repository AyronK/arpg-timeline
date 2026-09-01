"use client";

import Image from "next/image";
import Link from "next/link";

import { getArticlePath } from "@/lib/articles/articleUrl";
import type { RankedArticle } from "@/lib/articles/rankArticles";
import type { ArticleCategory } from "@/lib/cms/queries/articleQuery";

const CATEGORY_LABEL: Record<ArticleCategory, string> = {
    news: "News",
    resources: "Resources",
};

/** Height-matched to the collapsed Timeline so the band keeps one silhouette. */
export const ArticleRail = ({ articles }: { articles: RankedArticle[] }) => (
    <div className="bg-card text-card-foreground relative flex max-h-[272px] min-w-0 flex-1 flex-col gap-2 rounded-md border p-4">
        <h3 className="shrink-0 text-xs">Latest articles</h3>
        <div className="scrollbar scrollbar-thumb-muted-foreground scrollbar-track-muted scrollbar-w-1.5 -mr-2 flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto pr-2">
            {articles.map(({ article }) => {
                const asset = article.coverImage?.asset;
                return (
                    <article key={article._id} className="shrink-0">
                        <Link
                            href={getArticlePath({
                                category: article.category,
                                slug: article.slug,
                                gameSlug: article.game?.slug,
                            })}
                            className="group bg-muted/20 hover:bg-accent/50 hover:border-primary/15 flex items-center gap-3 rounded-md border border-transparent p-2 leading-snug transition-colors"
                            data-sa-click="dashboard-article-rail"
                        >
                            <span className="bg-muted relative block aspect-video w-20 shrink-0 overflow-hidden rounded sm:w-24">
                                {asset?.url && (
                                    <Image
                                        src={asset.url}
                                        alt={article.coverImage.alt ?? ""}
                                        fill
                                        sizes="96px"
                                        placeholder={asset.lqip ? "blur" : "empty"}
                                        blurDataURL={asset.lqip}
                                        className="object-cover"
                                    />
                                )}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="text-muted-foreground block truncate text-xs">
                                    {article.game
                                        ? `${article.game.name} · ${CATEGORY_LABEL[article.category]}`
                                        : CATEGORY_LABEL[article.category]}
                                </span>
                                <span className="text-foreground group-hover:text-primary mt-0.5 line-clamp-2 block text-sm font-medium transition-colors">
                                    {article.title}
                                </span>
                            </span>
                        </Link>
                    </article>
                );
            })}
        </div>
        <Link
            href="/news"
            className="text-muted-foreground hover:text-foreground shrink-0 self-end text-xs transition-colors"
            data-sa-click="dashboard-article-rail-all"
        >
            See all →
        </Link>
    </div>
);
