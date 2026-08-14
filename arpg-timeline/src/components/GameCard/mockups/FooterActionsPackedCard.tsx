"use client";

import { BookOpen, GitBranch, MoreHorizontal, ScrollText } from "lucide-react";
import { ReactNode } from "react";

import { CommunityLabel } from "@/components/CommunityLabel";
import { SteamPlayersChip } from "@/components/SteamPlayersChip";

import { ResourceLinks } from "./ResourceButtonVariants";
import { Logo, MockGame } from "./ResourceMockCard";

const segmentClassName =
    "flex items-center justify-center gap-1.5 px-5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground max-md:w-1/3 max-md:shrink-0 max-md:px-2";

/**
 * Variant 5 — same "everything moves to the footer" idea as FooterActionsCard, but fixes the two
 * problems a reserved-column grid creates: a missing button used to leave a blank, bordered,
 * button-shaped gap (looked clickable but wasn't), and whichever buttons *were* present would
 * shift into different slots depending on what was missing.
 *
 * Only the buttons that actually exist are rendered, packed together and anchored to the bar's
 * right edge inside a flex-1 wrapper (so "available space" always means the bar minus the fixed
 * "More" column). Details and More are unconditional, so they always land in the exact same spot
 * on every card; Builds/Guides simply prepend to their left when present. Leftover space is left
 * empty on purpose — no border or hover state is drawn there, so it never reads as a dead button.
 *
 * At md and up, each button sizes to its own content (stable regardless of sibling count). On
 * mobile, three intrinsically-sized right-packed buttons look cramped on a full-width card, so
 * there each button instead takes a fixed 1/3 of the available space — always, regardless of how
 * many are actually present — rather than stretching to fill whatever's left over.
 */
export const FooterActionsPackedCard = ({
    game,
    resources,
    children,
}: {
    game: MockGame;
    resources: ResourceLinks;
    children?: ReactNode;
}) => {
    const { buildsUrl, guidesUrl } = resources;

    return (
        <section className="bg-card text-card-foreground relative flex flex-1 flex-col gap-1 rounded-md border p-4">
            <div className="flex flex-col">
                <div className="flex flex-row items-start justify-between gap-3">
                    <h3 className="font-heading min-w-0 flex-1 text-xs">{game.name}</h3>
                    <div className="flex flex-row flex-wrap items-center justify-end gap-2">
                        {!game.official && <CommunityLabel />}
                        {game.steamPlayers !== undefined && (
                            <SteamPlayersChip playersCount={game.steamPlayers} />
                        )}
                    </div>
                </div>
                <div className="relative flex flex-col items-center gap-1">
                    <div className="relative flex min-h-[80px] w-[180px] flex-row justify-center place-self-center md:h-[140px] md:w-[220px]">
                        <div className="flex h-[96px] w-[180px] items-center justify-center p-2 md:h-[140px] md:w-[220px] md:p-4">
                            <Logo label={game.name} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 md:gap-4">
                {children}
                <div className="border-foreground/10 divide-foreground/10 -mx-4 mt-auto -mb-4 flex h-8 flex-row divide-x overflow-hidden rounded-b-md border-t">
                    <div className="divide-foreground/10 flex flex-1 flex-row justify-end divide-x">
                        {buildsUrl && (
                            <a
                                href={buildsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={segmentClassName}
                            >
                                <GitBranch className="h-3.5 w-3.5" />
                                Builds
                            </a>
                        )}
                        {guidesUrl && (
                            <a
                                href={guidesUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={segmentClassName}
                            >
                                <BookOpen className="h-3.5 w-3.5" />
                                Guides
                            </a>
                        )}
                        <a
                            href="#details"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={segmentClassName}
                        >
                            <ScrollText className="h-3.5 w-3.5" />
                            Details
                        </a>
                    </div>
                    <button
                        type="button"
                        aria-label={`More options for ${game.name}`}
                        className="hover:bg-accent hover:text-accent-foreground flex w-8 shrink-0 items-center justify-center transition-colors"
                    >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </section>
    );
};
