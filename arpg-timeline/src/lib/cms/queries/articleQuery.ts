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
