import { Twitch } from "lucide-react";
import Link from "next/link";

import { GuardedExternalLink } from "@/components/GuardedExternalLink";
import { GameToSeasonWidget } from "@/hoc/GameToSeasonWidget/GameToSeasonWidget";
import { Game } from "@/lib/cms/games.types";
import { addUTMParameters } from "@/lib/utm";
import { Button } from "@/ui/Button";

import { FramedAction } from "../FramedAction/FramedAction";
import { useInGracePeriod } from "./useInGracePeriod";

export const GracePeriodSeasonWidgetHoC = ({ game }: { game: Game }) => {
    const isInGracePeriod = useInGracePeriod(game.currentSeason?.start?.startDate);

    if (!isInGracePeriod) {
        return <GameToSeasonWidget game={game} selector="next" />;
    }

    return (
        <div className="mt-auto flex flex-col gap-2">
            {game.currentSeason?.patchNotesUrl && (
                <GuardedExternalLink
                    href={addUTMParameters({
                        utm_source: "arpg-timeline",
                        utm_term: "patch+notes",
                        utm_content: "patch-notes-link",
                    })(game.currentSeason.patchNotesUrl)}
                    isOfficial={game.isOfficial}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-sm text-nowrap hover:underline"
                    data-sa-click={`${game.currentSeason.name}-patch-notes`}
                >
                    Patch notes
                </GuardedExternalLink>
            )}
            <FramedAction
                appendClassName="!bg-[#6441a5]"
                append={
                    game.twitchCategory && (
                        <Button
                            asChild
                            size="icon"
                            className="mt-auto ml-auto !rounded-l-none !bg-[#6441a5]"
                            variant="destructive"
                        >
                            <Link
                                target="_blank"
                                rel="noopener"
                                data-sa-click={`${game.slug}-twitch`}
                                href={addUTMParameters({
                                    utm_source: "arpg-timeline",
                                    utm_medium: "link",
                                    utm_campaign: "twitch-category",
                                    utm_content: game.slug,
                                })(
                                    `https://www.twitch.tv/directory/category/${game.twitchCategory}`,
                                )}
                            >
                                <Twitch className="h-4 w-4" />
                            </Link>
                        </Button>
                    )
                }
            >
                {game.twitchCategory ? "Play and watch now!" : "Play now!"}
            </FramedAction>
        </div>
    );
};
