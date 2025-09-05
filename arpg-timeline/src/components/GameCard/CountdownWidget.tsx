import { Content } from "@/hoc/GameToSeasonWidget/Content";
import { Game } from "@/lib/cms/games.types";
import { inGracePeriod } from "@/lib/games/sortBySeasons";

import { FramedAction } from "../FramedAction/FramedAction";
import { Logo } from "../Logo";

export const CountdownWidget = ({ game, gameLogo }: { game: Game; gameLogo: React.ReactNode }) => {
    const isInGracePeriod = inGracePeriod(game.currentSeason?.start?.startDate);
    if (!game?.nextSeason && !isInGracePeriod) {
        return null;
    }
    return (
        <section className="text-foreground flex max-w-[720px] min-w-[360px] flex-1 flex-col gap-1 rounded-lg bg-black/50 px-4 py-6 shadow-xl">
            <div className="flex flex-col">
                <div className="relative flex flex-1 flex-col items-center">
                    <div className="h-[120px] min-h-[120px] w-[240px]">{gameLogo}</div>
                    <div className="font-heading line-clamp-2 text-center text-lg font-bold text-pretty">
                        {isInGracePeriod ? game?.currentSeason?.name : game?.nextSeason?.name}
                    </div>
                    <div className="font-heading flex flex-row items-center gap-2 opacity-50">
                        <Logo className="h-6 w-6" />
                        <span className="text-nowrap">arpg-timeline.com</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-3">
                {isInGracePeriod ? (
                    <FramedAction className="animate-bounce bg-transparent! font-bold shadow-none!">
                        Play now!
                    </FramedAction>
                ) : game?.nextSeason?.start?.confirmed ? (
                    <Content embed game={game} selector={"next"} compactEmbed />
                ) : (
                    <div className="text-center text-sm">
                        {game?.nextSeason?.start?.overrideText ?? "To be announced"}
                    </div>
                )}
            </div>
        </section>
    );
};
