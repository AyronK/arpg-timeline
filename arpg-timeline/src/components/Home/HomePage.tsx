import { Suspense } from "react";

import { Game, GameStatistics, GameStream } from "@/lib/cms/games.types";
import { DashboardTag } from "@/lib/cms/gameTags";

import { GamesAndEventsGrid, GamesAndEventsGridFallback } from "./GamesAndEventsGrid";
import { Streams, StreamsFallback } from "./Streams";

export const Main = ({
    games,
    streams,
    statistics,
    dashboard = "default-when-next-confirmed",
}: {
    games: Game[];
    streams: GameStream[];
    statistics: Record<string, GameStatistics>;
    dashboard?: DashboardTag;
}) => {
    return (
        <div className="mt-4 flex flex-col gap-4 xl:mt-8">
            <Suspense fallback={<StreamsFallback streams={streams} />}>
                <Streams games={games} streams={streams} />
            </Suspense>
            <div className="relative flex flex-col gap-4">
                <Suspense fallback={<GamesAndEventsGridFallback games={games} />}>
                    <GamesAndEventsGrid
                        games={games}
                        statistics={statistics}
                        dashboard={dashboard}
                    />
                </Suspense>
            </div>
        </div>
    );
};
