"use client";

import { CalendarSync } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa6";

import { CalendarSubscribeDialog } from "@/components/CalendarSubscribeDialog";
import { sa_event } from "@/lib/sa_event";
import { cn } from "@/lib/utils";

// Same segmented footer look as the dashboard game cards; labels follow the strip width
const segmentClassName =
    "whitespace-nowrap hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex flex-1 cursor-pointer items-center justify-center gap-1.5 px-3 text-xs font-medium opacity-75 transition-colors hover:opacity-100 focus-visible:ring-2 focus-visible:outline-hidden focus-visible:ring-inset";

export const NextSeasonCtas = ({
    gameSlug,
    gameName,
    placement = "timeline",
    className,
}: {
    gameSlug: string;
    gameName: string;
    placement?: string;
    className?: string;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div
                className={cn(
                    "border-foreground/10 divide-foreground/10 @container -mx-3 -mb-3 flex h-9 divide-x overflow-hidden rounded-b-lg border-t md:-mx-4 md:-mb-4",
                    className,
                )}
            >
                <button
                    type="button"
                    className={segmentClassName}
                    data-sa-click={`${gameSlug}-${placement}-calendar-subscribe`}
                    onClick={() => {
                        sa_event("calendar_subscribe_opened", { game: gameSlug });
                        setOpen(true);
                    }}
                >
                    <CalendarSync className="h-3.5 w-3.5" aria-hidden />
                    <span className="@md:hidden">Calendar</span>
                    <span className="hidden @md:inline">Add to calendar</span>
                </button>
                <Link
                    href="/discord-bot"
                    className={segmentClassName}
                    data-sa-click={`${gameSlug}-${placement}-discord-bot`}
                >
                    <FaDiscord className="h-3.5 w-3.5" aria-hidden />
                    <span className="@md:hidden">Discord bot</span>
                    <span className="hidden @md:inline">Get the Discord bot</span>
                </Link>
            </div>
            <CalendarSubscribeDialog
                open={open}
                onOpenChange={setOpen}
                gameSlug={gameSlug}
                gameName={gameName}
            />
        </>
    );
};
