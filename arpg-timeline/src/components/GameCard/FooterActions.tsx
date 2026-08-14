"use client";

import { BookOpen, GitBranch, SquareChartGantt } from "lucide-react";
import Link from "next/link";

import { GameCardProps } from "@/components/GameCard/GameCard.types";
import { addUTMParameters } from "@/lib/utm";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

import { GameMenu } from "./Menu/Menu";
import { useEmphasizeBuilds } from "./useEmphasizeBuilds";

const addResourceUTM = (kind: "builds" | "guides", slug: string) =>
    addUTMParameters({
        utm_source: "arpg-timeline",
        utm_medium: "link",
        utm_campaign: kind,
        utm_content: slug,
    });

const segmentClassName =
    "opacity-75 hover:opacity-100 flex items-center justify-center gap-1.5 px-5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground max-md:w-1/3 max-md:shrink-0 max-md:px-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

const emphasizedBuildsClassName =
    "opacity-75 hover:opacity-100 flex flex-1 items-center justify-center gap-1.5 px-5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

const emphasizedSiblingClassName =
    "flex w-8 shrink-0 items-center justify-center transition-colors opacity-75 hover:opacity-100 hover:bg-accent hover:text-accent-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

type FooterActionsProps = Pick<
    GameCardProps,
    | "name"
    | "slug"
    | "buildsUrl"
    | "guidesUrl"
    | "nextSeasonStartDate"
    | "nextSeasonConfirmed"
    | "currentSeasonStartDate"
    | "currentSeasonEndDate"
    | "stats"
    | "noMenu"
>;

export const FooterActions = ({
    name,
    slug,
    buildsUrl,
    guidesUrl,
    nextSeasonStartDate,
    nextSeasonConfirmed,
    currentSeasonStartDate,
    currentSeasonEndDate,
    stats,
    noMenu,
}: FooterActionsProps) => {
    const showOverviewAndMenu = !noMenu;
    const hasFooterActions = Boolean(buildsUrl) || Boolean(guidesUrl) || showOverviewAndMenu;
    const emphasizeBuildsTiming = useEmphasizeBuilds(
        nextSeasonStartDate,
        nextSeasonConfirmed,
        currentSeasonStartDate,
        currentSeasonEndDate,
    );
    const emphasizeBuilds = emphasizeBuildsTiming && Boolean(buildsUrl);

    if (!hasFooterActions) return null;

    return (
        <div className="border-foreground/10 divide-foreground/10 -mx-4 mt-auto -mb-4 flex h-8 flex-row divide-x overflow-hidden rounded-b-md border-t">
            <div className="divide-foreground/10 flex flex-1 flex-row justify-end divide-x">
                {buildsUrl && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a
                                href={addResourceUTM("builds", slug)(buildsUrl)}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className={
                                    emphasizeBuilds ? emphasizedBuildsClassName : segmentClassName
                                }
                                data-sa-click={`${slug}-builds`}
                            >
                                <GitBranch className="h-3.5 w-3.5" />
                                {emphasizeBuilds ? "Find a build" : "Builds"}
                            </a>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">View {name} build guides</TooltipContent>
                    </Tooltip>
                )}
                {guidesUrl && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a
                                href={addResourceUTM("guides", slug)(guidesUrl)}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className={
                                    emphasizeBuilds ? emphasizedSiblingClassName : segmentClassName
                                }
                                data-sa-click={`${slug}-guides`}
                            >
                                <BookOpen className="h-3.5 w-3.5" />
                                <span className={emphasizeBuilds ? "sr-only" : undefined}>
                                    Guides
                                </span>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">View {name} resources</TooltipContent>
                    </Tooltip>
                )}
                {showOverviewAndMenu && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href={`/game/${slug}`}
                                target="_blank"
                                rel="noopener"
                                className={
                                    emphasizeBuilds ? emphasizedSiblingClassName : segmentClassName
                                }
                                aria-label={`View ${name} overview`}
                                data-sa-click={`${slug}-view-overview`}
                            >
                                <SquareChartGantt className="h-3.5 w-3.5" />
                                <span className={emphasizeBuilds ? "sr-only" : undefined}>
                                    Overview
                                </span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">View {name} overview</TooltipContent>
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
    );
};
