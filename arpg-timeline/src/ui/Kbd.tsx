import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Kbd = ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <kbd
        className={cn(
            "font-ui border-foreground/20 bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center gap-0.5 rounded border px-1 text-[11px] leading-none font-medium",
            className,
        )}
        {...props}
    />
);
