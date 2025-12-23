"use client";

import { CalendarSync, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Button } from "@/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/ui/Dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerPortal,
    DrawerTitle,
} from "@/ui/Drawer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const CopyableRow = ({
    url,
    label,
    compact,
}: {
    url: string;
    label: string;
    compact?: boolean;
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [url]);

    if (compact) {
        return (
            <button
                onClick={handleCopy}
                className="bg-muted hover:bg-muted/80 flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-4 py-3 transition-colors"
            >
                <span className="text-sm font-medium">{label}</span>
                <span className="text-muted-foreground flex shrink-0 items-center text-sm">
                    {copied ? (
                        <>
                            <Check className="mr-1.5 h-4 w-4" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy className="mr-1.5 h-4 w-4" />
                            Copy
                        </>
                    )}
                </span>
            </button>
        );
    }

    return (
        <div className="flex min-w-0 flex-col gap-2">
            <span className="text-xs font-medium">{label}</span>
            <div className="flex min-w-0 items-stretch gap-2">
                <button
                    tabIndex={-1}
                    onClick={handleCopy}
                    className="bg-muted hover:bg-muted/80 flex h-9 min-w-0 flex-1 cursor-pointer items-center overflow-hidden rounded-md px-3 transition-colors focus-visible:outline-hidden"
                >
                    <code className="block max-w-full min-w-0 truncate text-xs">{url}</code>
                </button>
                <Button
                    onClick={handleCopy}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-24 shrink-0"
                >
                    {copied ? (
                        <>
                            <Check className="mr-2 h-3.5 w-3.5" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy className="mr-2 h-3.5 w-3.5" />
                            Copy
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export interface CalendarSubscribeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    gameSlug?: string;
    gameName?: string;
}

const SubscribeContent = ({
    gameSlug,
    gameName,
    compact,
}: {
    gameSlug?: string;
    gameName?: string;
    compact?: boolean;
}) => {
    const gameSubscribeUrl = gameSlug ? `${SITE_URL}/calendar/subscribe/${gameSlug}` : null;
    const allGamesSubscribeUrl = `${SITE_URL}/calendar/subscribe`;
    const isGeneric = !gameSlug || !gameName;

    return (
        <>
            <div className="flex min-w-0 flex-col gap-3 overflow-hidden">
                {gameSubscribeUrl && gameName && (
                    <CopyableRow url={gameSubscribeUrl} label={gameName} compact={compact} />
                )}
                <CopyableRow url={allGamesSubscribeUrl} label="All games" compact={compact} />
            </div>

            {isGeneric && (
                <div className="bg-muted/50 mt-2 rounded-md border px-4 py-3 text-center">
                    <p className="text-foreground text-sm font-medium">
                        Want updates for a specific game?
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                        Subscribe from the game menu or details page. You can pick as many as you
                        want!
                    </p>
                </div>
            )}

            <p className="text-muted-foreground mt-2 text-center text-xs text-balance">
                Paste in your calendar app under &quot;Subscribe&quot; or &quot;Add from URL&quot;
            </p>

            <p className="text-muted-foreground mt-3 text-center text-xs opacity-70">
                Free for personal use.{" "}
                <Link href="/calendar" className="underline underline-offset-2">
                    Commercial use?
                </Link>
            </p>
        </>
    );
};

const HeaderIcon = () => (
    <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
        <CalendarSync className="text-foreground h-6 w-6" />
    </div>
);

export const CalendarSubscribeDialog = ({
    open,
    onOpenChange,
    gameSlug,
    gameName,
}: CalendarSubscribeDialogProps) => {
    const { isMd } = useBreakpoint("md");

    if (!isMd) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerPortal>
                    <DrawerContent className="top-auto! px-6 pb-28">
                        <DrawerHeader className="items-center text-center">
                            <HeaderIcon />
                            <DrawerTitle>Subscribe to Calendar</DrawerTitle>
                            <DrawerDescription>
                                Get automatic updates for launches and streams
                            </DrawerDescription>
                        </DrawerHeader>
                        <SubscribeContent gameSlug={gameSlug} gameName={gameName} compact />
                    </DrawerContent>
                </DrawerPortal>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-2xl! overflow-hidden"
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                    (e.target as HTMLElement)?.focus();
                }}
            >
                <DialogHeader className="items-center text-center">
                    <HeaderIcon />
                    <DialogTitle>Subscribe to Calendar</DialogTitle>
                    <DialogDescription>
                        Get automatic updates for launches and streams
                    </DialogDescription>
                </DialogHeader>
                <SubscribeContent gameSlug={gameSlug} gameName={gameName} />
            </DialogContent>
        </Dialog>
    );
};
