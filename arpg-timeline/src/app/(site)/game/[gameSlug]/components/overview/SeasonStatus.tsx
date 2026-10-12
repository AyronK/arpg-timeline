"use client";

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

import { getEditorStartText, isPlaceholderNext } from "../../hub";
import { SideEventChip } from "../InfoChips";
import { PatchNotesLink, SeasonBadgeRow, SeasonTitle } from "../SeasonCardParts";

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
    const gameChip = useChip({ game, selector });
    // The dashboard's dormant "Play" chip describes the game; an upcoming season is still "Next"
    const chip = selector === "next" && gameChip === "dormant" ? "next" : gameChip;

    if (!season) return null;

    const isPlaceholder = selector === "next" && isPlaceholderNext(game.currentSeason, season);
    const title = isPlaceholder
        ? "Not announced yet"
        : (season.name ?? `${SelectorLabels[selector]} ${game.seasonKeyword}`);
    const url = !isPlaceholder ? season.url : null;
    // Editor-written text wins over the cadence hint
    const hint = getEditorStartText(season.start) ?? cadenceHint;

    return (
        <div className="flex flex-col gap-3">
            <SeasonBadgeRow
                chips={
                    <>
                        <Chip className={cn(ChipColorMap[chip], "w-12 text-center text-xs")}>
                            {ChipColorText[chip]}
                        </Chip>
                        {season.isSideEvent && !isPlaceholder && <SideEventChip />}
                    </>
                }
                action={
                    season.patchNotesUrl &&
                    !isPlaceholder && (
                        <PatchNotesLink
                            href={addUTMParameters({
                                utm_source: "arpg-timeline",
                                utm_medium: "link",
                                utm_campaign: "patch-notes",
                                utm_content: game.slug,
                            })(season.patchNotesUrl)}
                            isOfficial={game.isOfficial}
                            saClick={`${season.name}-patch-notes`}
                        />
                    )
                }
            />
            <SeasonTitle
                title={title}
                href={
                    url &&
                    addUTMParameters({
                        utm_source: "arpg-timeline",
                        utm_content: "season_link",
                        utm_term: encodeURIComponent(title),
                    })(url)
                }
                isOfficial={game.isOfficial}
                className="text-xl md:text-2xl"
                onClick={() => sa_event(`${title}-link-click`)}
            />
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
