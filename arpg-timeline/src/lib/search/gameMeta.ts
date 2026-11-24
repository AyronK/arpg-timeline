import { SearchGame } from "./types";

const SEPARATOR = " • ";

const getStatus = (game: SearchGame) =>
    game.isComingSoon ? "Coming soon" : game.isDormant ? "No recent updates" : "";

export const getDatelessDescription = (game: SearchGame) =>
    [game.categories.includes("community") ? "Community" : "Official", getStatus(game)]
        .filter(Boolean)
        .join(SEPARATOR);

export const formatGameMeta = (
    game: SearchGame,
    description: string,
    matchedAlias: string | null,
) => {
    const alias = matchedAlias && matchedAlias !== game.group ? matchedAlias : null;
    return [description, alias && `matches "${alias}"`].filter(Boolean).join(SEPARATOR);
};
