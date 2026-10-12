import Link from "next/link";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

// Neutral info badges; colour stays reserved for Now/Next status
const neutralChip =
    "font-ui border-foreground/25 text-muted-foreground rounded-md border px-2 py-[1px] text-xs font-semibold opacity-80 transition-opacity select-none hover:opacity-100 focus-visible:ring-ring focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none";

// Sits next to the status Chip (Now/Next) on Overview cards and the Timeline
export const SideEventChip = () => (
    <Tooltip>
        <TooltipTrigger asChild>
            <span tabIndex={0} className={cn(neutralChip, "cursor-help")}>
                Side event
            </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
            Smaller, less official event, often a filler between main releases.
        </TooltipContent>
    </Tooltip>
);

// Coming soon replaces Early Access until the game is out
export const EarlyAccessChip = ({
    gameSlug,
    isComingSoon,
}: {
    gameSlug: string;
    isComingSoon?: boolean;
}) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Link
                href="/dashboard/early-access"
                className={neutralChip}
                data-sa-click={`${gameSlug}-${isComingSoon ? "coming-soon" : "early-access"}-badge`}
            >
                {isComingSoon ? "Coming soon" : "Early Access"}
            </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
            {isComingSoon
                ? "Not released yet."
                : "Not fully released yet, so content and dates change often."}
            &nbsp;<b>Click badge to see all Early Access games</b>.
        </TooltipContent>
    </Tooltip>
);
