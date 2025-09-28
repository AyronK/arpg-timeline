"use client";

import { Calendar, ExternalLink } from "lucide-react";
import { SanityImageAssetDocument } from "next-sanity";
import { useMemo } from "react";

import { SanityImage } from "@/components/SanityImage";
import { useGameFilters } from "@/hooks/useGameFilters";
import { Game } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";
import { SteamNewsItem } from "@/lib/steam/getSteamNews";
import { cn } from "@/lib/utils";
import { addUTMParameters } from "@/lib/utm";

interface GameNewsItem {
    gameSlug: string;
    gameName: string;
    steamAppId: number;
    news: SteamNewsItem;
    gameLogo?: SanityImageAssetDocument;
}

interface SteamNewsSectionProps {
    gamesNews: GameNewsItem[];
    className?: string;
    games: Game[];
    category: GameFilterCategory;
}

const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_content: "dashboard_steam_news",
});

export const GameNewsSection = ({
    gamesNews,
    className,
    games,
    category,
}: SteamNewsSectionProps) => {
    const { filteredGames } = useGameFilters(games, category);

    const filteredGamesNews = useMemo(
        () =>
            gamesNews.filter((gameNews) =>
                filteredGames.some((game) => game.slug === gameNews.gameSlug),
            ),
        [gamesNews, filteredGames],
    );

    if (filteredGamesNews.length === 0) {
        return (
            <div className={cn("bg-card text-card-foreground rounded-lg border p-6", className)}>
                <h2 className="font-heading mb-4 text-2xl">Latest News</h2>
                <p className="text-muted-foreground">No recent news available for any games.</p>
            </div>
        );
    }

    return (
        <div className={cn("bg-card text-card-foreground rounded-lg border p-6", className)}>
            <h2 className="font-heading mb-6 text-2xl">Latest News</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGamesNews.map((gameNews) => (
                    <article key={gameNews.gameSlug} className="group">
                        <a
                            href={addUTM(gameNews.news.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-muted/20 hover:bg-muted/40 hover:border-border block rounded-md border border-transparent p-3 transition-all hover:shadow-lg sm:p-4"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 sm:items-center">
                                    {gameNews.gameLogo && (
                                        <div className="flex-shrink-0 rounded sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                                            <SanityImage
                                                loading="lazy"
                                                src={gameNews.gameLogo}
                                                alt={`${gameNews.gameName} logo`}
                                                width={56}
                                                height={56}
                                                objectFit="contain"
                                                className="h-full w-full"
                                            />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-foreground group-hover:text-primary mb-1 text-sm font-semibold">
                                                    {gameNews.gameName}
                                                </h3>
                                                <h4
                                                    className="text-foreground group-hover:text-primary line-clamp-2 text-sm leading-tight font-medium transition-colors"
                                                    dangerouslySetInnerHTML={{
                                                        __html: gameNews.news.title,
                                                    }}
                                                />
                                            </div>
                                            <ExternalLink className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    <time dateTime={gameNews.news.pubDate}>
                                        {new Date(gameNews.news.pubDate).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            },
                                        )}
                                    </time>
                                </div>

                                {gameNews.news.description && (
                                    <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                                        {gameNews.news.description}
                                    </p>
                                )}
                            </div>
                        </a>
                    </article>
                ))}
            </div>
        </div>
    );
};
