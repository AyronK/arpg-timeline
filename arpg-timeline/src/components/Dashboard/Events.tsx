"use client";
import { Expand, Shrink } from "lucide-react";
import { useState } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";
import { Timeline } from "@/components/Timeline/Timeline";
import { TimelineEvent } from "@/components/Timeline/Timeline.types";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { usePartnerPromos } from "@/contexts/PartnerPromosContext";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import { ProtonDashboardCard } from "./ProtonDashboardCard";

export const Events = ({ events }: { events: TimelineEvent[] }) => {
    const [expanded, setExpanded] = useState(false);
    const { isPartnerHidden } = usePartnerPromos();
    const showProtonCard = !expanded && !isPartnerHidden("proton");
    return (
        <div className="4xl:col-span-5 lg-col-span-2 4xl:grid-cols-5 transition- relative z-0 order-3 col-span-1 grid min-h-auto! grid-cols-1 gap-4 transition-all ease-in-out ease-out md:col-span-2 md:grid-cols-2 md:gap-4 md:gap-5 lg:grid-cols-2 xl:col-span-3 xl:grid-cols-3 2xl:col-span-4 2xl:grid-cols-4">
            {showProtonCard && <ProtonDashboardCard />}
            <div
                className={cn(
                    "bg-card text-card-foreground relative flex max-h-full min-h-auto! min-w-0 flex-col gap-4 rounded-md border p-4 transition-all ease-out",
                    showProtonCard ? "md:col-start-2 md:col-end-[-1]" : "col-span-full",
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
                    data-sa-click="timeline-expand-collapse"
                >
                    {expanded ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                </Button>
                <ErrorBoundary fallback={<WidgetDiedFallback />}>
                    <Timeline events={events} />
                </ErrorBoundary>
            </div>
        </div>
    );
};
