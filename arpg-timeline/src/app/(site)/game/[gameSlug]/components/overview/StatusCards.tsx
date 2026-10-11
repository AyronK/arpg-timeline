import { Game } from "@/lib/cms/games.types";
import { cn } from "@/lib/utils";

import { NextSeasonCtas } from "../../(hub)/timeline/components/NextSeasonCtas";
import { buildNextSeasonHeading } from "../../nextSeasonHeading";
import { cardClassName } from "./OverviewCard";
import { SeasonStatus } from "./SeasonStatus";

const statusCardClassName = cn(cardClassName, "flex flex-col gap-3");

export const NowCard = ({ game }: { game: Game }) => {
    if (game.isDormant || !game.currentSeason) {
        return (
            <div className={statusCardClassName}>
                <p className="text-muted-foreground text-sm">No active {game.seasonKeyword}</p>
            </div>
        );
    }

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

    return (
        // CTA strip sits outside the padded body so it runs edge to edge
        <section
            id="next-season"
            className={cn(cardClassName, "flex scroll-mt-24 flex-col overflow-hidden !p-0")}
        >
            <div className="flex flex-1 flex-col gap-3 p-4 md:p-6">
                {heading && <h2 className="sr-only">{heading}</h2>}
                <SeasonStatus game={game} selector="next" cadenceHint={cadenceHint} />
                {!confirmed && (
                    <p className="text-muted-foreground text-sm">
                        We&apos;ll add it the moment it&apos;s announced.
                    </p>
                )}
            </div>
            {!confirmed && (
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
