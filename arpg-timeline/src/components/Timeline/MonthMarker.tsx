import { FC } from "react";

import { cn } from "@/lib/utils";

import { MonthMarkerProps } from "./Timeline.types";

export const MonthMarker: FC<MonthMarkerProps> = ({ marker, index, totalMarkers }) => (
    <div
        key={index}
        className="group border-foreground/25 absolute top-0 flex h-full items-center border-l first-of-type:left-0! max-md:even:hidden"
        suppressHydrationWarning
        style={{ left: `${marker.position}%`, width: `${(1 / (totalMarkers - 1)) * 100}%` }}
    >
        <div className="h-full w-px" />
        <div
            className={cn(
                `text-card-foreground font-heading mx-2 w-full text-center text-xs text-nowrap select-none group-first:text-left group-last:text-left`,
            )}
        >
            {marker.label}
        </div>
    </div>
);
