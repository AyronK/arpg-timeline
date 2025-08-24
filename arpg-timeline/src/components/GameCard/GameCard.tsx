"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";

import { CommunityLabel } from "@/components/CommunityLabel";
import { GameCardProps } from "@/components/GameCard/GameCard.types";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { sa_event } from "@/lib/sa_event";
import { addUTMParameters } from "@/lib/utm";
import { Button } from "@/ui/Button";

import { SteamPlayersChip } from "../SteamPlayersChip";
import { GameMenu } from "./Menu/Menu";

const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_content: "logo_link",
});

export const GameCard = ({
    name,
    gameLogo,
    url,
    children,
    official,
    slug,
    stats,
    noMenu,
}: GameCardProps) => {
    return (
        <section className="bg-card text-card-foreground relative flex flex-1 flex-col gap-1 rounded-md border p-4">
            <div className="flex flex-col">
                <div className="flex flex-row items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <h3 className="font-heading text-xs">{name}</h3>
                        <div className="flex flex-row flex-wrap items-center justify-start gap-2">
                            {!official && <CommunityLabel />}
                            {stats?.steam && (
                                <SteamPlayersChip
                                    playersCount={stats.steam.currentPlayers}
                                    isComingSoon={stats.steam.isComingSoon}
                                />
                            )}
                        </div>
                    </div>
                    {!noMenu && (
                        <div className="border-foreground/10 flex flex-row items-center rounded-md border">
                            <Button
                                asChild
                                className="h-8 w-8"
                                variant="ghost"
                                size="icon"
                                aria-label={`View ${name} details`}
                                data-sa-click={`${slug}-view-details`}
                            >
                                <Link href={`/game/${slug}`} target="_blank" rel="noopener">
                                    <BookOpen className="h-4 w-4" />
                                    <span className="sr-only">Details</span>
                                </Link>
                            </Button>
                            <GameMenu
                                game={slug}
                                steamAppId={stats?.steam?.appId}
                                playersCount={stats?.steam?.currentPlayers}
                            />
                        </div>
                    )}
                </div>
                <div className="relative flex min-h-[80px] w-[120px] flex-row justify-center place-self-center md:h-[140px] md:w-[160px]">
                    <MaybeLinkWrapper
                        href={url ? addUTM(url) : null}
                        rel="noopener"
                        className="select-none hover:scale-105"
                        target="_blank"
                        noIcon
                        onClick={() => sa_event(`${slug}-logo-click`)}
                    >
                        <div className="grid h-[72px] min-h-[72px] w-[120px] md:h-[140px] md:w-[160px]">
                            {gameLogo}
                        </div>
                    </MaybeLinkWrapper>
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 md:gap-4">{children}</div>
        </section>
    );
};
