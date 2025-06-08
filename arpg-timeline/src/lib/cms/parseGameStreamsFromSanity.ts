/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO fix any
import { GameStream } from "@/lib/cms/games.types";

export const parseGameStreamsFromSanity = (data: any): GameStream[] =>
    data?.liveStreamsOnTwitch
        ?.filter(
            (s: any) => s?.date && new Date(s.date).getTime() > Date.now() - 2 * 60 * 60 * 1000,
        )
        .sort(
            (a: any, b: any) =>
                new Date(a?.date as any).getTime() - new Date(b?.date as any).getTime(),
        )
        .map((s: any) => {
            const game = data?.games?.find((g: any) => g?.slug === s?.game);
            const twitch = data?.twitchChannels?.find((c: any) => c?.game === s?.game);
            return {
                ...s,
                gameName: game?.name ?? s?.game,
                gameSlug: s?.game,
                gameLogo: game?.logo,
                twitchChannel: twitch?.channel,
            } as GameStream;
        });
