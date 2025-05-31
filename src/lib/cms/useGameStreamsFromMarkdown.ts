import { GameStream } from "@/lib/cms/games.types";

export const useGameStreamsFromMarkdown = (
  data: Queries.IndexPageQuery,
): GameStream[] =>
  data?.liveStreamsOnTwitch?.edges
    ?.map((e) => e?.node?.frontmatter)
    .filter(
      (s) =>
        s?.date && new Date(s.date).getTime() > Date.now() - 2 * 60 * 60 * 1000,
    )
    .sort((a, b) => new Date(a?.date) - new Date(b?.date))
    .map((s) => {
      const game = data?.games?.edges.find(
        (g) => g?.node?.frontmatter?.slug === s?.game,
      )?.node?.frontmatter;
      const twitch = data?.twitchChannels?.edges.find(
        (g) => g?.node?.frontmatter?.game === s?.game,
      )?.node?.frontmatter;
      return {
        ...s,
        gameName: game?.name ?? s?.game,
        gameSlug: s?.game,
        gameLogo: game?.logo,
        twitchChannel: twitch?.channel,
      } as GameStream;
    });
