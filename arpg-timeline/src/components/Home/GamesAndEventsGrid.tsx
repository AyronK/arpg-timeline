"use client";

import { FlaskConical, Gamepad2, Telescope, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { GameFilters } from "@/components/GameFilters";
import { useGameFilters } from "@/hooks/useGameFilters";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { Game, GameStatistics } from "@/lib/cms/games.types";
import { DashboardTag } from "@/lib/cms/gameTags";
import { cn } from "@/lib/utils";
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
        description: "Explore",
        tooltip:
            "Other games related to the genre or with similar appeal that do not strictly follow a seasonal aRPG type",
        icon: Telescope,
    },
};

const CantFindGame = () => (
    <div className="bg-card 3xl:nth-[2]:order-first 3xl:nth-[3]:order-first 3xl:nth-[4]:order-first 4xl:nth-[2]:order-first 4xl:nth-[3]:order-first 4xl:nth-[4]:order-first 4xl:nth-[5]:order-first order-last flex flex-col items-center justify-center rounded-lg p-6 text-center md:nth-[2]:order-first lg:nth-[2]:order-first xl:nth-[2]:order-first">
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
    dashboard = "default-when-next-confirmed",
}: {
    games: Game[];
    statistics: Record<string, GameStatistics>;
    dashboard?: DashboardTag;
}) => {
    const [currentDashboard, setCurrentDashboard] = useState<DashboardTag>(dashboard);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { filteredGames, totalGames, shownGames, ...filtersProps } = useGameFilters(
        games,
        currentDashboard,
    );
    const events = useTimelineEvents(filteredGames);
    const activeGames = filteredGames.filter((g) => !g.isDormant && !g.isComingSoon);
    const comingSoonGames = filteredGames.filter((g) => g.isComingSoon);
    const dormantGames = filteredGames
        .filter((g) => g.isDormant)
        .map((g) => ({ ...g, nextSeason: null }));

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [currentDashboard]);

    return (
        <>
            <article className="flex flex-col gap-4 md:gap-5">
                <h2 className="sr-only">Seasons</h2>
                <div className="relative flex flex-col gap-1">
                    <div className="text-muted-foreground text-right text-sm">
                        <span>
                            <span
                                key={currentDashboard}
                                className={`inline-block origin-bottom-right transition-all ease-in-out ${isAnimating ? "text-warning scale-150" : ""}`}
                            >
                                {shownGames}
                            </span>{" "}
                            of {totalGames} games shown
                        </span>
                    </div>
                    <div className="flex flex-row items-end gap-4">
                        <ToggleGroup
                            type="single"
                            variant="outline"
                            className="hidden md:flex"
                            value={currentDashboard}
                            onValueChange={(value) => {
                                if (value) {
                                    setIsLoading(true);
                                    setTimeout(() => {
                                        setCurrentDashboard(value as DashboardTag);
                                        setIsLoading(false);
                                    }, 100);
                                }
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
                                                    sideOffset={8}
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
                        <GameFilters {...filtersProps} />
                    </div>
                </div>
                <div
                    className={cn(
                        "3xl:grid-cols-4 4xl:grid-cols-5 transition- relative grid grid-cols-1 gap-4 transition-all ease-in-out ease-out md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-3 [&>*]:min-h-52 md:[&>*]:min-h-80",
                        { "opacity-0": isLoading },
                    )}
                >
                    <Games
                        games={[...activeGames, ...comingSoonGames, ...dormantGames]}
                        statistics={statistics}
                    />
                    <CantFindGame />
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
                <CantFindGame />
            </article>
        </ClientOnlyVisibleWrapper>
    );
};
