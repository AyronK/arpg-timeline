import { CodeXml, Info, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { RiSteamLine } from "react-icons/ri";
import { SiObsstudio } from "react-icons/si";

import { DropdownMenuSeparator } from "@/components/DropdownMenu";
import { SteamDialogTrigger } from "@/components/SteamPlayersChip";
import { Button } from "@/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/ui/DropdownMenu";

export function GameMenu({
    game,
    playersCount,
    steamAppId,
}: {
    game: string;
    playersCount?: number;
    steamAppId?: number;
}) {
    return (
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
                            <RiSteamLine className="mr-2 h-4 w-4" /> Steam
                        </DropdownMenuItem>
                    </SteamDialogTrigger>
                )}
                <Link href={`/game/${game}`} target="_blank" rel="noopener">
                    <DropdownMenuItem
                        aria-label="View game details"
                        data-sa-click={`${game}-view-details`}
                    >
                        <Info className="mr-2 h-4 w-4" />
                        Details
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href={`/docs/html/${game}`} target="_blank" rel="noopener noreferrer">
                    <DropdownMenuItem
                        aria-label="Share on Discord"
                        data-sa-click={`${game}-html-docs`}
                    >
                        <CodeXml className="mr-2 h-4 w-4" />
                        HTML
                    </DropdownMenuItem>
                </Link>
                <Link href={`/docs/obs/${game}`} target="_blank" rel="noopener noreferrer">
                    <DropdownMenuItem
                        aria-label="Share on Discord"
                        data-sa-click={`${game}-obs-docs`}
                    >
                        <SiObsstudio className="mr-2 h-4 w-4" />
                        OBS
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
