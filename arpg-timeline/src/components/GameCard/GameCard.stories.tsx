import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarClock, CalendarOff, Info, Sword, TimerReset, Twitch } from "lucide-react";
import Link from "next/link";

import { CalendarMenu } from "@/components/CalendarMenu";
import { Countdown } from "@/components/Countdown";
import { FramedAction } from "@/components/FramedAction/FramedAction";
import { IconLabel } from "@/components/IconLabel/IconLabel";
import { ProgressBar } from "@/components/ProgressBar";
import { SeasonWidget } from "@/components/SeasonWidget/SeasonWidget";
import { ShareMenu } from "@/components/ShareMenu";
import { Button } from "@/ui/Button";

import { GameCard } from "./GameCard";

// Stable mock dates relative to 2026-03-21
const NOW = new Date("2026-03-21T12:00:00Z");
const daysMs = (n: number) => n * 24 * 60 * 60 * 1000;

const NEXT_CONFIRMED = new Date(NOW.getTime() + daysMs(15)).toISOString(); // Apr 05
const NEXT_SOON = new Date(NOW.getTime() + daysMs(5)).toISOString(); // Mar 26

// useEmphasizeBuilds compares against the real wall clock, not the fictional NOW above — these
// stay relative to Date.now() so the Builds-emphasis stories work regardless of when they're viewed.
const REAL_NEXT_SEASON_SOON = new Date(Date.now() + daysMs(3)).toISOString();
const REAL_GRACE_PERIOD_START = new Date(Date.now() - daysMs(0.1)).toISOString(); // ~2.4h ago
const REAL_GRACE_PERIOD_END = new Date(Date.now() + daysMs(90)).toISOString();

const Logo = ({ label }: { label: string }) => (
    <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center rounded text-xs">
        {label}
    </div>
);

