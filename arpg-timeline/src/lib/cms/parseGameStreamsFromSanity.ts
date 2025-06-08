import { GameStream } from "@/lib/cms/games.types";
import { IndexQueryResult } from "@/queries/indexQuery";

export const parseGameStreamsFromSanity = (data: IndexQueryResult): GameStream[] =>
    data?.liveStreamsOnTwitch
        ?.filter((s) => s?.date && new Date(s.date).getTime() > Date.now() - 2 * 60 * 60 * 1000)
        .sort((a, b) => new Date(a?.date).getTime() - new Date(b?.date).getTime())
        .map((s) => {
            const game = data?.games?.find((g) => g?.slug === s?.game);
            const twitch = data?.twitchChannels?.find((c) => c?.game === s?.game);
            return {
                ...s,
                gameName: game?.name ?? s?.game,
                gameSlug: s?.game,
                gameLogo: game?.logo,
                twitchChannel: twitch?.channel,
            } as GameStream;
        });
