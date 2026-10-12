import { ChipColorMap } from "@/components/SeasonWidget";
import { Game } from "@/lib/cms/games.types";
import { cn } from "@/lib/utils";
import { Chip } from "@/ui/Chip";

import { NextSeasonCtas } from "../../(hub)/timeline/components/NextSeasonCtas";
import { formatMonthYear, getEditorStartText } from "../../hub";
import { buildNextSeasonHeading } from "../../nextSeasonHeading";
import { cardClassName } from "./OverviewCard";
import { SeasonStatus } from "./SeasonStatus";

const statusCardClassName = cn(cardClassName, "flex flex-col gap-3");

export const NowCard = ({ game }: { game: Game }) => {
    if (game.isDormant) {
        const last = game.currentSeason;
        return (
            <div className={statusCardClassName}>
                <Chip className={cn(ChipColorMap.dormant, "w-fit text-xs")}>No recent updates</Chip>
                {last?.name && (
                    <p className="font-heading text-xl leading-tight md:text-2xl">{last.name}</p>
                )}
                {last?.start?.startDate && (
                    <p className="text-muted-foreground text-sm">
                        Last update {formatMonthYear(last.start.startDate)}
                    </p>
                )}
            </div>
        );
    }

    if (!game.currentSeason) return null;

    return (
        <div className={statusCardClassName}>
            <SeasonStatus game={game} selector="current" />
        </div>
    );
};

// Also used as the Release card for coming-soon games.
export const NextCard = ({ game, cadenceHint }: { game: Game; cadenceHint?: string | null }) => {
    const heading = buildNextSeasonHeading(game);
    const confirmed = !!game.nextSeason?.start?.confirmed;
    // Dormant games get no calendar/bot prompts
    const showCtas = !confirmed && !game.isDormant;
    // Editor text already says what's known about the date
    const showPromise = showCtas && !getEditorStartText(game.nextSeason?.start);

    return (
        // CTA strip sits outside the padded body so it runs edge to edge
        <section
            id="next-season"
            className={cn(cardClassName, "flex scroll-mt-24 flex-col overflow-hidden !p-0")}
        >
            <div className="flex flex-1 flex-col gap-3 p-4 md:p-6">
                {heading && <h2 className="sr-only">{heading}</h2>}
                <SeasonStatus game={game} selector="next" cadenceHint={cadenceHint} />
                {showPromise && (
                    <p className="text-muted-foreground text-sm">
                        We&apos;ll add it the moment it&apos;s announced.
                    </p>
                )}
            </div>
            {showCtas && (
                <NextSeasonCtas
                    gameSlug={game.slug}
                    gameName={game.name}
                    placement="next"
                    className="!m-0"
                />
            )}
        </section>
    );
};
