import { Info } from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

import { StatisticsCardProps } from "../types";

interface StatisticsCardPropsWithNode extends Omit<StatisticsCardProps, "value"> {
    value: string | ReactNode;
    info?: ReactNode;
}

export const StatisticsCard = ({
    value,
    unit,
    label,
    subValue = null,
    info,
    className,
}: StatisticsCardPropsWithNode) => (
    <div className={cn("flex flex-col items-center text-center", className)}>
        <div className="text-primary text-2xl leading-tight font-bold whitespace-nowrap">
            {value}
            {unit && <span className="text-muted-foreground ml-1 text-sm font-medium">{unit}</span>}
        </div>
        <div className="text-foreground mt-1 flex items-center gap-1 text-sm">
            <span>{label}</span>
            {info && (
                <Tooltip>
                    <TooltipTrigger
                        type="button"
                        aria-label={`${label}: more info`}
                        className="inline-flex"
                    >
                        <Info className="text-muted-foreground h-3.5 w-3.5" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-56 text-center">{info}</TooltipContent>
                </Tooltip>
            )}
        </div>
        {subValue && <div className="text-muted-foreground mt-0.5 text-xs">{subValue}</div>}
    </div>
);
