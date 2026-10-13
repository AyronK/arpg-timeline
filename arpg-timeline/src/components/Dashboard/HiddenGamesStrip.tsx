"use client";

import { useHasMounted } from "@react-hooks-library/core";

import { SanityImage } from "@/components/SanityImage";
import { useGameFilterContext } from "@/contexts/GameFilterContext";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { getStripEntries, HiddenGame } from "@/lib/filters/filterState";

import { HiddenGamesPopover } from "./HiddenGamesPopover";

const useChipCap = () => {
    const { isXl } = useBreakpoint("xl");
    const { is2xl } = useBreakpoint("2xl");
    return is2xl ? 4 : isXl ? 3 : 2;
};

export const HiddenGamesStrip = ({
    peekedSlugs,
    onPeek,
}: {
    peekedSlugs: string[];
    onPeek: (slug: string) => void;
}) => {
    const { hiddenGamesSummary, isHiddenStripEnabled, setHiddenStripEnabled } =
        useGameFilterContext();
    const cap = useChipCap();
    // Breakpoints, stored filters and the strip switch are only known in the browser
    const hasMounted = useHasMounted();

    if (
        !hasMounted ||
        !hiddenGamesSummary ||
        hiddenGamesSummary.hiddenCount === 0 ||
        !isHiddenStripEnabled
    )
        return null;

    const { chips, more, moreLabel } = getStripEntries(hiddenGamesSummary, cap, peekedSlugs);
    if (chips.length === 0 && !moreLabel) return null;
    const hideStrip = () => setHiddenStripEnabled(false);

    return (
        <div className="text-muted-foreground flex min-w-0 scrollbar-none flex-nowrap items-center gap-2 overflow-x-auto text-xs whitespace-nowrap lg:justify-end lg:overflow-visible">
            {chips.map((entry) => (
                <HiddenGamesPopover
                    key={entry.game.slug}
                    title="Hidden by filters"
                    entries={[entry]}
                    eventProps={{ entry: "chip", game: entry.game.slug }}
                    onHideStrip={hideStrip}
                    onPeek={onPeek}
                    triggerClassName="group hover:border-foreground/40 hover:text-foreground flex shrink-0 items-center gap-2 rounded-full border py-0.5 pr-2.5 pl-0.5"
                    trigger={<StripChip entry={entry} />}
                />
            ))}
            {moreLabel && (
                <HiddenGamesPopover
                    title={chips.length > 0 ? `${more.length} more hidden by filters` : moreLabel}
                    entries={more}
                    eventProps={{ entry: chips.length > 0 ? "more" : "all", count: more.length }}
                    onHideStrip={hideStrip}
                    onPeek={onPeek}
                    triggerClassName="hover:text-foreground shrink-0 underline-offset-2 hover:underline"
                    trigger={moreLabel}
                />
            )}
        </div>
    );
};

const StripChip = ({ entry: { game, startsInDays, confirmed } }: { entry: HiddenGame }) => (
    <>
        <span className="bg-background relative block h-6 w-6 shrink-0 rounded-full border opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0">
            {game.logo && (
                <SanityImage src={game.logo} alt="" fill objectFit="contain" className="p-px" />
            )}
        </span>
        <span className="text-foreground/80">{game.shortName || game.name}</span>
        <span className="opacity-70">
            in {!confirmed && "~"}
            {startsInDays}d
        </span>
    </>
);
