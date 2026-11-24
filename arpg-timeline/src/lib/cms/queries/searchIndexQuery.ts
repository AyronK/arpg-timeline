import { SanityGame } from "./indexQuery";

export const searchIndexQuery = `{
  "games": *[_type == "game"]{
    "slug": slug.current,
    name,
    shortName,
    group,
    isDormant,
    isComingSoon,
    "categories": coalesce(categories, []),
    "logo": logo.asset->{
      _id,
      url
    }
  }
}`;

export type SearchIndexSanityGame = Pick<
    SanityGame,
    "slug" | "name" | "shortName" | "group" | "isDormant" | "isComingSoon" | "categories" | "logo"
>;

export interface SearchIndexQueryResult {
    games: SearchIndexSanityGame[];
}
