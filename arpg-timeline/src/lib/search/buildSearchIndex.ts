import { getSanityImageUrl } from "@/components/SanityImage";
import { Game } from "@/lib/cms/games.types";
import { SearchIndexQueryResult, SearchIndexSanityGame } from "@/lib/cms/queries/searchIndexQuery";

import {
    COMING_SOON_FLAG,
    decodeSearchIndex,
    DORMANT_FLAG,
    EncodedSearchGame,
    EncodedSearchIndex,
    LOGO_RENDER_WIDTH,
} from "./searchIndexCodec";
import { SearchGame } from "./types";

const LOGO_WIDTH = 256;
const LOGO_QUALITY = 75;

const getLogoSrc = (logo: SearchIndexSanityGame["logo"]) => {
    const url = logo && getSanityImageUrl(logo, LOGO_RENDER_WIDTH, LOGO_QUALITY);
    return url
        ? `/_next/image?url=${encodeURIComponent(url)}&w=${LOGO_WIDTH}&q=${LOGO_QUALITY}`
        : "";
};

export const encodeSearchGame = (game: SearchIndexSanityGame): EncodedSearchGame => [
    game.slug,
    game.name,
    game.shortName ?? "",
    game.group ?? "",
    getLogoSrc(game.logo),
    game.categories ?? [],
    (game.isDormant ? DORMANT_FLAG : 0) | (game.isComingSoon ? COMING_SOON_FLAG : 0),
];

export const buildSearchIndex = ({ games }: SearchIndexQueryResult): EncodedSearchIndex =>
    games.map(encodeSearchGame);

export const toSearchGame = (game: Game): SearchGame =>
    decodeSearchIndex([
        encodeSearchGame({
            ...game,
            shortName: game.shortName ?? undefined,
            group: game.group ?? undefined,
        }),
    ]).games[0]!;
