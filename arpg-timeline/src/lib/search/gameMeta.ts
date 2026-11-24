import { SearchGame } from "./types";

const SEPARATOR = " • ";

const getStatus = (game: SearchGame) =>
    game.isComingSoon ? "Coming soon" : game.isDormant ? "No recent updates" : "";

const getOrigin = (game: SearchGame) =>
    game.categories.includes("community") ? "Community" : "Official";

export const getDatelessDescription = (game: SearchGame) =>
    [getOrigin(game), getStatus(game)].filter(Boolean).join(SEPARATOR);

export const getSeasonDescription = (game: SearchGame, seasonText: string) =>
    [getOrigin(game), seasonText].join(SEPARATOR);

export const formatGameMeta = (
    game: SearchGame,
    description: string,
    matchedAlias: string | null,
) => {
    const alias = matchedAlias && matchedAlias !== game.group ? matchedAlias : null;
    return [description, alias && `matches "${alias}"`].filter(Boolean).join(SEPARATOR);
};
