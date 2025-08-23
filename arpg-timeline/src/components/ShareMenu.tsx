import { Share2 } from "lucide-react";
import Image from "next/image";

import { shareOnDiscord } from "@/lib/share";
import { Button } from "@/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/ui/DropdownMenu";

export const ShareMenu = ({ title, startDate }: { title: string; startDate: string }) => (
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
        <DropdownMenuContent>
            <DropdownMenuItem
                onClick={() => shareOnDiscord(title, new Date(startDate))}
                aria-label="Share on Discord"
                data-sa-click="discord"
            >
                <Image
                    className="mr-2 h-4 w-4"
                    width="24"
                    height="24"
                    src="/assets/discord-logo.svg"
                    aria-hidden
                    alt="Discord logo"
                />
                <span>Discord</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);
