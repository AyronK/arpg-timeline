import { GameStream } from "@/lib/cms/games.types";
import { IndexQueryResult } from "@/lib/cms/queries/indexQuery";

export const parseGameStreamsFromSanity = (data: Pick<IndexQueryResult, "games">): GameStream[] =>
    data?.games
        .filter((g) => g.latestLiveStream && g.twitchChannel)
        .sort(
            (a, b) =>
                new Date(a!.latestLiveStream!.date!).getTime() -
                new Date(b!.latestLiveStream!.date!).getTime(),
        )
        .map((g) => {
            const twitch = g.twitchChannel;
            return {
                ...g.latestLiveStream,
                gameName: g.name,
                gameSlug: g.slug,
                gameLogo: g.logo,
                twitchChannel: twitch?.channel,
            } as GameStream;
        })
        .filter((s) => s.date && new Date(s.date).getTime() > Date.now() - 2 * 60 * 60 * 1000);
