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
        <section className="text-foreground flex max-w-[720px] min-w-[360px] flex-1 flex-col gap-1 rounded-lg bg-black/50 px-4 pt-2 pb-6 shadow-xl">
            <div className="relative flex flex-1 flex-col items-center">
                <div className="h-[140px] min-h-[140px]">{gameLogo}</div>
                <div className="text-foreground flex flex-row items-center gap-2">
                    <Logo className="h-12 w-12 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]" />
                    <div className="flex flex-col items-center justify-center">
                        <div className="font-heading line-clamp-2 text-center text-lg font-bold text-pretty [text-shadow:_0_1px_1px_rgba(0,0,0,0.4)]">
                            {isInGracePeriod ? game?.currentSeason?.name : game?.nextSeason?.name}
                        </div>
                        <div className="flex flex-row items-center gap-2 leading-3">
                            <span className="text-nowrap [text-shadow:_0_1px_1px_rgba(0,0,0,0.4)]">
                                arpg-timeline.com
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-2 flex flex-1 scale-125 flex-col gap-3">
                {isInGracePeriod ? (
                    <FramedAction className="animate-bounce bg-transparent! font-bold shadow-none! [text-shadow:_0_1px_1px_rgba(0,0,0,0.4)]">
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
