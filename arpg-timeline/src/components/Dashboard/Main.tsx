import { Suspense } from "react";

import { Game, GameStatistics } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";

import { GamesAndEventsGrid, GamesAndEventsGridFallback } from "./GamesAndEventsGrid";

export const Main = ({
    games,
    statistics,
    category = "featured",
}: {
    games: Game[];
    statistics: Record<string, GameStatistics>;
    category?: GameFilterCategory;
}) => {
    return (
        <div className="mt-2 flex flex-col">
            <div className="relative flex flex-col gap-4">
                <Suspense fallback={<GamesAndEventsGridFallback games={games} />}>
                    <GamesAndEventsGrid games={games} statistics={statistics} category={category} />
                </Suspense>
            </div>
        </div>
    );
};
