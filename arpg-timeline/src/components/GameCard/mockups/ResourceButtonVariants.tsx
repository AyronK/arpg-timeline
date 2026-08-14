"use client";

import { BookOpen, GitBranch } from "lucide-react";
import { ComponentType } from "react";

import { Button } from "@/ui/Button";

/**
 * Optional "Builds" / "Guides" resource links for a game card.
 * Either, both, or neither may be present — every variant below must render `null`
 * cleanly when both are absent, and a single, non-lopsided control when only one is set.
 */
export type ResourceLinks = {
    buildsUrl?: string | null;
    guidesUrl?: string | null;
};

const hasAny = ({ buildsUrl, guidesUrl }: ResourceLinks) => Boolean(buildsUrl || guidesUrl);

/* ---------------------------------------------------------------------------------------------
 * Header resource chips
 * Small pills dropped into the existing badges row (next to Community/Steam chips), styled like
 * those chips (tinted border + background, text-xs, opacity fade on idle). Small footprint, lives
 * at the top of the card rather than competing with the countdown/CTA area lower down.
 * ------------------------------------------------------------------------------------------- */
export const HeaderResourceChips = ({ buildsUrl, guidesUrl }: ResourceLinks) => {
    if (!hasAny({ buildsUrl, guidesUrl })) return null;
    return (
        <>
            {buildsUrl && (
                <a
                    href={buildsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-heading flex cursor-pointer flex-row items-center justify-center gap-1 rounded-md border border-amber-400/60 bg-amber-400/10 px-1.5 py-[1px] text-xs leading-4 font-semibold text-amber-200 opacity-80 transition-opacity select-none hover:opacity-100"
                >
                    <GitBranch className="h-3 w-3" />
                    Builds
                </a>
            )}
            {guidesUrl && (
                <a
                    href={guidesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-heading flex cursor-pointer flex-row items-center justify-center gap-1 rounded-md border border-violet-400/60 bg-violet-400/10 px-1.5 py-[1px] text-xs leading-4 font-semibold text-violet-200 opacity-80 transition-opacity select-none hover:opacity-100"
                >
                    <BookOpen className="h-3 w-3" />
                    Guides
                </a>
            )}
        </>
    );
};

/* ---------------------------------------------------------------------------------------------
 * Header action buttons
 * Text+icon buttons that form their own bordered group — styled exactly like the card's existing
 * "View details" / "More options" ghost-icon cluster — and sit immediately to its left in the
 * top-right corner. Reads as a natural extension of the card's existing action row rather than a
 * new UI element, and stays out of the season/countdown area entirely.
 * ------------------------------------------------------------------------------------------- */
export const HeaderActionResourceButtons = ({ buildsUrl, guidesUrl }: ResourceLinks) => {
    if (!hasAny({ buildsUrl, guidesUrl })) return null;
    return (
        <div className="border-foreground/10 flex flex-row items-center rounded-md border">
            {buildsUrl && (
                <Button asChild variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs">
                    <a href={buildsUrl} target="_blank" rel="noopener noreferrer">
                        <GitBranch className="h-3.5 w-3.5" />
                        Builds
                    </a>
                </Button>
            )}
            {guidesUrl && (
                <Button asChild variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs">
                    <a href={guidesUrl} target="_blank" rel="noopener noreferrer">
                        <BookOpen className="h-3.5 w-3.5" />
                        Guides
                    </a>
                </Button>
            )}
        </div>
    );
};

export type ResourceSlot = "headerExtra" | "headerActions";

export const RESOURCE_VARIANTS: ReadonlyArray<{
    key: string;
    label: string;
    description: string;
    slot: ResourceSlot;
    Component: ComponentType<ResourceLinks>;
}> = [
    {
        key: "chips",
        label: "Header resource chips",
        description: "Small tinted pills in the header badge row, next to Community/Steam chips.",
        slot: "headerExtra",
        Component: HeaderResourceChips,
    },
    {
        key: "headerActions",
        label: "Header action buttons",
        description: 'Text buttons in their own group, next to "View details" / "More options".',
        slot: "headerActions",
        Component: HeaderActionResourceButtons,
    },
];
