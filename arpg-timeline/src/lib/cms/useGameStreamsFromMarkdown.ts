/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO fix any
import { GameStream } from "@/lib/cms/games.types";

export const useGameStreamsFromMarkdown = (data: any): GameStream[] =>
    data?.liveStreamsOnTwitch?.edges
        ?.map((e: any) => e?.node?.frontmatter)
        .filter((s: any) => s?.date && new Date(s.date).getTime() > Date.now() - 2 * 60 * 60 * 1000)
        .sort(
            (a: any, b: any) =>
                (new Date(a?.date as any) as any) - (new Date(b?.date as any) as any),
        )
        .map((s: any) => {
            const game = data?.games?.edges.find((g: any) => g?.node?.frontmatter?.slug === s?.game)
                ?.node?.frontmatter;
            const twitch = data?.twitchChannels?.edges.find(
                (g: any) => g?.node?.frontmatter?.game === s?.game,
            )?.node?.frontmatter;
            return {
                ...s,
                gameName: game?.name ?? s?.game,
                gameSlug: s?.game,
                gameLogo: game?.logo,
                twitchChannel: twitch?.channel,
            } as GameStream;
        });
