import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { StatisticsCardProps } from "../types";

interface StatisticsCardPropsWithNode extends Omit<StatisticsCardProps, "value"> {
    value: string | ReactNode;
}

export const StatisticsCard = ({
    value,
    label,
    subValue = null,
    className,
}: StatisticsCardPropsWithNode) => (
    <div className={cn("text-center", className)}>
        <div className="text-primary text-2xl font-bold">{value}</div>
        <div className="text-foreground text-sm">{label}</div>
        {subValue && <div className="text-foreground mt-1 text-xs">{subValue}</div>}
    </div>
);
