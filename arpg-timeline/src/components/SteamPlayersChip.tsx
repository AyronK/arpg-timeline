"use client";

import { DialogPortal } from "@radix-ui/react-dialog";
import { Description } from "@radix-ui/react-toast";
import { useState } from "react";
import { PiUsersThree } from "react-icons/pi";
import { RiSteamLine } from "react-icons/ri";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/ui/Dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

import { SteamDBEmbed } from "./SteamDBEmbed";
import { SteamEmbed } from "./SteamEmbed";

export const SteamPlayersChip = ({
    playersCount,
    isComingSoon,
    appId,
    game,
}: {
    playersCount: number;
    isComingSoon?: boolean;
    appId?: number;
    game?: string;
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const hasDialog = typeof appId === "number" && appId > 0;
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

    const chipClassName =
        "text-foreground flex flex-row items-center justify-center gap-0.5 rounded-md border border-sky-700/75 bg-sky-600/15 px-1 py-[1px] text-xs font-semibold opacity-80 shadow-sky-400/25 select-none";

    const chipContent = (
        <>
            {playersCount > 0 && <PiUsersThree className="h-4 w-4" />}
            <span className="mx-1" aria-hidden>
                {text}
            </span>
            <span className="sr-only">{description}</span>
            <RiSteamLine className="h-4 w-4" />
        </>
    );

    if (!hasDialog) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className={`${chipClassName} cursor-help`}>{chipContent}</span>
                </TooltipTrigger>
                {description && <TooltipContent side="bottom">{description}</TooltipContent>}
            </Tooltip>
        );
    }

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        aria-label="View Steam details"
                        data-sa-click={game ? `${game}-steam-dialog` : undefined}
                        onClick={() => setDialogOpen(true)}
                        className={`${chipClassName} focus-visible:ring-ring cursor-pointer transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none`}
                    >
                        {chipContent}
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{description ?? "View Steam details"}</TooltipContent>
            </Tooltip>
            <SteamDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                appId={appId}
                playersCount={playersCount}
            />
        </>
    );
};

export const SteamDialog = ({
    playersCount,
    appId,
    open,
    onOpenChange,
}: {
    playersCount: number;
    appId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
