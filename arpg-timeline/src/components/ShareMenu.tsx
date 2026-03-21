"use client";
import { Send, Share2 } from "lucide-react";
import Image from "next/image";

import { useShareAction } from "@/hooks/useShareAction";
import { shareOnDiscord } from "@/lib/share";
import { Button } from "@/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/ui/DropdownMenu";

export const ShareMenu = ({
    title,
    startDate,
    timeUnknown,
}: {
    title: string;
    startDate: string;
    timeUnknown?: boolean;
}) => {
    const { handleShare } = useShareAction(null, {
        utm_source: "arpg-timeline",
        utm_medium: "share_menu",
        utm_campaign: "season_share",
        utm_content: title,
    });

    const getDateText = () => {
        if (timeUnknown) {
            const daysUntil = Math.ceil(
                (new Date(startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
            );
            return `in ${daysUntil} days`;
        }
        return new Date(startDate).toLocaleDateString();
    };

    const handleNativeShare = () => {
        handleShare({
            title: title,
            text: `Check out the ${title} starting ${getDateText()}`,
            url: window.location.href,
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"link"}
                    className="h-[32px]! w-[32px]! flex-1 md:h-[40px]! md:w-[40px]!"
                    size={"icon"}
                    aria-label="Share"
                    data-sa-click="share-menu"
                >
                    <Share2 className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem
                    onClick={handleNativeShare}
                    aria-label="Share"
                    data-sa-click="native-share"
                >
                    <Send className="mr-2 h-4 w-4" />
                    <span>Share with others</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => shareOnDiscord(title, new Date(startDate), timeUnknown)}
                    aria-label="Share on Discord"
                    data-sa-click="discord"
                >
                    <Image
                        loading="lazy"
                        unoptimized
                        className="mr-2 h-4 w-4"
                        width="24"
                        height="24"
                        src="/assets/discord-logo.svg"
                        aria-hidden
                        alt="Discord logo"
                    />
                    <span>Paste on Discord</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
