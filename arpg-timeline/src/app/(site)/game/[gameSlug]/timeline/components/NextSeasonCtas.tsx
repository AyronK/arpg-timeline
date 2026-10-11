"use client";

import { CalendarSync } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa6";

import { CalendarSubscribeDialog } from "@/components/CalendarSubscribeDialog";
import { sa_event } from "@/lib/sa_event";

// Same segmented footer look as the dashboard game cards
const segmentClassName =
    "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex flex-1 cursor-pointer items-center justify-center gap-1.5 px-3 text-xs font-medium opacity-75 transition-colors hover:opacity-100 focus-visible:ring-2 focus-visible:outline-hidden focus-visible:ring-inset";

export const NextSeasonCtas = ({ gameSlug, gameName }: { gameSlug: string; gameName: string }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="border-foreground/10 divide-foreground/10 -mx-3 -mb-3 flex h-9 divide-x overflow-hidden rounded-b-lg border-t md:-mx-4 md:-mb-4">
                <button
                    type="button"
                    className={segmentClassName}
                    data-sa-click={`${gameSlug}-timeline-calendar-subscribe`}
                    onClick={() => {
                        sa_event("calendar_subscribe_opened", { game: gameSlug });
                        setOpen(true);
                    }}
                >
                    <CalendarSync className="h-3.5 w-3.5" aria-hidden />
                    Subscribe to calendar
                </button>
                <Link
                    href="/discord-bot"
                    className={segmentClassName}
                    data-sa-click={`${gameSlug}-timeline-discord-bot`}
                >
                    <FaDiscord className="h-3.5 w-3.5" aria-hidden />
                    Get the Discord bot
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
