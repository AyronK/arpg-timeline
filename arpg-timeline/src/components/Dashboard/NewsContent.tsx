"use client";

import { usePathname } from "next/navigation";
import { SanityImageAssetDocument } from "next-sanity";
import { useMemo, useState } from "react";

import { GameNewsSection } from "@/components/Dashboard/GameNewsSection";
import { GameFilters } from "@/components/GameFilters";
import { useGameFilterContext } from "@/contexts/GameFilterContext";
import { GameFilterCategory } from "@/lib/cms/gameTags";
import { SteamNewsItem } from "@/lib/steam/getSteamNews";
import { cn } from "@/lib/utils";

import { DashboardSelector } from "./DashboardSelector";
import { GameCountDisplay } from "./GameCountDisplay";
import { MobileBottomMenu } from "./MobileBottomMenu";

interface GameNewsItem {
    gameSlug: string;
    gameName: string;
    steamAppId: number;
    news: SteamNewsItem;
    gameLogo?: SanityImageAssetDocument;
}

interface NewsContentProps {
    gamesNews: GameNewsItem[];
}

export const NewsContent = ({ gamesNews }: NewsContentProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { category, totalGames, shownGames, filteredGames, ...filtersProps } =
        useGameFilterContext();
    const pathname = usePathname();
    const currentCategory = (pathname === "/games/news" ? "news" : category) as
        | GameFilterCategory
        | "news";

    const handleLoadingChange = (loading: boolean) => {
        setIsLoading(loading);
    };

    const filteredGamesNews = useMemo(() => {
        return gamesNews.filter((gameNews) =>
            filteredGames.some((game) => game.slug === gameNews.gameSlug),
        );
    }, [gamesNews, filteredGames]);

    return (
        <>
            <article className="relative mt-2 flex flex-col gap-4 lg:mt-0 lg:gap-0">
                <h2 className="sr-only">Latest Game News</h2>
                <div className="lg:bg-background relative -mt-4 flex flex-col gap-1 lg:sticky lg:top-0 lg:z-10 lg:-mt-2 lg:py-4">
                    <div className="hidden lg:block">
                        <GameCountDisplay shownGames={shownGames} totalGames={totalGames} />
                    </div>
                    <div className="hidden lg:flex lg:flex-row lg:items-end lg:gap-4">
                        <DashboardSelector
                            key={currentCategory}
                            category={category}
                            onLoadingChange={handleLoadingChange}
                        />
                        <GameFilters {...filtersProps} disabled={false} />
                    </div>
                </div>
                <div
                    className={cn("relative z-0 transition-all ease-in-out ease-out", {
                        "opacity-0": isLoading,
                    })}
                >
                    {filteredGamesNews.length > 0 ? (
                        <>
                            <GameNewsSection gamesNews={filteredGamesNews} />
                            <p className="text-muted-foreground mt-4 text-center text-xs">
                                Top 3 news for each game from last 30 days are shown.
                            </p>
                        </>
                    ) : (
                        <div className="bg-card text-card-foreground rounded-lg border p-6">
                            <p className="text-muted-foreground">
                                No recent news available for any games.
                            </p>
                        </div>
                    )}
                </div>
            </article>
            <MobileBottomMenu
                category={category}
                isFiltersDisabled={false}
                onLoadingChange={handleLoadingChange}
                filtersProps={filtersProps}
                shownGames={shownGames}
                totalGames={totalGames}
            />
        </>
    );
};
