import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export const Chip = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
    <span
        className={cn(
            "font-ui text-foreground rounded-md px-2 py-[1px] text-xs font-semibold",
            className,
        )}
    >
        {children}
    </span>
);
