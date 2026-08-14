import { CalendarClock, TimerReset } from "lucide-react";

import { CalendarMenu } from "@/components/CalendarMenu";
import { Countdown } from "@/components/Countdown";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { GameCardProps } from "@/components/GameCard/GameCard.types";
import { IconLabel } from "@/components/IconLabel/IconLabel";
import { ProgressBar } from "@/components/ProgressBar";
import { SeasonWidget } from "@/components/SeasonWidget/SeasonWidget";
import { ShareMenu } from "@/components/ShareMenu";

/**
 * Shared mock data for the GameCard toolbar-position comparison stories (header/mid-header/footer
 * placements). `CardProps` is `GameCardProps`, so it works for any of the position-fork mock
 * components since they all share that same prop shape.
 */

const NOW = new Date("2026-03-21T12:00:00Z");
const daysMs = (n: number) => n * 24 * 60 * 60 * 1000;
const NEXT_CONFIRMED = new Date(NOW.getTime() + daysMs(15)).toISOString();

export const Logo = ({ label }: { label: string }) => (
    <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center rounded text-xs">
        {label}
    </div>
);

export const seasonBody = (name: string) => (
    <>
        <SeasonWidget chip="now" name="Season 3: Beneath Ancient Skies">
            <div className="flex flex-row flex-wrap justify-between">
                <IconLabel icon={TimerReset}>Started 15 days ago</IconLabel>
                <IconLabel icon={CalendarClock} iconPosition="end">
                    <i>Avg. 4 months</i>
                </IconLabel>
            </div>
            <ProgressBar progress={15} clamp />
        </SeasonWidget>
        <SeasonWidget chip="next" name="Season 4 - Shattered Omens">
            <div className="mt-auto">
                <FramedAction
                    prepend={
                        <ShareMenu
                            startDate={NEXT_CONFIRMED}
                            title={`Hey, ${name} Season 4 launch is happening`}
                        />
                    }
                    append={
                        <CalendarMenu
                            startDate={NEXT_CONFIRMED}
                            title={`${name} Season 4 launch`}
                            gameSlug="last-epoch"
                            gameName={name}
                        />
                    }
                >
                    <Countdown date={new Date(NEXT_CONFIRMED)} />
                </FramedAction>
            </div>
        </SeasonWidget>
    </>
);

export type CardProps = GameCardProps;

export const GAMES: Record<string, CardProps> = {
    lastEpoch: {
        name: "Last Epoch",
        slug: "last-epoch",
        shortName: null,
        official: true,
        url: "https://lastepoch.com",
        buildsUrl: "https://maxroll.gg/last-epoch/build-guides",
        guidesUrl: "https://maxroll.gg/last-epoch/guides",
        gameLogo: <Logo label="Last Epoch" />,
        stats: { steam: { currentPlayers: 12400, appId: 899770 } },
        children: seasonBody("Last Epoch"),
    },
    diabloBuildsOnly: {
        name: "Diablo III",
        slug: "d3",
        shortName: null,
        official: true,
        url: "https://diablo3.com",
        buildsUrl: "https://maxroll.gg/d3/builds",
        gameLogo: <Logo label="Diablo III" />,
        stats: { steam: { currentPlayers: 5000000, appId: 0 } },
        children: seasonBody("Diablo III"),
    },
    diabloGuidesOnly: {
        name: "Diablo III",
        slug: "d3",
        shortName: null,
        official: true,
        url: "https://diablo3.com",
        guidesUrl: "https://maxroll.gg/d3/guides",
        gameLogo: <Logo label="Diablo III" />,
        stats: { steam: { currentPlayers: 5000000, appId: 0 } },
        children: seasonBody("Diablo III"),
    },
    poe2NoResources: {
        name: "Path of Exile 2",
        slug: "poe2",
        shortName: null,
        official: true,
        noMenu: true,
        url: "https://pathofexile2.com",
        gameLogo: <Logo label="PoE 2" />,
        stats: { steam: { currentPlayers: 45000, appId: 2694490 } },
        children: seasonBody("Path of Exile 2"),
    },
    dwarvenRealms: {
        name: "Dwarven Realms",
        slug: "dwarven-realms",
        shortName: null,
        official: false,
        url: "https://dwarvenrealms.com",
        guidesUrl: "https://maxroll.gg/dwarven-realms/guides",
        gameLogo: <Logo label="Dwarven Realms" />,
        children: seasonBody("Dwarven Realms"),
    },
};

// The real dashboard grid (GamesAndEventsGrid.tsx), reproduced for the mockup stories.
export const DASHBOARD_GRID_CLASS =
    "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3 [&>*]:min-h-52 md:[&>*]:min-h-80";
