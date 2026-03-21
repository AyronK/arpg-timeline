import Link from "next/link";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

export const CommunityLabel = () => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href="/community-launchers"
                    className="text-foreground font-heading flex cursor-pointer flex-row items-center justify-center gap-0.5 rounded-md border border-yellow-400/75 bg-yellow-400/15 px-1 py-[1px] text-xs leading-4 font-semibold opacity-80 transition-opacity select-none hover:opacity-100"
                    data-sa-click="community-label-disclaimer"
                >
                    community
                </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                Unofficial community-run game. Use at your own risk.&nbsp;
                <b>Click badge to learn more</b>.
            </TooltipContent>
        </Tooltip>
    );
};
