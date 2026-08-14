"use client";

import { BookOpen, GitBranch, MoreHorizontal, ScrollText } from "lucide-react";
import { ReactNode } from "react";

import { CommunityLabel } from "@/components/CommunityLabel";
import { SteamPlayersChip } from "@/components/SteamPlayersChip";

import { ResourceLinks } from "./ResourceButtonVariants";
import { Logo, MockGame } from "./ResourceMockCard";

const segmentClassName =
    "flex items-center justify-center gap-1 px-2 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground";

/**
 * Variant 4 — every action (Builds, Guides, Details, More) leaves the header entirely and moves
 * into a single toolbar pinned to the bottom of the card (mt-auto, like the real FramedAction
 * footer). The bar bleeds full-width past the card's own p-4 padding (negative margins +
 * rounded-b-md so it still matches the card's corners), and sits flush under a top divider with
 * no extra padding. Text buttons are separated by a divider (divide-x); "More" gets its own
 * explicit border-l instead, since its column can sit past an empty (unoccupied) grid track when
 * a text button is missing, and an explicit border removes any doubt that it'll show.
 *
 * The bar is a 4-column grid — three equal (1fr) text-button columns plus a fixed 2rem column
 * pinned to "More" (col-start-4), sized to match its own w-8 so it never stretches and stays as
 * narrow as possible. With all three text buttons present the row fills 100% width; if one is
 * missing, its column still reserves the same width (grid tracks are sized by the template, not
 * by content), so the remaining buttons stay exactly the width they'd be if every button were
 * present, and "More" never moves from the right edge.
 *
 * With the header's top-right corner now free of buttons, the Community/Steam badges move there
 * instead of sitting under the title.
 */
export const FooterActionsCard = ({
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
                <div className="border-foreground/10 divide-foreground/10 -mx-4 mt-auto -mb-4 grid h-8 grid-cols-[1fr_1fr_1fr_2rem] divide-x overflow-hidden rounded-b-md border-t">
                    {buildsUrl && (
                        <a
                            href={buildsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={segmentClassName}
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
                            className={segmentClassName}
                        >
                            <BookOpen className="h-3 w-3" />
                            Guides
                        </a>
                    )}
                    <a
                        href="#details"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={segmentClassName}
                    >
                        <ScrollText className="h-3 w-3" />
                        Details
                    </a>
                    <button
                        type="button"
                        aria-label={`More options for ${game.name}`}
                        className="border-foreground/10 hover:bg-accent hover:text-accent-foreground col-start-4 flex w-8 items-center justify-center border-l transition-colors"
                    >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </section>
    );
};
