"use client";

import { BookOpen, GitBranch, SquareChartGantt } from "lucide-react";
import Link from "next/link";

import { CommunityLabel } from "@/components/CommunityLabel";
import { GameCardProps } from "@/components/GameCard/GameCard.types";
import { GuardedExternalLink } from "@/components/GuardedExternalLink";
import { sa_event } from "@/lib/sa_event";
import { addUTMParameters } from "@/lib/utm";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

import { SteamPlayersChip } from "../SteamPlayersChip";
import { GameMenu } from "./Menu/Menu";

const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_content: "logo_link",
});

const addResourceUTM = (kind: "builds" | "guides", slug: string) =>
    addUTMParameters({
        utm_source: "arpg-timeline",
        utm_medium: "link",
        utm_campaign: kind,
        utm_content: slug,
    });

// Shared by every footer segment (Builds, Guides, Overview). On mobile, each present segment takes
// a fixed 1/3 of the available space (the bar minus the fixed-width "More" button) regardless of
// how many render — see the flex-1/justify-end wrapper below for why that's "available space".
// The focus ring uses ring-inset (rather than the default ring-offset) since the bar itself is
// overflow-hidden (for rounded-b-md to bleed cleanly past the card's padding) and an offset ring
// would get clipped by it.
const segmentClassName =
    "flex items-center justify-center gap-1.5 px-5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground max-md:w-1/3 max-md:shrink-0 max-md:px-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

export const GameCard = ({
    name,
    gameLogo,
    url,
    buildsUrl,
    guidesUrl,
    children,
    official,
    slug,
    stats,
    noMenu,
    noTitle,
}: GameCardProps) => {
    const hasExternalUrl = url && url !== "#";
    const showOverviewAndMenu = !noMenu;
    const hasFooterActions = Boolean(buildsUrl) || Boolean(guidesUrl) || showOverviewAndMenu;
    const logoContent = (
        <div className="flex h-[96px] w-[180px] items-center justify-center p-2 md:h-[140px] md:w-[220px] md:p-4">
            {gameLogo}
        </div>
    );
    return (
        <section className="bg-card text-card-foreground relative flex flex-1 flex-col gap-1 rounded-md border p-4">
            <div className="flex flex-col">
                <div className="flex flex-row items-start gap-3">
                    {!noTitle && <h3 className="font-heading min-w-0 flex-1 text-xs">{name}</h3>}
                    <div className="ml-auto flex flex-row flex-wrap items-center justify-end gap-2">
                        {!official && <CommunityLabel />}
                        {stats?.steam && (
                            <SteamPlayersChip
                                playersCount={stats.steam.currentPlayers}
                                isComingSoon={stats.steam.isComingSoon}
                            />
                        )}
                    </div>
                </div>
                <div className="relative flex flex-col items-center gap-1">
                    <div className="relative flex min-h-[80px] w-[180px] flex-row justify-center place-self-center md:h-[140px] md:w-[220px]">
                        {hasExternalUrl ? (
                            <GuardedExternalLink
                                href={addUTM(url)}
                                isOfficial={official}
                                rel="noopener noreferrer"
                                className="select-none hover:scale-105"
                                target="_blank"
                                noIcon
                                onClick={() => sa_event(`${slug}-logo-click`)}
                            >
                                {logoContent}
                            </GuardedExternalLink>
                        ) : (
                            logoContent
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 md:gap-4">
                {children}
                {hasFooterActions && (
                    <div className="border-foreground/10 divide-foreground/10 -mx-4 mt-auto -mb-4 flex h-8 flex-row divide-x overflow-hidden rounded-b-md border-t">
                        <div className="divide-foreground/10 flex flex-1 flex-row justify-end divide-x">
                            {buildsUrl && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <a
                                            href={addResourceUTM("builds", slug)(buildsUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer nofollow"
                                            className={segmentClassName}
                                            data-sa-click={`${slug}-builds`}
                                        >
                                            <GitBranch className="h-3.5 w-3.5" />
                                            Builds
                                        </a>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        View {name} build guides
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            {guidesUrl && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <a
                                            href={addResourceUTM("guides", slug)(guidesUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer nofollow"
                                            className={segmentClassName}
                                            data-sa-click={`${slug}-guides`}
                                        >
                                            <BookOpen className="h-3.5 w-3.5" />
                                            Guides
                                        </a>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        View {name} resources
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            {showOverviewAndMenu && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={`/game/${slug}`}
                                            target="_blank"
                                            rel="noopener"
                                            className={segmentClassName}
                                            aria-label={`View ${name} overview`}
                                            data-sa-click={`${slug}-view-overview`}
                                        >
                                            <SquareChartGantt className="h-3.5 w-3.5" />
                                            Overview
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        View {name} overview
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                        {showOverviewAndMenu && (
                            <GameMenu
                                game={slug}
                                gameName={name}
                                steamAppId={stats?.steam?.appId}
                                playersCount={stats?.steam?.currentPlayers}
                            />
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};
