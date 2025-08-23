"use client";

import { FlaskConical, Gamepad2, Telescope, Users } from "lucide-react";
import { useState } from "react";

import { GameFilters } from "@/components/GameFilters";
import { useGameFilters } from "@/hooks/useGameFilters";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { Game, GameStatistics } from "@/lib/cms/games.types";
import { DashboardTag } from "@/lib/cms/gameTags";
import { ToggleGroup, ToggleGroupItem } from "@/ui/ToggleGroup";

import ClientOnlyVisibleWrapper from "../ClientOnlyVisibleWrapper";
import { Logo } from "../Logo";
import { Events } from "./Events";
import { Games } from "./Games";

const DASHBOARD_CONFIG: Partial<
    Record<DashboardTag, { description: string; icon: React.ComponentType<{ className?: string }> }>
> = {
    "default-when-next-confirmed": { description: "Standard", icon: Logo },
    seasonal: { description: "Seasonal", icon: Gamepad2 },
    "early-access": { description: "Early Access", icon: FlaskConical },
    community: { description: "Community", icon: Users },
    other: { description: "You might like", icon: Telescope },
};

export const GamesAndEventsGrid = ({
    games,
    statistics,
}: {
    games: Game[];
    statistics: Record<string, GameStatistics>;
}) => {
    const [dashboardTag, setDashboardTag] = useState<DashboardTag>("default-when-next-confirmed");
    const { filteredGames, totalGames, shownGames, ...filtersProps } = useGameFilters(
        games,
        dashboardTag,
    );
    const events = useTimelineEvents(filteredGames);
    const activeGames = filteredGames.filter((g) => !g.isDormant && !g.isComingSoon);
    const comingSoonGames = filteredGames.filter((g) => g.isComingSoon);
    const dormantGames = filteredGames
        .filter((g) => g.isDormant)
        .map((g) => ({ ...g, nextSeason: null }));

    return (
        <>
            <article className="flex flex-col gap-4 md:gap-5">
                <h2 className="sr-only">Seasons</h2>
                <div className="flex flex-col gap-1">
                    <div className="text-muted-foreground mt-4 text-right text-sm">
                        {shownGames} of {totalGames} games shown
                    </div>
                    <ToggleGroup
                        type="single"
                        variant="outline"
                        className="hidden md:flex"
                        value={dashboardTag}
                        onValueChange={(value) => {
                            if (value) setDashboardTag(value as DashboardTag);
                        }}
                    >
                        {(Object.keys(DASHBOARD_CONFIG) as DashboardTag[])
                            .filter((tag) => DASHBOARD_CONFIG[tag])
                            .map((tag) => {
                                const config = DASHBOARD_CONFIG[tag]!;
                                const IconComponent = config.icon;
                                return (
                                    <ToggleGroupItem key={tag} value={tag} aria-label={tag}>
                                        <IconComponent />
                                        <span className="text-center whitespace-nowrap">
                                            {config.description}
                                        </span>
                                    </ToggleGroupItem>
                                );
                            })}
                    </ToggleGroup>
                </div>
                <div className="3xl:grid-cols-4 4xl:grid-cols-5 relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
                    <GameFilters {...filtersProps} />
                    <Games
                        games={[...activeGames, ...comingSoonGames, ...dormantGames]}
                        statistics={statistics}
                    />
                    {filteredGames.length > 1 && <Events events={events} />}
                </div>
            </article>
        </>
    );
};

// TODO refactor
export const GamesAndEventsGridFallback = ({ games }: { games: Game[] }) => {
    const events = useTimelineEvents(games);
    return (
        <ClientOnlyVisibleWrapper>
            <article className="3xl:grid-cols-4 4xl:grid-cols-5 relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
                <h2 className="sr-only">Seasons</h2>
                <Games games={games} />
                <Events events={events} />
            </article>
        </ClientOnlyVisibleWrapper>
    );
};
