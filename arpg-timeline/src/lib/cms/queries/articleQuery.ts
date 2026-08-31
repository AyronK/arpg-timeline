import { PortableTextBlock } from "next-sanity";

/**
 * Articles / editorial content. See the plan at
 * ~/.claude/plans/plan-integrating-an-glistening-bachman.md
 *
 * `category` + `game` together map 1:1 onto a URL prefix:
 *   - no game  → /news/{slug}            /resources/{slug}
 *   - a game   → /game/{g}/news/{slug}   /game/{g}/resources/{slug}
 *
 * Every by-slug query filters on `category` so a slug reused across categories
 * cannot cross-resolve (see plan G1). "Live" == published in Sanity - the read
 * token already excludes drafts, so there is no extra visibility filter.
 */

export type ArticleCategory = "news" | "resources";

export type AiDisclosure = "none" | "styling" | "assisted" | "redacted" | "fully-generated";

export interface ArticleImageAsset {
    _id: string;
    url: string;
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio: number };
}

export interface ArticleImage {
    alt: string;
    caption?: string;
    asset: ArticleImageAsset | null;
}

export interface ArticleGameRef {
    slug: string;
    name: string;
    logo?: { url: string } | null;
}

/** Fields shared by list cards and the full article. */
const LIST_PROJECTION = `
  _id,
  "slug": slug.current,
  category,
  title,
  excerpt,
  aiDisclosure,
  publishedAt,
  updatedAt,
  _updatedAt,
  "game": game->{ "slug": slug.current, name, "logo": logo.asset->{ url } },
  "coverImage": coverImage{
    alt,
    caption,
    "asset": asset->{ _id, url, "lqip": metadata.lqip, "dimensions": metadata.dimensions }
  }
`;

/** Portable Text body with image assets dereferenced. */
const BODY_PROJECTION = `
  body[]{
    ...,
    _type == "image" => {
      ...,
      "asset": asset->{ _id, url, "lqip": metadata.lqip, "dimensions": metadata.dimensions }
    }
  }
`;

const FULL_PROJECTION = `
  ${LIST_PROJECTION},
  seoTitle,
  seoDescription,
  "ogImage": ogImage{ "asset": asset->{ _id, url } },
  ${BODY_PROJECTION}
`;

export interface ArticleListItem {
    _id: string;
    slug: string;
    category: ArticleCategory;
    title: string;
    excerpt: string;
    aiDisclosure: AiDisclosure;
    publishedAt: string;
    /** Author-set "last modified" override; falls back to `_updatedAt`. */
    updatedAt: string | null;
    _updatedAt: string;
    game: ArticleGameRef | null;
    coverImage: ArticleImage;
}

export interface Article extends ArticleListItem {
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: { asset: { _id: string; url: string } | null } | null;
    body: PortableTextBlock[];
}

/* -------------------------------------------------------------------------- */
/* Single-article fetches (Phase 1)                                          */
/* -------------------------------------------------------------------------- */

/** Root (no game) article, scoped to a category. */
export const articleBySlugQuery = `*[
  _type == "article" &&
  slug.current == $slug &&
  !defined(game) &&
  category == $category
][0]{
  ${FULL_PROJECTION}
}`;

/** Game-scoped article, matched on game slug + category. */
export const articleByGameAndSlugQuery = `*[
  _type == "article" &&
  slug.current == $slug &&
  category == $category &&
  game->slug.current == $gameSlug
][0]{
  ${FULL_PROJECTION}
}`;

export interface ArticleStaticParam {
    slug: string;
    category: ArticleCategory;
    gameSlug: string | null;
    updatedAt: string | null;
    _updatedAt: string;
}

/** Every article, minimal shape - feeds generateStaticParams + the sitemap. */
export const articleStaticParamsQuery = `*[_type == "article"]{
  "slug": slug.current,
  category,
  "gameSlug": game->slug.current,
  updatedAt,
  _updatedAt
}`;

/* -------------------------------------------------------------------------- */
/* List fetches (index pages - Phase 2 wires these up)                        */
/* -------------------------------------------------------------------------- */

/** All articles of a category (root + every game), newest first. */
export const articlesByCategoryQuery = `*[
  _type == "article" && category == $category
] | order(publishedAt desc){
  ${LIST_PROJECTION}
}`;

/** A single game's articles in a category, newest first. */
export const gameArticlesByCategoryQuery = `*[
  _type == "article" &&
  category == $category &&
  game->slug.current == $gameSlug
] | order(publishedAt desc){
  ${LIST_PROJECTION}
}`;

export interface ArticlesListResult {
    articles: ArticleListItem[];
}
