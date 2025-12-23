"use client";

import { CalendarSync, Check, Copy, Info } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/ui/Dialog";

const SITE_URL = "https://www.arpg-timeline.com";

const CopyableRow = ({ url, label }: { url: string; label: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textArea = document.createElement("textarea");
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [url]);

    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-medium">{label}</span>
            <div className="flex items-stretch gap-2">
                <button
                    tabIndex={-1}
                    onClick={handleCopy}
                    className="bg-muted hover:bg-muted/80 flex h-9 min-w-0 flex-1 cursor-pointer items-center overflow-hidden rounded-md px-3 transition-colors focus-visible:outline-hidden"
                >
                    <code className="block truncate text-xs whitespace-nowrap">{url}</code>
                </button>
                <Button
                    onClick={handleCopy}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-20 shrink-0"
                >
                    {copied ? (
                        <>
                            <Check className="mr-2 h-3.5 w-3.5" />
                            Done
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

export const CalendarSubscribeDialog = ({
    open,
    onOpenChange,
    gameSlug,
    gameName,
}: CalendarSubscribeDialogProps) => {
    const gameSubscribeUrl = gameSlug ? `${SITE_URL}/calendar/subscribe/${gameSlug}` : null;
    const allGamesSubscribeUrl = `${SITE_URL}/calendar/subscribe`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-md!"
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                    (e.target as HTMLElement)?.focus();
                }}
            >
                <DialogHeader className="items-center text-center">
                    <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                        <CalendarSync className="text-foreground h-6 w-6" />
                    </div>
                    <DialogTitle>Subscribe to Calendar</DialogTitle>
                    <DialogDescription>
                        Get automatic updates for launches and streams
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    {gameSubscribeUrl && gameName && (
                        <CopyableRow url={gameSubscribeUrl} label={gameName} />
                    )}
                    <CopyableRow url={allGamesSubscribeUrl} label="All games" />
                </div>

                <div className="text-muted-foreground flex items-center justify-center gap-1.5 text-center text-xs">
                    <Info className="h-3.5 w-3.5 shrink-0" />
                    <span>
                        Paste in your calendar app under &quot;Subscribe&quot; or &quot;Add from
                        URL&quot;
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    );
};
