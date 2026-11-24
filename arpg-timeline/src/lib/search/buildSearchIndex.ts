import { getSanityImageUrl } from "@/components/SanityImage";
import { SearchIndexQueryResult, SearchIndexSanityGame } from "@/lib/cms/queries/searchIndexQuery";

import {
    COMING_SOON_FLAG,
    DORMANT_FLAG,
    EncodedSearchGame,
    EncodedSearchIndex,
    LOGO_RENDER_SIZE,
} from "./searchIndexCodec";

const LOGO_WIDTH = 128;
const LOGO_QUALITY = 75;

const getLogoSrc = (logo: SearchIndexSanityGame["logo"]) => {
    const url = logo && getSanityImageUrl(logo, LOGO_RENDER_SIZE, LOGO_QUALITY);
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
