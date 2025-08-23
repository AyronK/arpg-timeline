"use client";
import { Expand, Shrink } from "lucide-react";
import { useState } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";
import { Timeline } from "@/components/Timeline/Timeline";
import { TimelineEvent } from "@/components/Timeline/Timeline.types";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

export const Events = ({ events }: { events: TimelineEvent[] }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div
            className={cn(
                "bg-card text-card-foreground 3xl:col-span-4 4xl:col-span-5 lg-col-span-2 relative order-3 col-span-1 flex max-h-full min-h-auto! flex-col gap-4 rounded-md border p-4 transition-all ease-out md:col-span-2 md:gap-4 xl:col-span-3",
                {
                    "max-h-[272px]": !expanded,
                },
            )}
        >
            <h3 className="mb-1.5 text-xs">Timeline</h3>
            <Button
                variant="ghost"
                size="icon"
                aria-label={expanded ? "Collapse" : "Expand"}
                className="absolute top-1 right-1"
                onClick={() => setExpanded((prev) => !prev)}
            >
                {expanded ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
            </Button>
            <ErrorBoundary fallback={<WidgetDiedFallback />}>
                <Timeline events={events} />
            </ErrorBoundary>
        </div>
    );
};
