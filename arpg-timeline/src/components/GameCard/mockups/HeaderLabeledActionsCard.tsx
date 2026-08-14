"use client";

import { BookOpen, GitBranch, MoreHorizontal, ScrollText } from "lucide-react";
import { ReactNode } from "react";

import { CommunityLabel } from "@/components/CommunityLabel";
import { SteamPlayersChip } from "@/components/SteamPlayersChip";
import { Button } from "@/ui/Button";

import { ResourceLinks } from "./ResourceButtonVariants";
import { Logo, MockGame } from "./ResourceMockCard";

/**
 * Variant 3 — a step further from the plain "header action buttons" variant: the existing
 * "Details" button gains a text label too (only "More" stays icon-only, since it's a menu
 * trigger rather than a destination), and the Community/Steam badges move out from under the
 * title to sit right-aligned directly below the button cluster (stacked in the same right-hand
 * column, no reserved gap — the logo simply shifts down by the badge row's own height).
 */
export const HeaderLabeledActionsCard = ({
    game,
    resources,
    children,
}: {
    game: MockGame;
    resources: ResourceLinks;
    children?: ReactNode;
}) => {
    const { buildsUrl, guidesUrl } = resources;
    const hasBadges = !game.official || game.steamPlayers !== undefined;

    return (
        <section className="bg-card text-card-foreground relative flex flex-1 flex-col gap-1 rounded-md border p-4">
            <div className="flex flex-col">
                <div className="flex flex-row items-start justify-between gap-3">
                    <h3 className="font-heading min-w-0 flex-1 text-xs">{game.name}</h3>
                    <div className="flex flex-col items-end gap-1">
                        <div className="border-foreground/10 flex flex-row items-center rounded-md border">
                            {buildsUrl && (
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 gap-1 px-2 text-xs"
                                >
                                    <a href={buildsUrl} target="_blank" rel="noopener noreferrer">
                                        <GitBranch className="h-3.5 w-3.5" />
                                        Builds
                                    </a>
                                </Button>
                            )}
                            {guidesUrl && (
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 gap-1 px-2 text-xs"
                                >
                                    <a href={guidesUrl} target="_blank" rel="noopener noreferrer">
                                        <BookOpen className="h-3.5 w-3.5" />
                                        Guides
                                    </a>
                                </Button>
                            )}
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1 px-2 text-xs"
                            >
                                <a href="#details" target="_blank" rel="noopener noreferrer">
                                    <ScrollText className="h-3.5 w-3.5" />
                                    Details
                                </a>
                            </Button>
                            <Button
                                className="h-8 w-8"
                                variant="ghost"
                                size="icon"
                                aria-label={`More options for ${game.name}`}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                        {hasBadges && (
                            <div className="flex flex-row flex-wrap items-center justify-end gap-2">
                                {!game.official && <CommunityLabel />}
                                {game.steamPlayers !== undefined && (
                                    <SteamPlayersChip playersCount={game.steamPlayers} />
                                )}
                            </div>
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
            <div className="flex flex-1 flex-col gap-3 md:gap-4">{children}</div>
        </section>
    );
};
