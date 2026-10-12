"use client";

import { CalendarSync, Share2 } from "lucide-react";
import { useState } from "react";

import { CalendarSubscribeDialog } from "@/components/CalendarSubscribeDialog";
import { sa_event } from "@/lib/sa_event";
import { cn } from "@/lib/utils";
import { addUTMParameters } from "@/lib/utm";
import { Button } from "@/ui/Button";
import { toast } from "@/ui/hooks/useToast";

const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_medium: "share",
    utm_campaign: "game_share",
});

// Discord bot already sits in the site header, so the hub only offers the calendar
export const HubActions = ({
    gameSlug,
    gameName,
    className,
}: {
    gameSlug: string;
    gameName: string;
    className?: string;
}) => {
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
        <div className={cn("flex items-start gap-1", className)}>
            {/* Caption beside the button on mobile, under it from md up */}
            <div className="flex items-center gap-3 md:flex-col md:gap-1">
                <Button
                    variant="outlineCard"
                    data-sa-click={`${gameSlug}-hub-calendar-subscribe`}
                    onClick={() => {
                        sa_event("calendar_subscribe_opened", { game: gameSlug });
                        setCalendarOpen(true);
                    }}
                >
                    <CalendarSync className="mr-2 h-4 w-4" aria-hidden />
                    Add to calendar
                </Button>
                <span className="text-muted-foreground text-xs">Free · no sign-up</span>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={share}
                aria-label={`Share ${gameName}`}
                data-sa-click={`${gameSlug}-hub-share`}
            >
                <Share2 className="h-4 w-4" aria-hidden />
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
