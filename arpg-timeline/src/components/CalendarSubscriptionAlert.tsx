"use client";

import { Rss } from "lucide-react";
import { useState } from "react";

import { CalendarSubscribeDialog } from "@/components/CalendarSubscribeDialog";
import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";
import { sa_event } from "@/lib/sa_event";
import { cn } from "@/lib/utils";

export const CalendarSubscriptionAlert = ({
    gameSlug,
    gameName,
}: {
    gameSlug?: string;
    gameName?: string;
}) => {
    const [open, setOpen] = useState(false);

    const description = gameSlug
        ? `Get launches and streams in your favorite calendar app!`
        : "Sync your calendar to all or specific games news updates!";

    return (
        <>
            <div
                role="button"
                tabIndex={0}
                onClick={() => {
                    sa_event("calendar_subscribe_opened", { game: gameSlug ?? "all" });
                    setOpen(true);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        sa_event("calendar_subscribe_opened", { game: gameSlug ?? "all" });
                        setOpen(true);
                    }
                }}
                data-sa-click={`${gameSlug ?? "all"}-calendar-subscribe-alert`}
                className={cn(getCtaBannerClassName("emerald"), "cursor-pointer")}
            >
                <CtaBannerContent
                    icon={<Rss className="m-auto h-5 w-5 opacity-70 md:h-6 md:w-6" />}
                    title="Subscribe to Calendar"
                    description={description}
                    actionLabel="Subscribe"
                    color="emerald"
                />
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
