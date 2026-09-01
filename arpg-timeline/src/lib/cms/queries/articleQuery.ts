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

// The `category` clause keeps a slug reused across namespaces from cross-resolving.
export const articleBySlugQuery = `*[
  _type == "article" &&
  slug.current == $slug &&
  !defined(game) &&
  category == $category
][0]{
  ${FULL_PROJECTION}
}`;

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

export const articleStaticParamsQuery = `*[_type == "article"]{
  "slug": slug.current,
  category,
  "gameSlug": game->slug.current,
  updatedAt,
  _updatedAt
}`;

// Index pages (Phase 2).
export const articlesByCategoryQuery = `*[
  _type == "article" && category == $category
] | order(publishedAt desc){
  ${LIST_PROJECTION}
}`;

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

// Paginated index queries - `$from`/`$to` is a GROQ slice, `total` drives page math.
export const articlesByCategoryPageQuery = `{
  "items": *[_type == "article" && category == $category]
    | order(publishedAt desc)[$from...$to]{ ${LIST_PROJECTION} },
  "total": count(*[_type == "article" && category == $category])
}`;

export const gameArticlesByCategoryPageQuery = `{
  "items": *[_type == "article" && category == $category && game->slug.current == $gameSlug]
    | order(publishedAt desc)[$from...$to]{ ${LIST_PROJECTION} },
  "total": count(*[_type == "article" && category == $category && game->slug.current == $gameSlug])
}`;

export interface ArticlesPageResult {
    items: ArticleListItem[];
    total: number;
}

// Game-details page - the latest few of each category for this game.
export const gameArticlesPreviewQuery = `{
  "news": *[_type == "article" && game->slug.current == $gameSlug && category == "news"]
    | order(publishedAt desc)[0...3]{ ${LIST_PROJECTION} },
  "resources": *[_type == "article" && game->slug.current == $gameSlug && category == "resources"]
    | order(publishedAt desc)[0...3]{ ${LIST_PROJECTION} }
}`;

export interface GameArticlesPreview {
    news: ArticleListItem[];
    resources: ArticleListItem[];
}

// Count-only - feeds `generateStaticParams` for the `/page/[page]` routes.
export const articlesCountQuery = `count(*[_type == "article" && category == $category])`;

export const gameArticlesCountQuery = `count(*[
  _type == "article" && category == $category && game->slug.current == $gameSlug
])`;

// Lightweight game lookup for the game-scoped index header / 404 guard.
export const articleIndexGameQuery = `*[_type == "game" && slug.current == $gameSlug][0]{
  name,
  "slug": slug.current
}`;

export interface ArticleIndexGame {
    name: string;
    slug: string;
}

// Related block: same-game first (empty when the article has no game), then same-category.
// Self-exclusion is in the query; the JS layer dedupes and trims to the final count.
export const relatedArticlesQuery = `{
  "sameGame": *[
    _type == "article" && _id != $excludeId && $gameRef != null && game._ref == $gameRef
  ] | order(publishedAt desc)[0...5]{ ${LIST_PROJECTION} },
  "sameCategory": *[
    _type == "article" && _id != $excludeId && category == $category
  ] | order(publishedAt desc)[0...10]{ ${LIST_PROJECTION} }
}`;

export interface RelatedArticlesResult {
    sameGame: ArticleListItem[];
    sameCategory: ArticleListItem[];
}
