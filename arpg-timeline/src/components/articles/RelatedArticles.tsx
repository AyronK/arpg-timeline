import Image from "next/image";
import Link from "next/link";

import { getArticlePath } from "@/lib/articles/articleUrl";
import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";
import { cn } from "@/lib/utils";

const CATEGORY_LABEL: Record<ArticleListItem["category"], string> = {
    news: "News",
    resources: "Resources",
};

interface RelatedArticlesProps {
    articles: ArticleListItem[];
    className?: string;
}

export const RelatedArticles = ({ articles, className }: RelatedArticlesProps) => {
    if (articles.length === 0) return null;

    return (
        <nav aria-label="Related articles" className={cn("text-sm", className)}>
            <p className="font-heading text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                Related
            </p>
            <ul className="space-y-2">
                {articles.map((article) => {
                    const asset = article.coverImage?.asset;
                    return (
                        <li key={article._id}>
                            <Link
                                href={getArticlePath({
                                    category: article.category,
                                    slug: article.slug,
                                    gameSlug: article.game?.slug,
                                })}
                                className="group bg-card hover:border-border flex items-center gap-3 rounded-lg border p-2 leading-snug transition-all hover:shadow-sm"
                                data-sa-click="related-article"
                            >
                                <span className="bg-muted relative aspect-[16/9] w-20 shrink-0 overflow-hidden rounded">
                                    {asset?.url && (
                                        <Image
                                            src={asset.url}
                                            alt={article.coverImage.alt ?? ""}
                                            fill
                                            sizes="80px"
                                            placeholder={asset.lqip ? "blur" : "empty"}
                                            blurDataURL={asset.lqip}
                                            className="object-cover"
                                        />
                                    )}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="text-muted-foreground block text-xs">
                                        {article.game
                                            ? `${article.game.name} · ${CATEGORY_LABEL[article.category]}`
                                            : CATEGORY_LABEL[article.category]}
                                    </span>
                                    <span className="text-foreground group-hover:text-primary mt-0.5 line-clamp-2 min-h-[2.75em] font-medium transition-colors">
                                        {article.title}
                                    </span>
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
