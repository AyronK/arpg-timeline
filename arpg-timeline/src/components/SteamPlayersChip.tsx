import { Description } from "@radix-ui/react-toast";
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

export const SteamPlayersChip = ({ playersCount }: { playersCount: number }) => {
    const description = `${playersCount} players online on Steam`;

    const text =
        playersCount > 1_000_000
            ? `${Math.floor(playersCount / 1_000_000)}m`
            : playersCount > 1_000
              ? `${Math.floor(playersCount / 1_000)}k`
              : playersCount;
    return (
        <span
            title={description}
            className="font-ui text-foreground flex cursor-pointer flex-row items-center justify-center gap-0.5 rounded-md border border-sky-700/75 bg-sky-600/15 px-1 py-[1px] text-xs font-semibold opacity-80 transition-all select-none hover:opacity-100"
        >
            <RiSteamLine className="h-4 w-4" />
            <span aria-hidden>{text}</span>
            <span className="sr-only">{description}</span>
            <PiUsersThree className="h-4 w-4" />
        </span>
    );
};

export const SteamPlayersChipButton = ({
    playersCount,
    appId,
    gameSlug,
}: {
    playersCount: number;
    appId: number;
    gameSlug: string;
}) => {
    const description = `${playersCount} players online on Steam`;

    return (
        <Dialog>
            <DialogTrigger aria-description={description} data-sa-click={`steam-${gameSlug}`}>
                <SteamPlayersChip playersCount={playersCount} />
            </DialogTrigger>
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

                <SteamDBEmbed appId={appId} />
            </DialogContent>
        </Dialog>
    );
};
