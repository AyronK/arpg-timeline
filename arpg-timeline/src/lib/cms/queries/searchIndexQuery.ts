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
    url,
    "logo": logo.asset->{
      _id,
      url
    }
  }
}`;

export type SearchIndexSanityGame = Pick<
    SanityGame,
    | "slug"
    | "name"
    | "shortName"
    | "group"
    | "isDormant"
    | "isComingSoon"
    | "categories"
    | "logo"
    | "url"
>;

export interface SearchIndexQueryResult {
    games: SearchIndexSanityGame[];
}
