"use client";

import { ExternalLinkIcon } from "lucide-react";

import { GuardedExternalLink } from "@/components/GuardedExternalLink";
import { ChipColorMap, ChipColorText } from "@/components/SeasonWidget";
import { Content } from "@/hoc/GameToSeasonWidget/Content";
import { SeoText } from "@/hoc/GameToSeasonWidget/SeoText";
import { Selector, SelectorLabels } from "@/hoc/GameToSeasonWidget/types";
import { useChip } from "@/hoc/GameToSeasonWidget/useChip";
import { Game } from "@/lib/cms/games.types";
import { sa_event } from "@/lib/sa_event";
import { cn } from "@/lib/utils";
import { addUTMParameters } from "@/lib/utm";
import { Chip } from "@/ui/Chip";

// Overview-sized variant of GameToSeasonWidget: same Content rules, larger title.
export const SeasonStatus = ({
    game,
    selector,
    cadenceHint,
}: {
    game: Game;
    selector: Selector;
    cadenceHint?: string | null;
}) => {
    const season = selector === "current" ? game.currentSeason : game.nextSeason;
    const chip = useChip({ game, selector });

    if (!season) return null;

    // Parser fills an unannounced next season with a placeholder sharing the current id
    const isPlaceholder = selector === "next" && season._id === game.currentSeason?._id;
    const title = isPlaceholder
        ? "Not announced yet"
        : (season.name ?? `${SelectorLabels[selector]} ${game.seasonKeyword}`);
    const url = !isPlaceholder ? season.url : null;
    // Editor-written text wins; the parser's default and "Avg." fallback give way to the cadence hint
    const overrideText = season.start?.overrideText;
    const isEditorText =
        !!overrideText && overrideText !== "To be announced" && !overrideText.startsWith("Avg. ");
    const hint = isEditorText ? overrideText : cadenceHint;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
                <Chip className={cn(ChipColorMap[chip], "w-12 text-center text-xs")}>
                    {ChipColorText[chip]}
                </Chip>
                {season.patchNotesUrl && !isPlaceholder && (
                    <GuardedExternalLink
                        href={addUTMParameters({
                            utm_source: "arpg-timeline",
                            utm_medium: "link",
                            utm_campaign: "patch-notes",
                            utm_content: game.slug,
                        })(season.patchNotesUrl)}
                        isOfficial={game.isOfficial}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground text-sm whitespace-nowrap hover:underline"
                        data-sa-click={`${season.name}-patch-notes`}
                    >
                        Patch notes
                    </GuardedExternalLink>
                )}
            </div>
            <p className="font-heading text-xl leading-tight md:text-2xl">
                {url ? (
                    <GuardedExternalLink
                        href={addUTMParameters({
                            utm_source: "arpg-timeline",
                            utm_content: "season_link",
                            utm_term: encodeURIComponent(title),
                        })(url)}
                        isOfficial={game.isOfficial}
                        noIcon
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-fit underline decoration-transparent underline-offset-4 hover:decoration-current/75"
                        onClick={() => sa_event(`${title}-link-click`)}
                    >
                        {title}
                        <ExternalLinkIcon
                            className="mt-1 h-3.5 w-3.5 shrink-0 opacity-70"
                            aria-hidden
                        />
                    </GuardedExternalLink>
                ) : (
                    title
                )}
            </p>
            <div className="sr-only">
                <SeoText game={game} selector={selector} />
            </div>
            {isPlaceholder ? (
                hint && <p className="text-muted-foreground text-sm italic">{hint}</p>
            ) : (
                <Content game={game} selector={selector} hidePatchNotes progressTextBelow />
            )}
        </div>
    );
};
