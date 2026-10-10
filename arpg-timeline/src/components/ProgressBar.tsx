import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

export const ProgressBar = ({
    progress,
    clamp,
    pulse,
    label,
}: {
    progress: number;
    clamp?: boolean | undefined;
    pulse?: boolean | undefined;
    label?: string | null | undefined;
}) => {
    const bar = (
        <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(Math.min(Math.max(progress, 0), 100))}
            aria-label={label ?? undefined}
            tabIndex={label ? 0 : undefined}
            suppressHydrationWarning
            className={cn(
                "relative h-2 w-full overflow-hidden rounded-tl-full rounded-br-full bg-sky-200/15",
                {
                    "focus-visible:ring-ring cursor-help focus-visible:ring-2 focus-visible:outline-none":
                        label,
                },
            )}
        >
            <div
                suppressHydrationWarning
                className={cn("absolute top-0 right-0 bottom-0 rounded-tl-full bg-sky-800", {
                    ["motion-safe:animate-pulse"]: pulse,
                })}
                style={{
                    left:
                        progress >= 100
                            ? "100%"
                            : clamp
                              ? `${Math.min(Math.max(progress, 3), 95)}%`
                              : `${progress}%`,
                }}
            />
        </div>
    );

    if (!label) return bar;

    return (
        <Tooltip>
            <TooltipTrigger asChild>{bar}</TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4}>
                {label}
            </TooltipContent>
        </Tooltip>
    );
};
