"use client";

import { Calendar, ExternalLink } from "lucide-react";
import { SanityImageAssetDocument } from "next-sanity";

import { SanityImage } from "@/components/SanityImage";
import { Game } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";
import { SteamNewsItem } from "@/lib/steam/getSteamNews";
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
}: Omit<SteamNewsSectionProps, "games" | "category">) => {
    return (
        <div className={className}>
            <h2 className="font-heading sr-only mb-6 text-2xl">Latest News</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gamesNews.map((gameNews) => (
                    <article
                        key={gameNews.gameSlug + gameNews.news.title + gameNews.news.pubDate}
                        className="group bg-card text-card-foreground hover:border-border rounded-lg border p-2 hover:shadow-lg md:p-4"
                    >
                        <a
                            href={addUTM(gameNews.news.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-muted/20 block rounded-md border border-transparent p-3 transition-all"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 md:gap-4">
                                    {gameNews.gameLogo && (
                                        <div className="h-12 w-12 flex-shrink-0 rounded lg:h-16 lg:w-16">
                                            <SanityImage
                                                loading="lazy"
                                                src={gameNews.gameLogo}
                                                alt={`${gameNews.gameName} logo`}
                                                width={72}
                                                height={72}
                                                objectFit="contain"
                                                className="h-full w-full"
                                            />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-foreground group-hover:text-primary mb-1 text-xs font-bold">
                                                    {gameNews.gameName}
                                                </h3>
                                                <h4
                                                    className="text-foreground group-hover:text-primary text-md group-hover:decoration-primary leading-tight font-semibold text-pretty transition-colors group-hover:underline"
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
                                    <p className="text-foreground line-clamp-4 text-sm leading-relaxed">
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
