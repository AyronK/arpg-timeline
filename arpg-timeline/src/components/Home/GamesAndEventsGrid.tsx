"use client";

import { FlaskConical, Gamepad2, Telescope, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { GameFilters } from "@/components/GameFilters";
import { useGameFilters } from "@/hooks/useGameFilters";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { Game, GameStatistics } from "@/lib/cms/games.types";
import { DashboardTag } from "@/lib/cms/gameTags";
import { ToggleGroup, ToggleGroupItem } from "@/ui/ToggleGroup";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

import ClientOnlyVisibleWrapper from "../ClientOnlyVisibleWrapper";
import { Logo } from "../Logo";
import { Events } from "./Events";
import { Games } from "./Games";

const DASHBOARD_CONFIG: Partial<
    Record<
        DashboardTag,
        { description: string; tooltip: string; icon: React.ComponentType<{ className?: string }> }
    >
> = {
    "default-when-next-confirmed": {
        description: "Standard",
        tooltip: "Top picks and recommendations from aRPG Timeline",
        icon: Logo,
    },
    seasonal: {
        description: "Seasonal",
        tooltip: "Games with active or upcoming seasons and ladders",
        icon: Gamepad2,
    },
    "early-access": {
        description: "Early Access",
        tooltip: "Games currently in early access, open beta, or preview",
        icon: FlaskConical,
    },
    community: {
        description: "Community",
        tooltip: "Community-driven mods, events, and fan projects",
        icon: Users,
    },
    other: {
        description: "Discover",
        tooltip:
            "Other games related to the genre or with similar appeal that do not strictly follow a seasonal aRPG type",
        icon: Telescope,
    },
};

const CantFindGame = () => (
    <div className="bg-card order-4 flex flex-col items-center justify-center rounded-lg p-6 text-center">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Can&apos;t find a game?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
            See other tabs at the top or request on Discord
        </p>
    </div>
);

export const GamesAndEventsGrid = ({
    games,
    statistics,
}: {
    games: Game[];
    statistics: Record<string, GameStatistics>;
}) => {
    const [dashboardTag, setDashboardTag] = useState<DashboardTag>("default-when-next-confirmed");
    const [isAnimating, setIsAnimating] = useState(false);
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

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [dashboardTag]);

    return (
        <>
            <article className="flex flex-col">
                <h2 className="sr-only">Seasons</h2>
                <div className="flex flex-col gap-1">
                    <div className="text-muted-foreground text-right text-sm">
                        <span>
                            <span
                                key={dashboardTag}
                                className={`inline-block origin-bottom-right transition-all ease-in-out ${isAnimating ? "text-warning scale-150" : ""}`}
                            >
                                {shownGames}
                            </span>{" "}
                            of {totalGames} games shown
                        </span>
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
                            .map((tag, idx, items) => {
                                const config = DASHBOARD_CONFIG[tag]!;
                                const IconComponent = config.icon;
                                return (
                                    <ToggleGroupItem
                                        className="relative"
                                        value={tag}
                                        key={tag}
                                        aria-label={tag}
                                    >
                                        <Tooltip delayDuration={500}>
                                            <TooltipTrigger asChild>
                                                <div className="inline-flex min-w-0 flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap after:absolute after:inset-0">
                                                    <IconComponent />
                                                    <span className="text-center whitespace-nowrap">
                                                        {config.description}
                                                    </span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="bottom"
                                                sideOffset={4}
                                                alignOffset={-8}
                                                align={
                                                    idx === 0
                                                        ? "start"
                                                        : idx === items.length - 1
                                                          ? "end"
                                                          : "center"
                                                }
                                            >
                                                {config.tooltip}
                                            </TooltipContent>
                                        </Tooltip>
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
                    <CantFindGame />
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
                <CantFindGame />
            </article>
        </ClientOnlyVisibleWrapper>
    );
};
