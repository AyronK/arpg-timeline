"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/ui/Dialog";

const SITE_URL = "https://www.arpg-timeline.com";

const CopyableUrl = ({ url, label }: { url: string; label: string }) => {
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
            <h3 className="text-sm font-semibold">{label}</h3>
            <button
                onClick={handleCopy}
                className="bg-muted hover:bg-muted/80 group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left transition-colors"
            >
                <code className="flex-1 text-xs break-all">{url}</code>
                <div className="text-muted-foreground shrink-0">
                    {copied ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                        <Copy className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100" />
                    )}
                </div>
            </button>
            {copied && <span className="text-xs text-emerald-500">Copied to clipboard!</span>}
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
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Subscribe to Calendar</DialogTitle>
                    <DialogDescription>
                        Get automatic updates for upcoming seasons and streams
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6">
                    {gameSubscribeUrl && gameName && (
                        <CopyableUrl url={gameSubscribeUrl} label={`${gameName} only`} />
                    )}

                    <CopyableUrl url={allGamesSubscribeUrl} label="All games" />

                    <div className="bg-muted/50 flex flex-col gap-2 rounded-lg p-4">
                        <h4 className="text-sm font-semibold">How to subscribe</h4>
                        <ol className="text-muted-foreground list-inside list-decimal space-y-1 text-sm">
                            <li>Copy the URL above</li>
                            <li>Open your calendar app</li>
                            <li>
                                Look for &quot;Subscribe to calendar&quot; or &quot;Add calendar
                                from URL&quot;
                            </li>
                            <li>Paste the URL and confirm</li>
                        </ol>
                        <p className="text-muted-foreground mt-2 text-xs">
                            Your calendar will automatically sync with new events as they are
                            announced.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