const meta: Meta<typeof GameCard> = {
    component: GameCard,
    title: "Components/GameCard",
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="w-[480px]">
                <Story />
            </div>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof GameCard>;

/**
 * The most common state: an active season running with a confirmed upcoming
 * season showing a live countdown + share and calendar actions.
 */
export const ActiveWithCountdown: Story = {
    name: "Active + Confirmed next countdown",
    args: {
        name: "Last Epoch",
        slug: "last-epoch",
        official: true,
        url: "https://lastepoch.com",
        gameLogo: <Logo label="Last Epoch" />,
        stats: { steam: { currentPlayers: 12400, appId: 899770 } },
        children: (
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
                    <div className="flex flex-row flex-nowrap justify-between">
                        <IconLabel icon={TimerReset}>
                            Starts <span className="font-semibold">Mar 26, 14:00</span>
                        </IconLabel>
                    </div>
                    <div className="mt-auto">
                        <FramedAction
                            prepend={
                                <ShareMenu
                                    startDate={NEXT_CONFIRMED}
                                    title="Hey, Last Epoch Season 4 - Shattered Omens launch is happening"
                                />
                            }
                            append={
                                <CalendarMenu
                                    startDate={NEXT_CONFIRMED}
                                    title="Last Epoch Season 4 - Shattered Omens launch"
                                    gameSlug="last-epoch"
                                    gameName="Last Epoch"
                                />
                            }
                        >
                            <Countdown date={new Date(NEXT_CONFIRMED)} />
                        </FramedAction>
                    </div>
                </SeasonWidget>
            </>
        ),
    },
};

/**
 * Season just launched (grace period): LIVE chip pulses, progress bar pulses,
 * and a "Patch notes" link appears alongside the countdown.
 */
export const InGracePeriod: Story = {
    name: "Live (grace period) + patch notes",
    args: {
        name: "Diablo III",
        slug: "d3",
        official: true,
        url: "https://diablo3.com",
        gameLogo: <Logo label="Diablo III" />,
        stats: { steam: { currentPlayers: 5000000, appId: 0 } },
        children: (
            <>
                <SeasonWidget chip="live" name="Season 37: The Forbidden Archives">
                    <div className="flex flex-row flex-wrap justify-between">
                        <IconLabel icon={TimerReset}>Started 15h ago</IconLabel>
                    </div>
                    <ProgressBar progress={2} clamp pulse />
                </SeasonWidget>
                <SeasonWidget chip="next" name="Season 38: Ethereal Memory">
                    <div className="flex flex-row flex-nowrap justify-between">
                        <IconLabel icon={TimerReset}>
                            Starts <span className="font-semibold">Mar 28, 01:00</span>
                        </IconLabel>
                        <a
                            href="#"
                            className="text-primary hover:text-primary/80 ml-auto text-sm text-nowrap hover:underline"
                        >
                            Patch notes
                        </a>
                    </div>
                    <div className="mt-auto">
                        <FramedAction
                            prepend={
                                <ShareMenu
                                    startDate={NEXT_SOON}
                                    title="Hey, Diablo III Season 38 launch is happening"
                                />
                            }
                            append={
                                <CalendarMenu
                                    startDate={NEXT_SOON}
                                    title="Diablo III Season 38 launch"
                                    gameSlug="d3"
                                    gameName="Diablo III"
                                />
                            }
                        >
                            <Countdown date={new Date(NEXT_SOON)} />
                        </FramedAction>
                    </div>
                </SeasonWidget>
            </>
        ),
    },
};

/**
 * Active season showing a hard end date ("7 days left"), next season confirmed
 * with countdown and patch notes.
 */
export const WithDaysLeftAndPatchNotes: Story = {
    name: "Active + days left + patch notes",
    args: {
        name: "Hero Siege",
        slug: "hero-siege",
        official: false,
        url: "https://herosiege.com",
        gameLogo: <Logo label="Hero Siege" />,
        stats: { steam: { currentPlayers: 312, appId: 269210 } },
        children: (
            <>
                <SeasonWidget chip="now" name="Season 8">
                    <div className="flex flex-row flex-wrap justify-between">
                        <IconLabel icon={TimerReset}>Started 4 months ago</IconLabel>
                        <IconLabel icon={CalendarClock} iconPosition="end">
                            <span>7 days left</span>
                        </IconLabel>
                    </div>
                    <ProgressBar progress={85} clamp />
                </SeasonWidget>
                <SeasonWidget chip="next" name="Season 9 - INCARNATION">
                    <div className="flex flex-row flex-nowrap justify-between">
                        <IconLabel icon={TimerReset}>
                            Starts <span className="font-semibold">Apr 03, 14:00</span>
                        </IconLabel>
                        <a
                            href="#"
                            className="text-primary hover:text-primary/80 ml-auto text-sm text-nowrap hover:underline"
                        >
                            Patch notes
                        </a>
                    </div>
                    <IconLabel icon={Info} className="text-xs" iconPosition="end">
                        Exact time unknown; may vary by platform.
                    </IconLabel>
                    <div className="mt-auto">
                        <FramedAction
                            prepend={
                                <ShareMenu
                                    startDate={NEXT_CONFIRMED}
                                    title="Hey, Hero Siege Season 9 launch is happening"
                                />
                            }
                            append={
                                <CalendarMenu
                                    startDate={NEXT_CONFIRMED}
                                    title="Hero Siege Season 9 launch"
                                    gameSlug="hero-siege"
                                    gameName="Hero Siege"
                                />
                            }
                        >
                            <Countdown date={new Date(NEXT_CONFIRMED)} />
                        </FramedAction>
                    </div>
                </SeasonWidget>
            </>
        ),
    },
};

/**
 * Active season with no confirmed end date; next season has only an estimate
 * text ("Around July") instead of a countdown.
 */
export const WithEstimateOnly: Story = {
    name: "Active + next unconfirmed (estimate text)",
    args: {
        name: "Path of Exile 2",
        slug: "poe2",
        official: true,
        url: "https://pathofexile2.com",
        gameLogo: <Logo label="PoE 2" />,
        stats: { steam: { currentPlayers: 45000, appId: 2694490 } },
        children: (
            <>
                <SeasonWidget chip="now" name="0.40 - The Last of the Druids">
                    <div className="flex flex-row flex-wrap justify-between">
                        <IconLabel icon={TimerReset}>Started 15 days ago</IconLabel>
                        <IconLabel icon={CalendarClock} iconPosition="end">
                            <i>April/May</i>
                        </IconLabel>
                    </div>
                    <ProgressBar progress={20} clamp />
                </SeasonWidget>
                <SeasonWidget chip="next" name="Next League">
                    <IconLabel icon={TimerReset}>
                        <i>April/May</i>
                    </IconLabel>
                </SeasonWidget>
            </>
        ),
    },
};

/**
 * Community-tracked game: shows the Community label, no official end date,
 * and the next season is an estimate only.
 */
export const CommunityCard: Story = {
    name: "Community card (estimate dates)",
    args: {
        name: "Dwarven Realms",
        slug: "dwarven-realms",
        official: false,
        url: "https://dwarvenrealms.com",
        gameLogo: <Logo label="Dwarven Realms" />,
        children: (
            <>
                <SeasonWidget chip="now" name="Season 55: Return of the Dwarven King">
                    <div className="flex flex-row flex-wrap justify-between">
                        <IconLabel icon={TimerReset}>Started 64 days ago</IconLabel>
                        <IconLabel icon={CalendarClock} iconPosition="end">
                            <i>Avg. 6 months</i>
                        </IconLabel>
                    </div>
                    <ProgressBar progress={35} clamp />
                </SeasonWidget>
                <SeasonWidget chip="next" name="Next Season">
                    <IconLabel icon={TimerReset}>
                        <i>Avg. 6 months</i>
                    </IconLabel>
                </SeasonWidget>
            </>
        ),
    },
};

/**
 * Current season is over; next season is unconfirmed with flavour text
 * ("Likely in Mirage!") instead of a date.
 */
export const SeasonOver: Story = {
    name: "Season over + next unconfirmed (flavour text)",
    args: {
        name: "Dizkara's Path of Exile Gauntlet",
        slug: "dizkara-poe-gauntlet",
        official: false,
        url: null,
        gameLogo: <Logo label="Dizkara" />,
        children: (
            <>
                <SeasonWidget chip="over" name="Merciless Gauntlet">
                    <div className="flex flex-row flex-wrap justify-between">
                        <IconLabel icon={TimerReset}>Started 8 months ago</IconLabel>
                        <IconLabel icon={CalendarOff} iconPosition="end">
                            Ended Aug 11
                        </IconLabel>
                    </div>
                    <ProgressBar progress={100} />
                </SeasonWidget>
                <SeasonWidget chip="next" name="Next Gauntlet">
                    <IconLabel icon={TimerReset}>
                        <i>Likely in Mirage!</i>
                    </IconLabel>
                </SeasonWidget>
            </>
        ),
    },
};

/**
 * Current season ended long ago with no next season information at all.
 */
export const SeasonEndedNoInfo: Story = {
    name: "Season ended + no next info",
    args: {
        name: "Path of Diablo",
        slug: "path-of-diablo",
        official: false,
        url: null,
        gameLogo: <Logo label="Path of Diablo" />,
        children: (
            <>
                <SeasonWidget chip="over" name="Season 11">
                    <div className="flex flex-row flex-wrap justify-between">
                        <IconLabel icon={TimerReset}>Started 36 months ago</IconLabel>
                        <IconLabel icon={CalendarOff} iconPosition="end">
                            Ended Oct 18
                        </IconLabel>
                    </div>
                    <ProgressBar progress={100} />
                </SeasonWidget>
                <SeasonWidget chip="next" name="Next Season">
                    <IconLabel icon={TimerReset}>
                        <i>No info</i>
                    </IconLabel>
                </SeasonWidget>
            </>
        ),
    },
};

/**
 * Game in Early Access: current chip is a Steam Demo, next season is
 * marked as Delayed with no confirmed date.
 */
export const EarlyAccessDelayed: Story = {
    name: "Early Access + next delayed",
    args: {
        name: "Crystalfall",
        slug: "crystalfall",
        official: true,
        url: "https://crystalfall.com",
        gameLogo: <Logo label="Crystalfall" />,
        stats: { steam: { currentPlayers: 820, appId: 0 } },
        children: (
            <>
                <SeasonWidget chip="now" name="Steam Demo">
                    <div className="flex flex-row flex-wrap justify-between">
                        <IconLabel icon={TimerReset}>Started 29 days ago</IconLabel>
                    </div>
                    <ProgressBar progress={40} clamp />
                </SeasonWidget>
                <SeasonWidget chip="next" name="Early Access">
                    <IconLabel icon={TimerReset}>
                        <i>Delayed</i>
                    </IconLabel>
                </SeasonWidget>
            </>
        ),
    },
};

/**
 * Dormant / permanently playable game: shows the "Play" chip instead of an
 * active season, with a release date and no next season.
 */
export const DormantPlayable: Story = {
    name: "Dormant (Play chip)",
    args: {
        name: "The Stormcaller",
        slug: "stormcaller",
        official: true,
        url: "https://stormcaller.com",
        gameLogo: <Logo label="Stormcaller" />,
        stats: { steam: { currentPlayers: 210, appId: 0 } },
        children: (
            <SeasonWidget chip="dormant" name="1.00 Release">
                <IconLabel icon={Sword}>Released on Jan 19, 2025</IconLabel>
            </SeasonWidget>
        ),
    },
};

/**
 * Active season with an additional info note (e.g. a milestone announcement
 * shown below the next season estimate).
 */
export const WithAdditionalInfo: Story = {
    name: "Active + next with additional info note",
    args: {
        name: "Titan Quest II",
        slug: "titan-quest-ii",
        official: true,
        url: "https://titanquest.com",
        gameLogo: <Logo label="Titan Quest II" />,
        stats: { steam: { currentPlayers: 3100, appId: 0 } },
        children: (
            <>
                <SeasonWidget chip="now" name="Early Access Chapter 3 - Arrakian Ruins">
                    <div className="flex flex-row flex-wrap justify-between">
                        <IconLabel icon={TimerReset}>Started 39 days ago</IconLabel>
                        <IconLabel icon={CalendarClock} iconPosition="end">
                            <i>Avg. 10 weeks</i>
                        </IconLabel>
                    </div>
                    <ProgressBar progress={55} clamp />
                </SeasonWidget>
                <SeasonWidget chip="next" name="Early Access: The Wild Lands">
                    <IconLabel icon={TimerReset}>
                        <i>Avg. 10 weeks</i>
                    </IconLabel>
                    <IconLabel icon={Info} className="text-xs" iconPosition="end">
                        1.0 at the end of 2026
                    </IconLabel>
                </SeasonWidget>
            </>
        ),
    },
};

/**
 * Coming-soon game: the Steam chip shows "Coming Soon" state and there is
 * no active season yet — only a future release widget.
 */
export const ComingSoon: Story = {
    name: "Coming soon (Steam pre-release)",
    args: {
        name: "Defender: Abomination Vaults",
        slug: "defender-abomination-vaults",
        official: true,
        url: null,
        gameLogo: <Logo label="Defender" />,
        stats: { steam: { currentPlayers: 0, appId: 0, isComingSoon: true } },
        children: (
            <SeasonWidget chip="comingSoon" name="1.00 Release">
                <IconLabel icon={TimerReset}>
                    <i>To be announced</i>
                </IconLabel>
            </SeasonWidget>
        ),
    },
};

/**
 * Optional "Builds" and "Guides" footer links, alongside the existing
 * "Details"/"More" cluster — all packed and right-anchored in the footer bar.
 */
export const WithBuildsAndGuides: Story = {
    name: "Active + Builds & Guides footer links",
    args: {
        name: "Last Epoch",
        slug: "last-epoch",
        official: true,
        url: "https://lastepoch.com",
        buildsUrl: "https://maxroll.gg/last-epoch/build-guides",
        guidesUrl: "https://maxroll.gg/last-epoch/guides",
        gameLogo: <Logo label="Last Epoch" />,
        stats: { steam: { currentPlayers: 12400, appId: 899770 } },
        children: (
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
                    <div className="flex flex-row flex-nowrap justify-between">
                        <IconLabel icon={TimerReset}>
                            Starts <span className="font-semibold">Mar 26, 14:00</span>
                        </IconLabel>
                    </div>
                    <div className="mt-auto">
                        <FramedAction
                            prepend={
                                <ShareMenu
                                    startDate={NEXT_CONFIRMED}
                                    title="Hey, Last Epoch Season 4 - Shattered Omens launch is happening"
                                />
                            }
                            append={
                                <CalendarMenu
                                    startDate={NEXT_CONFIRMED}
                                    title="Last Epoch Season 4 - Shattered Omens launch"
                                    gameSlug="last-epoch"
                                    gameName="Last Epoch"
                                />
                            }
                        >
                            <Countdown date={new Date(NEXT_CONFIRMED)} />
                        </FramedAction>
                    </div>
                </SeasonWidget>
            </>
        ),
    },
};

/**
 * `noMenu` suppresses "Details"/"More" as before, but Builds/Guides are
 * independent and still render — used on the game detail page header card.
 */
export const NoMenuWithResourcesOnly: Story = {
    name: "noMenu + Builds & Guides only (game detail page header)",
    args: {
        name: "Last Epoch",
        slug: "last-epoch",
        official: true,
        noMenu: true,
        noTitle: true,
        url: "https://lastepoch.com",
        buildsUrl: "https://maxroll.gg/last-epoch/build-guides",
        guidesUrl: "https://maxroll.gg/last-epoch/guides",
        gameLogo: <Logo label="Last Epoch" />,
        stats: { steam: { currentPlayers: 12400, appId: 899770 } },
        children: (
            <SeasonWidget chip="now" name="Season 3: Beneath Ancient Skies">
                <div className="flex flex-row flex-wrap justify-between">
                    <IconLabel icon={TimerReset}>Started 15 days ago</IconLabel>
                    <IconLabel icon={CalendarClock} iconPosition="end">
                        <i>Avg. 4 months</i>
                    </IconLabel>
                </div>
                <ProgressBar progress={15} clamp />
            </SeasonWidget>
        ),
    },
};

/**
 * Next season is confirmed and under a week away — "Builds" picks up the warm/emphasized
 * treatment (bg-warning tint, bolder text) so players hunting for build guides notice it.
 */
export const BuildsEmphasizedSoon: Story = {
    name: "Active + Builds emphasized (next season <1 week away)",
    args: {
        name: "Last Epoch",
        slug: "last-epoch",
        official: true,
        url: "https://lastepoch.com",
        buildsUrl: "https://maxroll.gg/last-epoch/build-guides",
        guidesUrl: "https://maxroll.gg/last-epoch/guides",
        nextSeasonStartDate: REAL_NEXT_SEASON_SOON,
        nextSeasonConfirmed: true,
        gameLogo: <Logo label="Last Epoch" />,
        stats: { steam: { currentPlayers: 12400, appId: 899770 } },
        children: (
            <>
                <SeasonWidget chip="now" name="Season 3: Beneath Ancient Skies">
                    <div className="flex flex-row flex-wrap justify-between">
                        <IconLabel icon={TimerReset}>Started 4 months ago</IconLabel>
                        <IconLabel icon={CalendarClock} iconPosition="end">
                            <i>Avg. 4 months</i>
                        </IconLabel>
                    </div>
                    <ProgressBar progress={92} clamp />
                </SeasonWidget>
                <SeasonWidget chip="next" name="Season 4 - Shattered Omens">
                    <div className="mt-auto">
                        <FramedAction
                            prepend={
                                <ShareMenu
                                    startDate={REAL_NEXT_SEASON_SOON}
                                    title="Hey, Last Epoch Season 4 - Shattered Omens launch is happening"
                                />
                            }
                            append={
                                <CalendarMenu
                                    startDate={REAL_NEXT_SEASON_SOON}
                                    title="Last Epoch Season 4 - Shattered Omens launch"
                                    gameSlug="last-epoch"
                                    gameName="Last Epoch"
                                />
                            }
                        >
                            <Countdown date={new Date(REAL_NEXT_SEASON_SOON)} />
                        </FramedAction>
                    </div>
                </SeasonWidget>
            </>
        ),
    },
};

/**
 * Season just launched (grace period): emphasis persists even though nextSeason has flipped to
 * an unconfirmed placeholder — this story sets no next-season date at all, isolating the grace-
 * period condition as the sole trigger.
 */
export const BuildsEmphasizedGracePeriod: Story = {
    name: "Live (grace period) + Builds emphasized",
    args: {
        name: "Diablo III",
        slug: "d3",
        official: true,
        url: "https://diablo3.com",
        buildsUrl: "https://maxroll.gg/d3/builds",
        guidesUrl: "https://maxroll.gg/d3/guides",
        currentSeasonStartDate: REAL_GRACE_PERIOD_START,
        currentSeasonEndDate: REAL_GRACE_PERIOD_END,
        gameLogo: <Logo label="Diablo III" />,
        stats: { steam: { currentPlayers: 5000000, appId: 0 } },
        children: (
            <>
                <SeasonWidget chip="live" name="Season 37: The Forbidden Archives">
                    <div className="flex flex-row flex-wrap justify-between">
                        <IconLabel icon={TimerReset}>Started 2h ago</IconLabel>
                    </div>
                    <ProgressBar progress={1} clamp pulse />
                </SeasonWidget>
                {/* Matches GracePeriodSeasonWidgetHoC's real output: during grace period the
                 * "next" SeasonWidget is replaced entirely by this "Play (and watch) now!" bar. */}
                <div className="mt-auto flex flex-col gap-2">
                    <FramedAction
                        appendClassName="!bg-[#6441a5]"
                        append={
                            <Button
                                asChild
                                size="icon"
                                className="mt-auto ml-auto h-[32px]! w-[32px]! flex-1 !rounded-l-none !bg-[#6441a5] md:h-[40px]! md:w-[40px]!"
                                variant="destructive"
                            >
                                <Link
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    href="https://www.twitch.tv/directory/category/diablo-iii"
                                >
                                    <Twitch className="h-4 w-4" />
                                </Link>
                            </Button>
                        }
                    >
                        Play and watch now!
                    </FramedAction>
                </div>
            </>
        ),
    },
};
