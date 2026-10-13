import { sanitizeNewsDescription } from "@/lib/steam/sanitizeNewsDescription";
import type { GameNewsDbEntry } from "@/types/game-news";

import { feedSource, formatShortDate } from "../../overview";
import { SourceLabel } from "../overview/LatestList";

export const OfficialAnnouncements = ({
    entries,
    gameSlug,
}: {
    entries: GameNewsDbEntry[];
    gameSlug: string;
}) => {
    const steamAppId = entries.find((e) => e.steam_app_id)?.steam_app_id;

    return (
        <section>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <h2 className="font-heading text-xl">Official announcements</h2>
                {steamAppId && (
                    <a
                        href={`https://store.steampowered.com/news/app/${steamAppId}`}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        data-sa-click={`${gameSlug}-news-steam-all`}
                        className="text-muted-foreground hover:text-foreground text-sm whitespace-nowrap hover:underline"
                    >
                        All announcements on Steam →
                    </a>
                )}
            </div>
            <ul className="bg-card divide-foreground/10 divide-y rounded-lg border">
                {entries.map((entry) => (
                    <li
                        key={entry.id}
                        className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4"
                    >
                        <div className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-xs sm:w-32">
                            <SourceLabel source={feedSource(entry.steam_app_id)} />
                            <span aria-hidden>·</span>
                            <time dateTime={entry.pub_date}>{formatShortDate(entry.pub_date)}</time>
                        </div>
                        <div className="min-w-0">
                            <a
                                href={entry.link}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                data-sa-click={`${gameSlug}-news-feed`}
                                className="hover:text-foreground line-clamp-1 text-sm font-medium hover:underline"
                            >
                                {entry.title}
                            </a>
                            {entry.description && (
                                <p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm">
                                    {sanitizeNewsDescription(entry.description)}
                                </p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
};
