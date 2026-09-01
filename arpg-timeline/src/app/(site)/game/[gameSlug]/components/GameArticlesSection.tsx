import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getArticlePath } from "@/lib/articles/articleUrl";
import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

interface ColumnProps {
    title: string;
    articles: ArticleListItem[];
    indexHref: string;
    seeAllLabel: string;
}

const Column = ({ title, articles, indexHref, seeAllLabel }: ColumnProps) => (
    <div className="bg-card text-card-foreground flex flex-1 flex-col rounded-lg border p-4">
        <div className="border-border mb-4 border-b pb-2">
            <h3 className="font-heading text-foreground text-lg">{title}</h3>
        </div>

        {articles.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nothing published yet.</p>
        ) : (
            <div className="space-y-3">
                {articles.map((article) => {
                    const asset = article.coverImage?.asset;
                    return (
                        <article key={article._id} className="group">
                            <Link
                                href={getArticlePath({
                                    category: article.category,
                                    slug: article.slug,
                                    gameSlug: article.game?.slug,
                                })}
                                className="bg-muted/20 hover:bg-muted/40 hover:border-border flex gap-3 rounded-md border border-transparent p-3 transition-all hover:shadow-lg"
                                data-sa-click="game-article"
                            >
                                <span className="bg-muted relative aspect-video w-24 shrink-0 self-start overflow-hidden rounded sm:w-28">
                                    {asset?.url && (
                                        <Image
                                            src={asset.url}
                                            alt={article.coverImage.alt ?? ""}
                                            fill
                                            sizes="112px"
                                            placeholder={asset.lqip ? "blur" : "empty"}
                                            blurDataURL={asset.lqip}
                                            className="object-cover"
                                        />
                                    )}
                                </span>
                                <span className="min-w-0 flex-1 space-y-2">
                                    <h4 className="text-foreground group-hover:text-primary line-clamp-2 text-sm leading-tight font-semibold transition-colors">
                                        {article.title}
                                    </h4>
                                    <p className="text-muted-foreground flex items-center gap-2 text-xs">
                                        <Calendar className="h-3 w-3 shrink-0" />
                                        <time dateTime={article.publishedAt}>
                                            {formatDate(article.publishedAt)}
                                        </time>
                                    </p>
                                    {article.excerpt && (
                                        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                    )}
                                </span>
                            </Link>
                        </article>
                    );
                })}
            </div>
        )}

        {articles.length > 0 && (
            <div className="border-border mt-auto flex w-full justify-end border-t pt-3">
                <Link
                    href={indexHref}
                    className="text-primary hover:text-primary/80 text-sm"
                    data-sa-click="game-articles-see-all"
                >
                    {seeAllLabel}
                </Link>
            </div>
        )}
    </div>
);

interface GameArticlesSectionProps {
    gameSlug: string;
    news: ArticleListItem[];
    resources: ArticleListItem[];
}

export const GameArticlesSection = ({ gameSlug, news, resources }: GameArticlesSectionProps) => {
    if (news.length === 0 && resources.length === 0) return null;

    return (
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            <Column
                title="News"
                articles={news}
                indexHref={`/game/${gameSlug}/news`}
                seeAllLabel="All news"
            />
            <Column
                title="Guides & Resources"
                articles={resources}
                indexHref={`/game/${gameSlug}/resources`}
                seeAllLabel="All resources"
            />
        </div>
    );
};
