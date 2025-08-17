"use client";
import Link from "next/link";
import { useEffect, useMemo } from "react";

import { useScheduledRefresh } from "@/hooks/useScheduledRefresh";
import { Game } from "@/lib/cms/games.types";
import { sa_event } from "@/lib/sa_event";

import ClientOnlyVisibleWrapper from "../ClientOnlyVisibleWrapper";
import { getNextSeasonDate } from "../Home/Games";
import { Logo } from "../Logo";
import { SteamPlayersChip } from "../SteamPlayersChip";
import { GameCardProps } from "./GameCard.types";

export const EmbedRefresh = ({ game }: { game: Game }) => {
    const nextRefreshDate = useMemo(() => {
        return getNextSeasonDate([game]);
    }, [game]);

    useScheduledRefresh({
        targetDate: nextRefreshDate,
    });

    return null;
};

export const EmbedGameCard = ({ slug, gameLogo, children, stats }: GameCardProps) => {
    function handleClick() {
        let hostname = "unknown";
        try {
            if (document.referrer) {
                hostname = new URL(document.referrer).hostname;
            }
        } finally {
            sa_event(`${slug}-embed-click`, { hostname });
        }
    }

    useEffect(() => {
        let hostname = "unknown";
        try {
            if (document.referrer) {
                hostname = new URL(document.referrer).hostname;
            }
        } finally {
            sa_event(`${slug}-embed-view`, { hostname });
        }
    }, [slug]);

    return (
        <ClientOnlyVisibleWrapper>
            <Link
                href={"https://www.arpg-timeline.com"}
                target="_blank"
                rel="noopener"
                className="z-10"
                onClick={handleClick}
            >
                <section className="text-card-foreground relative flex max-w-[720px] min-w-[350px] flex-1 flex-col gap-1 rounded-md bg-transparent p-4">
                    {stats?.steam && stats?.steam?.currentPlayers && (
                        <div className="pointer-events-none absolute top-2 right-2 rounded-md bg-sky-700">
                            <SteamPlayersChip playersCount={stats.steam.currentPlayers} />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <div className="relative flex min-h-[80px] flex-1 flex-row items-center justify-between">
                            <div className="h-[72px] min-h-[72px] w-[120px]">{gameLogo}</div>
                            <div className="font-heading flex flex-row items-center opacity-50">
                                <Logo className="-mr-2 scale-50" />
                                <span className="text-nowrap">arpg-timeline.com</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-3">{children}</div>
                </section>
            </Link>
        </ClientOnlyVisibleWrapper>
    );
};
