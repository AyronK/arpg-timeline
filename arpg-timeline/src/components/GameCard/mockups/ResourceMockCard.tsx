"use client";

import { MoreHorizontal, ScrollText, Sword, TimerReset } from "lucide-react";
import { ReactNode } from "react";

import { CommunityLabel } from "@/components/CommunityLabel";
import { Countdown } from "@/components/Countdown";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { IconLabel } from "@/components/IconLabel/IconLabel";
import { ProgressBar } from "@/components/ProgressBar";
import { SeasonWidget } from "@/components/SeasonWidget/SeasonWidget";
import { SteamPlayersChip } from "@/components/SteamPlayersChip";
import { Button } from "@/ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

/**
 * Mockup-only stand-ins for the real GameCard (src/components/GameCard/GameCard.tsx).
 *
 * This is a deliberate visual fork, not a shared component: it mirrors the real card's
 * markup/classes closely enough to judge the resource-button ideas in context, but swaps the
 * functional header menu (GameMenu, dialogs, live Sanity logo) for static decoration so these
 * mockups have no production dependencies. Nothing here is wired into the real dashboard.
 */

export type MockGame = {
    name: string;
    slug: string;
    official: boolean;
    steamPlayers?: number;
};

export const Logo = ({ label }: { label: string }) => (
    <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center rounded text-xs">
        {label}
    </div>
);

export const MockGameCard = ({
    game,
    headerExtra,
    headerActions,
    children,
}: {
    game: MockGame;
    /** Slot rendered inline with the header badges row (Community/Steam chips). */
    headerExtra?: ReactNode;
    /** Slot rendered in the top-right corner, immediately left of the existing action-button group. */
    headerActions?: ReactNode;
    children?: ReactNode;
}) => (
    <section className="bg-card text-card-foreground relative flex flex-1 flex-col gap-1 rounded-md border p-4">
        <div className="flex flex-col">
            <div className="flex flex-row items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3 className="font-heading text-xs">{game.name}</h3>
                    <div className="flex flex-row flex-wrap items-center justify-start gap-2">
                        {!game.official && <CommunityLabel />}
                        {game.steamPlayers !== undefined && (
                            <SteamPlayersChip playersCount={game.steamPlayers} />
                        )}
                        {headerExtra}
                    </div>
                </div>
                <div className="flex flex-row items-center gap-1.5">
                    {headerActions}
                    <div className="border-foreground/10 flex flex-row items-center rounded-md border">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="h-8 w-8"
                                    variant="ghost"
                                    size="icon"
                                    aria-label={`View ${game.name} details`}
                                >
                                    <ScrollText className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">View {game.name} details</TooltipContent>
                        </Tooltip>
                        <Button
                            className="h-8 w-8"
                            variant="ghost"
                            size="icon"
                            aria-label={`More options for ${game.name}`}
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="relative flex flex-col items-center gap-1">
                <div className="relative flex min-h-[80px] w-[180px] flex-row justify-center place-self-center md:h-[140px] md:w-[220px]">
                    <div className="flex h-[96px] w-[180px] items-center justify-center p-2 md:h-[140px] md:w-[220px] md:p-4">
                        <Logo label={game.name} />
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 md:gap-4">{children}</div>
    </section>
);

// Stable mock "now" so countdowns render deterministically in Storybook.
const NOW = new Date("2026-08-14T12:00:00Z");
const daysMs = (n: number) => n * 24 * 60 * 60 * 1000;

/** Current season (progress bar) + next season with a live countdown — the "tall" body shape. */
export const fullSeasonBody = ({
    currentName,
    startedDaysAgo,
    progress,
    nextName,
    nextInDays,
}: {
    currentName: string;
    startedDaysAgo: number;
    progress: number;
    nextName: string;
    nextInDays: number;
}) => {
    const nextDate = new Date(NOW.getTime() + daysMs(nextInDays));
    return (
        <>
            <SeasonWidget chip="now" name={currentName}>
                <IconLabel icon={TimerReset}>Started {startedDaysAgo} days ago</IconLabel>
                <ProgressBar progress={progress} clamp />
            </SeasonWidget>
            <SeasonWidget chip="next" name={nextName}>
                <div className="mt-auto">
                    <FramedAction>
                        <Countdown date={nextDate} />
                    </FramedAction>
                </div>
            </SeasonWidget>
        </>
    );
};

/** Current season (progress bar) + next season as an unconfirmed estimate — the "short" body shape. */
export const estimateOnlySeasonBody = ({
    currentName,
    startedDaysAgo,
    progress,
    nextEstimate,
}: {
    currentName: string;
    startedDaysAgo: number;
    progress: number;
    nextEstimate: string;
}) => (
    <>
        <SeasonWidget chip="now" name={currentName}>
            <IconLabel icon={TimerReset}>Started {startedDaysAgo} days ago</IconLabel>
            <ProgressBar progress={progress} clamp />
        </SeasonWidget>
        <SeasonWidget chip="next" name="Next Season">
            <IconLabel icon={TimerReset}>
                <i>{nextEstimate}</i>
            </IconLabel>
        </SeasonWidget>
    </>
);

/** Single "Play" widget, no next season — the "shortest" body shape (dormant/evergreen games). */
export const dormantSeasonBody = ({ releaseLabel }: { releaseLabel: string }) => (
    <SeasonWidget chip="dormant" name="1.00 Release">
        <IconLabel icon={Sword}>{releaseLabel}</IconLabel>
    </SeasonWidget>
);
