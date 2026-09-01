import { Calendar, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import { ArticleDate } from "@/components/articles/ArticleDate";
import type { FeedItem } from "@/lib/articles/feedItem";
import { cn } from "@/lib/utils";
import { Chip } from "@/ui/Chip";

export type ArticleFeedItemVariant = "grid" | "rail" | "feed";

interface ArticleFeedItemProps {
    item: FeedItem;
    variant: ArticleFeedItemVariant;
    /** Hide the game chip where the surrounding surface already names the game. */
    showGame?: boolean;
    /** First card in a viewport-visible slot - opt it out of lazy loading. */
    priority?: boolean;
    className?: string;
    "data-sa-click"?: string;
}

const IMAGE_SIZES: Record<ArticleFeedItemVariant, string> = {
    grid: "(min-width: 1536px) 360px, (min-width: 768px) 45vw, 100vw",
    rail: "96px",
    feed: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
};

const Cover = ({
    item,
    variant,
    priority,
    className,
}: Pick<ArticleFeedItemProps, "item" | "variant" | "priority"> & { className?: string }) => (
    <span className={cn("bg-muted relative block overflow-hidden", className)}>
        {item.image && (
            <Image
                src={item.image.url}
                alt={item.image.alt}
                fill
                sizes={IMAGE_SIZES[variant]}
                placeholder={item.image.lqip ? "blur" : "empty"}
                blurDataURL={item.image.lqip}
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                className="object-cover"
            />
        )}
    </span>
);

const Title = ({ item, className }: { item: FeedItem; className?: string }) =>
    item.titleIsHtml ? (
        <span className={className} dangerouslySetInnerHTML={{ __html: item.title }} />
    ) : (
        <span className={className}>{item.title}</span>
    );

const Meta = ({ item, className }: { item: FeedItem; className?: string }) => (
    <span className={cn("text-muted-foreground flex items-center gap-2 text-xs", className)}>
        <Calendar className="h-3 w-3 shrink-0" />
        <ArticleDate iso={item.publishedAt} />
    </span>
);

const Badges = ({ item, showGame }: { item: FeedItem; showGame: boolean }) => {
    const labels = [
        item.source === "steam" ? "Steam" : item.categoryLabel,
        showGame ? item.gameName : null,
    ].filter((l): l is string => !!l);

    if (labels.length === 0) return null;

    return (
        <span className="flex flex-wrap items-center gap-2">
            {labels.map((label) => (
                <Chip key={label} className="bg-muted">
                    {label}
                </Chip>
            ))}
        </span>
    );
};

/**
 * Wraps the card body in the right kind of link. Articles are internal routes;
 * Steam news points off-site.
 */
const FeedLink = ({
    item,
    className,
    saClick,
    children,
}: {
    item: FeedItem;
    className: string;
    saClick: string;
    children: ReactNode;
}) =>
    item.external ? (
        <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={className}
            data-sa-click={saClick}
        >
            {children}
        </a>
    ) : (
        <Link href={item.href} className={className} data-sa-click={saClick}>
            {children}
        </Link>
    );

const shellClassName =
    "group bg-card text-card-foreground hover:border-border overflow-hidden border transition-all hover:shadow-lg";

export const ArticleFeedItem = ({
    item,
    variant,
    showGame = true,
    priority,
    className,
    "data-sa-click": saClick = `article-${variant}`,
}: ArticleFeedItemProps) => {
    if (variant === "rail") {
        return (
            <article className={className}>
                <FeedLink
                    item={item}
                    saClick={saClick}
                    className="group bg-muted/20 hover:bg-muted/40 hover:border-border flex items-center gap-3 rounded-md border border-transparent p-2 leading-snug transition-all hover:shadow-sm"
                >
                    <Cover
                        item={item}
                        variant="rail"
                        priority={priority}
                        className="aspect-video w-20 shrink-0 rounded sm:w-24"
                    />
                    <span className="min-w-0 flex-1">
                        <span className="text-muted-foreground block truncate text-xs">
                            {[showGame ? item.gameName : null, item.categoryLabel]
                                .filter(Boolean)
                                .join(" · ") || (item.source === "steam" ? "Steam" : "")}
                        </span>
                        <Title
                            item={item}
                            className="text-foreground group-hover:text-primary mt-0.5 line-clamp-2 block text-sm font-medium transition-colors"
                        />
                    </span>
                </FeedLink>
            </article>
        );
    }

    if (variant === "feed") {
        return (
            <article className={cn(shellClassName, "rounded-lg", className)}>
                <FeedLink item={item} saClick={saClick} className="flex h-full flex-col">
                    <Cover
                        item={item}
                        variant="feed"
                        priority={priority}
                        className="aspect-[16/9] w-full"
                    />
                    <span className="flex flex-1 flex-col gap-2 p-4">
                        <Badges item={item} showGame={showGame} />
                        <span className="flex items-start justify-between gap-2">
                            <Title
                                item={item}
                                className="font-heading text-foreground group-hover:text-primary text-md leading-snug font-semibold text-pretty transition-colors"
                            />
                            {item.external && (
                                <ExternalLink className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                            )}
                        </span>
                        {item.excerpt && (
                            <span className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                                {item.excerpt}
                            </span>
                        )}
                        <Meta item={item} className="mt-auto pt-1" />
                    </span>
                </FeedLink>
            </article>
        );
    }

    // grid - sized and styled to sit in the dashboard grid beside game cards.
    return (
        <article className={cn(shellClassName, "flex flex-1 rounded-md", className)}>
            <FeedLink item={item} saClick={saClick} className="flex flex-1 flex-col">
                <Cover
                    item={item}
                    variant="grid"
                    priority={priority}
                    className="aspect-[16/9] w-full shrink-0"
                />
                <span className="flex flex-1 flex-col gap-2 p-4">
                    <Badges item={item} showGame={showGame} />
                    <Title
                        item={item}
                        className="font-heading text-foreground group-hover:text-primary text-md leading-snug font-semibold text-pretty transition-colors"
                    />
                    {item.excerpt && (
                        <span className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                            {item.excerpt}
                        </span>
                    )}
                    <Meta item={item} className="mt-auto pt-1" />
                </span>
            </FeedLink>
        </article>
    );
};
