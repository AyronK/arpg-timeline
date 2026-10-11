import Link from "next/link";

import { formatShortDate, LatestItem } from "../../overview";

const rowClassName = "hover:text-foreground line-clamp-2 text-sm font-medium hover:underline";

export const SourceLabel = ({ source }: { source: LatestItem["source"] }) => (
    <span className="text-foreground/80 text-xs font-medium">{source}</span>
);

export const LatestList = ({ items, gameSlug }: { items: LatestItem[]; gameSlug: string }) => {
    if (items.length === 0) {
        return <p className="text-muted-foreground text-sm">No news yet.</p>;
    }

    return (
        <ul className="divide-foreground/10 divide-y">
            {items.map((item) => (
                <li key={item.key} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <SourceLabel source={item.source} />
                        <span aria-hidden>·</span>
                        <time dateTime={item.date}>{formatShortDate(item.date)}</time>
                    </div>
                    {item.external ? (
                        <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            data-sa-click={`${gameSlug}-latest-feed`}
                            className={rowClassName}
                        >
                            {item.title}
                        </a>
                    ) : (
                        <Link
                            href={item.href}
                            data-sa-click="game-article"
                            className={rowClassName}
                        >
                            {item.title}
                        </Link>
                    )}
                </li>
            ))}
        </ul>
    );
};
