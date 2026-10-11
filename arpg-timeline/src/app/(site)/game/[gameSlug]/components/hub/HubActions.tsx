"use client";

import { Bell, CalendarSync, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa6";

import { CalendarSubscribeDialog } from "@/components/CalendarSubscribeDialog";
import { sa_event } from "@/lib/sa_event";
import { addUTMParameters } from "@/lib/utm";
import { Button } from "@/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/ui/DropdownMenu";
import { toast } from "@/ui/hooks/useToast";

const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_medium: "share",
    utm_campaign: "game_share",
});

export const HubActions = ({ gameSlug, gameName }: { gameSlug: string; gameName: string }) => {
    const [calendarOpen, setCalendarOpen] = useState(false);

    const share = async () => {
        const url = addUTM(window.location.href);
        const title = `${gameName} on aRPG Timeline`;
        if (navigator.share) {
            try {
                await navigator.share({ title, text: title, url });
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    console.error("Error sharing:", error);
                }
            }
            return;
        }
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied", withLogo: true, duration: 3000 });
    };

    return (
        <div className="flex flex-wrap gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button data-sa-click={`${gameSlug}-hub-get-notified`}>
                        <Bell className="mr-2 h-4 w-4" aria-hidden />
                        Get notified
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        data-sa-click={`${gameSlug}-hub-calendar-subscribe`}
                        onSelect={() => {
                            sa_event("calendar_subscribe_opened", { game: gameSlug });
                            setCalendarOpen(true);
                        }}
                    >
                        <CalendarSync className="mr-2 h-4 w-4" aria-hidden />
                        Add to calendar
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/discord-bot" data-sa-click={`${gameSlug}-hub-discord-bot`}>
                            <FaDiscord className="mr-2 h-4 w-4" aria-hidden />
                            Discord bot
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={share} data-sa-click={`${gameSlug}-hub-share`}>
                <Share2 className="mr-2 h-4 w-4" aria-hidden />
                Share
            </Button>
            <CalendarSubscribeDialog
                open={calendarOpen}
                onOpenChange={setCalendarOpen}
                gameSlug={gameSlug}
                gameName={gameName}
            />
        </div>
    );
};
