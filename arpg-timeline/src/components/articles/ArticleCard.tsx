import Image from "next/image";
import Link from "next/link";

import { ArticleDate } from "@/components/articles/ArticleDate";
import { getArticlePath } from "@/lib/articles/articleUrl";
import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";
import { cn } from "@/lib/utils";
import { Chip } from "@/ui/Chip";

const CATEGORY_LABEL: Record<ArticleListItem["category"], string> = {
    news: "News",
    resources: "Resources",
};

const CARD_IMAGE_SIZES = "(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw";

interface ArticleCardProps {
    article: ArticleListItem;
    showGame?: boolean;
    className?: string;
}

export const ArticleCard = ({ article, showGame = true, className }: ArticleCardProps) => {
    const href = getArticlePath({
        category: article.category,
        slug: article.slug,
        gameSlug: article.game?.slug,
    });
    const asset = article.coverImage?.asset;

    return (
        <article
            className={cn(
                "group bg-card text-card-foreground hover:border-border overflow-hidden rounded-lg border transition-all hover:shadow-lg",
                className,
            )}
        >
            <Link href={href} className="block" data-sa-click="article-card">
                <div className="bg-muted relative aspect-[16/9] w-full overflow-hidden">
                    {asset?.url && (
                        <Image
                            src={asset.url}
                            alt={article.coverImage.alt ?? ""}
                            fill
                            sizes={CARD_IMAGE_SIZES}
                            placeholder={asset.lqip ? "blur" : "empty"}
                            blurDataURL={asset.lqip}
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                    )}
                </div>
                <div className="space-y-2 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Chip className="bg-muted">{CATEGORY_LABEL[article.category]}</Chip>
                        {showGame && article.game && (
                            <Chip className="bg-muted">{article.game.name}</Chip>
                        )}
                    </div>
                    <h3 className="font-heading group-hover:text-primary text-lg leading-snug text-pretty transition-colors">
                        {article.title}
                    </h3>
                    {article.excerpt && (
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                            {article.excerpt}
                        </p>
                    )}
                    <p className="text-muted-foreground text-xs">
                        <ArticleDate iso={article.publishedAt} />
                    </p>
                </div>
            </Link>
        </article>
    );
};
