import { FC } from "react";

export const TimelineLegend: FC = () => (
    <div className="flex flex-row justify-end">
        <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
                <div className="h-3 w-6 bg-sky-900 shadow-sm" />
                <span className="text-card-foreground">Current Event</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-3 w-6 rounded-tr-2xl border border-dashed border-emerald-800/75 bg-emerald-900/25" />
                <span className="text-card-foreground">Next Presumed Event</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-3 w-6 rounded-tr-2xl rounded-br-xs bg-emerald-900 ring ring-emerald-500" />
                <span className="text-card-foreground">Next Confirmed Event</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="border-destructive/50 h-3 w-1 border-l" />
                <span className="text-card-foreground">Today</span>
            </div>
        </div>
    </div>
);
