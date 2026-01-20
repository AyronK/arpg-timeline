import { Suspense } from "react";

import { Game, GameStatistics } from "@/lib/cms/games.types";

import { GamesAndEventsGrid, GamesAndEventsGridFallback } from "./GamesAndEventsGrid";

export const Main = ({
    games,
    statistics,
}: {
    games: Game[];
    statistics: Record<string, GameStatistics>;
}) => {
    return (
        <div className="mt-2 flex flex-col">
            <div className="relative flex flex-col gap-4">
                <Suspense fallback={<GamesAndEventsGridFallback games={games} />}>
                    <GamesAndEventsGrid statistics={statistics} />
                </Suspense>
            </div>
        </div>
    );
};
