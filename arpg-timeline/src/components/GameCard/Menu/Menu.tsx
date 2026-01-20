"use client";

import { CodeXml, Info, MoreHorizontal, Rss } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RiSteamLine } from "react-icons/ri";
import { SiObsstudio } from "react-icons/si";

import { CalendarSubscribeDialog } from "@/components/CalendarSubscribeDialog";
import { DropdownMenuSeparator } from "@/components/DropdownMenu";
import { SteamDialogTrigger } from "@/components/SteamPlayersChip";
import { sa_event } from "@/lib/sa_event";
import { Button } from "@/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/ui/DropdownMenu";

export function GameMenu({
    game,
    gameName,
    playersCount,
    steamAppId,
}: {
    game: string;
    gameName?: string;
    playersCount?: number;
    steamAppId?: number;
}) {
    const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        aria-label="Share"
                        data-sa-click="game-menu"
                        className="h-8 w-8"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <Link href={`/game/${game}`} target="_blank" rel="noopener">
                        <DropdownMenuItem
                            aria-label="View game details"
                            data-sa-click={`${game}-view-details`}
                        >
                            <Info className="mr-2 h-4 w-4" />
                            Game Details
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                        onClick={() => {
                            sa_event("calendar_subscribe_opened", { game });
                            setSubscribeDialogOpen(true);
                        }}
                        aria-label="Subscribe to calendar"
                    >
                        <Rss className="mr-2 h-4 w-4" />
                        Calendar Subscription
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {steamAppId && (
                        <SteamDialogTrigger
                            appId={steamAppId}
                            gameSlug={game}
                            playersCount={playersCount ?? 0}
                        >
                            <DropdownMenuItem
                                aria-label="View steam details"
                                data-sa-click={`${game}-steam-dialog`}
                                onSelect={(e) => e.preventDefault()}
                            >
                                <RiSteamLine className="mr-2 h-4 w-4" /> Steam Data
                            </DropdownMenuItem>
                        </SteamDialogTrigger>
                    )}
                    <Link href={`/docs/html/${game}`} target="_blank" rel="noopener noreferrer">
                        <DropdownMenuItem
                            aria-label="Share on Discord"
                            data-sa-click={`${game}-html-docs`}
                        >
                            <CodeXml className="mr-2 h-4 w-4" />
                            HTML Embed
                        </DropdownMenuItem>
                    </Link>
                    <Link href={`/docs/obs/${game}`} target="_blank" rel="noopener noreferrer">
                        <DropdownMenuItem
                            aria-label="Share on Discord"
                            data-sa-click={`${game}-obs-docs`}
                        >
                            <SiObsstudio className="mr-2 h-4 w-4" />
                            OBS Widget
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>

            <CalendarSubscribeDialog
                open={subscribeDialogOpen}
                onOpenChange={setSubscribeDialogOpen}
                gameSlug={game}
                gameName={gameName}
            />
        </>
    );
}
