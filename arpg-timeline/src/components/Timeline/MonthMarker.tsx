import { FC } from "react";

import { MonthMarkerProps } from "./Timeline.types";

export const MonthMarker: FC<MonthMarkerProps> = ({ marker, index }) => (
    <div
        key={index}
        className="group absolute top-0 flex h-full items-center first-of-type:left-0! max-md:even:hidden"
        suppressHydrationWarning
        style={{ left: `${marker.position}%` }}
    >
        <div className="h-full w-px" />
        <div className="text-card-foreground font-heading ml-2 text-xs text-nowrap select-none group-first-of-type:ml-0">
            {marker.label}
        </div>
    </div>
);
