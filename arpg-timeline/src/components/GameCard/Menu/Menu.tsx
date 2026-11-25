"use client";

import { CodeXml, EyeOff, MoreHorizontal, Rss } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SiObsstudio } from "react-icons/si";

import { CalendarSubscribeDialog } from "@/components/CalendarSubscribeDialog";
import { DropdownMenuSeparator } from "@/components/DropdownMenu";
import { useOptionalGameFilterContext } from "@/contexts/GameFilterContext";
import { sa_event } from "@/lib/sa_event";
import { Button } from "@/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/ui/DropdownMenu";
import { toast } from "@/ui/hooks/useToast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

export function GameMenu({ game, gameName }: { game: string; gameName?: string }) {
    const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const filters = useOptionalGameFilterContext();
    const canHide = filters?.category === "featured";

    return (
        <>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <Tooltip open={dropdownOpen ? false : undefined}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                aria-label="Share"
                                data-sa-click="game-menu"
                                className="h-8 w-8 focus-visible:ring-inset"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">More options</TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end">
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
                    {canHide && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                data-sa-click={`${game}-hide`}
                                onClick={() => {
                                    filters.toggleGameFilter(game, false);
                                    toast({
                                        title: `${gameName ?? "Game"} is hidden from your dashboard`,
                                        duration: 3000,
                                    });
                                }}
                            >
                                <EyeOff className="mr-2 h-4 w-4" />
                                Hide from dashboard
                            </DropdownMenuItem>
                        </>
                    )}
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
