"use client";
import { CommunityLabel } from "@/components/CommunityLabel";
import { GameCardProps } from "@/components/GameCard/GameCard.types";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { sa_event } from "@/lib/sa_event";
import { addUTMParameters } from "@/lib/utm";

import { SteamPlayersChipButton } from "../SteamPlayersChip";

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
}: GameCardProps) => {
    return (
        <section className="bg-card text-card-foreground relative flex flex-1 flex-col gap-1 rounded-md border p-4">
            <div className="flex flex-col">
                <div className="flex flex-row items-center justify-between">
                    <h3 className="font-heading text-xs">{name}</h3>
                    {!official && <CommunityLabel />}
                    {stats?.steam && (
                        <SteamPlayersChipButton
                            appId={stats.steam.appId}
                            playersCount={stats.steam.currentPlayers}
                            gameSlug={slug}
                        />
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
