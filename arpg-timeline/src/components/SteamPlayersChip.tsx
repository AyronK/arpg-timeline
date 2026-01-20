import { DialogPortal } from "@radix-ui/react-dialog";
import { Description } from "@radix-ui/react-toast";
import { PropsWithChildren } from "react";
import { PiUsersThree } from "react-icons/pi";
import { RiSteamLine } from "react-icons/ri";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/ui/Dialog";

import { SteamDBEmbed } from "./SteamDBEmbed";
import { SteamEmbed } from "./SteamEmbed";

export const SteamPlayersChip = ({
    playersCount,
    isComingSoon,
}: {
    playersCount: number;
    isComingSoon?: boolean;
}) => {
    const description = playersCount > 0 ? `${playersCount} players online on Steam` : undefined;

    const formatPlayerCount = (count: number): string => {
        if (count > 1_000_000) return `${Math.floor(count / 1_000_000)}m`;
        if (count > 1_000) return `${Math.floor(count / 1_000)}k`;
        return count.toString();
    };

    const text = isComingSoon
        ? "Wishlist on"
        : playersCount <= 0
          ? "Steam"
          : formatPlayerCount(playersCount);

    return (
        <span
            title={description}
            className="text-foreground flex cursor-help flex-row items-center justify-center gap-0.5 rounded-md border border-sky-700/75 bg-sky-600/15 px-1 py-[1px] text-xs font-semibold opacity-80 shadow-sky-400/25 select-none"
        >
            {playersCount > 0 && <PiUsersThree className="h-4 w-4" />}
            <span className="mx-1" aria-hidden>
                {text}
            </span>
            <span className="sr-only">{description}</span>
            <RiSteamLine className="h-4 w-4" />
        </span>
    );
};

export const SteamDialogTrigger = ({
    playersCount,
    appId,
    gameSlug,
    children,
}: PropsWithChildren<{
    playersCount: number;
    appId: number;
    gameSlug: string;
    isComingSoon?: boolean;
}>) => {
    const description = `${playersCount} players online on Steam`;

    return (
        <Dialog>
            <DialogTrigger
                aria-description={description}
                data-sa-click={`steam-${gameSlug}`}
                asChild
            >
                {children}
            </DialogTrigger>
            <DialogPortal>
                <DialogContent className="w-[95vw] md:max-w-4xl!">
                    <DialogHeader>
                        <DialogTitle className="flex flex-row">
                            <RiSteamLine className="mr-2 h-4 w-4" />
                            Steam
                        </DialogTitle>
                        <DialogDescription asChild>
                            <Description />
                        </DialogDescription>
                    </DialogHeader>
                    <SteamEmbed appId={appId} />
                    {playersCount > 0 && <SteamDBEmbed appId={appId} />}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
};
