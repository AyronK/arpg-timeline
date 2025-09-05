import { GameStream } from "@/lib/cms/games.types";
import { IndexQueryResult } from "@/lib/cms/queries/indexQuery";

import { isStreamSoon } from "./isStreamSoon";

export const parseGameStreamsFromSanity = (data: IndexQueryResult): GameStream[] =>
    data?.liveStreamsOnTwitch
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
                isLiveSoon: isStreamSoon(s.date),
            } as GameStream;
        })
        .filter(
            (s) =>
                s.date &&
                (s.isLiveSoon ||
                    (s?.date && new Date(s.date).getTime() > Date.now() - 2 * 60 * 60 * 1000)),
        );
