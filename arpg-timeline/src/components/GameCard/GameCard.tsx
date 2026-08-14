"use client";

import { CommunityLabel } from "@/components/CommunityLabel";
import { FooterActions } from "@/components/GameCard/FooterActions";
import { GameCardProps } from "@/components/GameCard/GameCard.types";
import { GuardedExternalLink } from "@/components/GuardedExternalLink";
import { sa_event } from "@/lib/sa_event";
import { addUTMParameters } from "@/lib/utm";

import { SteamPlayersChip } from "../SteamPlayersChip";

const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_content: "logo_link",
});

export const GameCard = ({
    name,
    gameLogo,
    url,
    buildsUrl,
    guidesUrl,
    nextSeasonStartDate,
    nextSeasonConfirmed,
    currentSeasonStartDate,
    currentSeasonEndDate,
    children,
    official,
    slug,
    stats,
    noMenu,
    noTitle,
}: GameCardProps) => {
    const hasExternalUrl = url && url !== "#";
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
                <FooterActions
                    name={name}
                    slug={slug}
                    buildsUrl={buildsUrl}
                    guidesUrl={guidesUrl}
                    nextSeasonStartDate={nextSeasonStartDate}
                    nextSeasonConfirmed={nextSeasonConfirmed}
                    currentSeasonStartDate={currentSeasonStartDate}
                    currentSeasonEndDate={currentSeasonEndDate}
                    stats={stats}
                    noMenu={noMenu}
                />
            </div>
        </section>
    );
};
