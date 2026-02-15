"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/ui/Button";
import { Checkbox } from "@/ui/Checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/ui/Dialog";

export const COMMUNITY_LAUNCHER_MODAL_STORAGE_KEY = "community-launcher-modal-dismissed";

type CommunityWebsiteModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
};

export const CommunityWebsiteModal = ({
    open,
    onOpenChange,
    onConfirm,
}: CommunityWebsiteModalProps) => {
    const [acknowledged, setAcknowledged] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleConfirm = () => {
        if (dontShowAgain && typeof window !== "undefined") {
            localStorage.setItem(COMMUNITY_LAUNCHER_MODAL_STORAGE_KEY, "true");
        }
        setAcknowledged(false);
        setDontShowAgain(false);
        onConfirm();
    };

    const handleCancel = () => {
        setAcknowledged(false);
        setDontShowAgain(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && handleCancel()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" aria-hidden />
                        Leaving to an unofficial site
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        This link goes to an unofficial, community-run website, game or launcher.
                        Unlike official game domains, these are not monitored or supported by game
                        studios or publishers. We do not endorse or operate it. Downloads may be
                        flagged or blocked by antivirus. <strong>Use at your own risk.</strong>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="dont-show-again"
                            checked={dontShowAgain}
                            onCheckedChange={(v) => setDontShowAgain(v === true)}
                        />
                        <label
                            htmlFor="dont-show-again"
                            className="text-muted-foreground cursor-pointer text-sm"
                        >
                            Don&apos;t show this again
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="acknowledge-risk"
                            checked={acknowledged}
                            onCheckedChange={(v) => setAcknowledged(v === true)}
                        />
                        <label htmlFor="acknowledge-risk" className="cursor-pointer text-sm">
                            I understand the risks and want to continue
                        </label>
                    </div>
                </div>
                <DialogFooter className="flex-col gap-2 md:flex-row">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={!acknowledged}>
                        Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
