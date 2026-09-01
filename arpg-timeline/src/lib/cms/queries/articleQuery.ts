import { PortableTextBlock } from "next-sanity";

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
  "gameId": game._ref,
  "coverImage": coverImage{
    alt,
    caption,
    "asset": asset->{ _id, url, "lqip": metadata.lqip, "dimensions": metadata.dimensions }
  }
`;

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
    updatedAt: string | null;
    _updatedAt: string;
    game: ArticleGameRef | null;
    gameId: string | null;
    coverImage: ArticleImage;
}

export interface Article extends ArticleListItem {
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: { asset: { _id: string; url: string } | null } | null;
    body: PortableTextBlock[];
}

// Every article fetch must pass `$showUnreleased`.
const VISIBLE = `(productionReady == true || $showUnreleased)`;

// `category` filter: a slug reused across namespaces must not cross-resolve.
export const articleBySlugQuery = `*[
  _type == "article" &&
  slug.current == $slug &&
  !defined(game) &&
  category == $category &&
  ${VISIBLE}
][0]{
  ${FULL_PROJECTION}
}`;

export const articleByGameAndSlugQuery = `*[
  _type == "article" &&
  slug.current == $slug &&
  category == $category &&
  game->slug.current == $gameSlug &&
  ${VISIBLE}
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

export const articleStaticParamsQuery = `*[_type == "article" && ${VISIBLE}]{
  "slug": slug.current,
  category,
  "gameSlug": game->slug.current,
  updatedAt,
  _updatedAt
}`;

export const articlesByCategoryPageQuery = `{
  "items": *[_type == "article" && category == $category && ${VISIBLE}]
    | order(publishedAt desc)[$from...$to]{ ${LIST_PROJECTION} },
  "total": count(*[_type == "article" && category == $category && ${VISIBLE}])
}`;

export const gameArticlesByCategoryPageQuery = `{
  "items": *[_type == "article" && category == $category && game->slug.current == $gameSlug && ${VISIBLE}]
    | order(publishedAt desc)[$from...$to]{ ${LIST_PROJECTION} },
  "total": count(*[_type == "article" && category == $category && game->slug.current == $gameSlug && ${VISIBLE}])
}`;

export interface ArticlesPageResult {
    items: ArticleListItem[];
    total: number;
}

export const gameArticlesPreviewQuery = `{
  "news": *[_type == "article" && game->slug.current == $gameSlug && category == "news" && ${VISIBLE}]
    | order(publishedAt desc)[0...3]{ ${LIST_PROJECTION} },
  "resources": *[_type == "article" && game->slug.current == $gameSlug && category == "resources" && ${VISIBLE}]
    | order(publishedAt desc)[0...3]{ ${LIST_PROJECTION} }
}`;

export interface GameArticlesPreview {
    news: ArticleListItem[];
    resources: ArticleListItem[];
}

// Dashboard pool: both categories, game-scoped and generic alike. Ranking and
// game-filtering happen client-side, so fetch a little more than any slot needs.
export const dashboardArticlesQuery = `*[_type == "article" && ${VISIBLE}]
  | order(publishedAt desc)[0...$limit]{ ${LIST_PROJECTION} }`;

export const articlesCountQuery = `count(*[_type == "article" && category == $category && ${VISIBLE}])`;

export const gameArticlesCountQuery = `count(*[
  _type == "article" && category == $category && game->slug.current == $gameSlug && ${VISIBLE}
])`;

export const articleIndexGameQuery = `*[_type == "game" && slug.current == $gameSlug][0]{
  name,
  "slug": slug.current
}`;

export interface ArticleIndexGame {
    name: string;
    slug: string;
}

export const relatedArticlesQuery = `{
  "sameGame": *[
    _type == "article" && _id != $excludeId && $gameRef != null && game._ref == $gameRef && ${VISIBLE}
  ] | order(publishedAt desc)[0...5]{ ${LIST_PROJECTION} },
  "sameCategory": *[
    _type == "article" && _id != $excludeId && category == $category && ${VISIBLE}
  ] | order(publishedAt desc)[0...10]{ ${LIST_PROJECTION} }
}`;

export interface RelatedArticlesResult {
    sameGame: ArticleListItem[];
    sameCategory: ArticleListItem[];
}
