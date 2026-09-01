import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { FeedItem } from "@/lib/articles/feedItem";

import { ArticleFeedItem } from "./ArticleFeedItem";

const cover = { url: "/assets/seoimage.png", alt: "Cover" };

const articleItem: FeedItem = {
    id: "article-1",
    href: "/game/path-of-exile/resources/league-start-checklist",
    title: "The league-start checklist every Path of Exile player forgets",
    excerpt:
        "Stash tabs, filter updates, and the three atlas passives worth respeccing before day one. A short pre-launch pass so you are not fixing setup at 3am.",
    publishedAt: "2026-05-28T09:00:00.000Z",
    image: cover,
    gameName: "Path of Exile",
    categoryLabel: "Resources",
    source: "article",
    external: false,
};

const newsItem: FeedItem = {
    ...articleItem,
    id: "article-2",
    href: "/news/season-tracker-api",
    title: "Season data is now available through the public API",
    excerpt: "Every tracked game, season and countdown, behind one documented endpoint.",
    publishedAt: "2026-05-31T16:30:00.000Z",
    gameName: null,
    categoryLabel: "News",
};

const steamItem: FeedItem = {
    id: "steam-1",
    href: "https://store.steampowered.com/news/app/238960/view/000",
    title: "Patch <b>3.99.1</b> Notes",
    titleIsHtml: true,
    excerpt: "Fixes a crash when entering the Hideout with more than 40 decorations placed.",
    publishedAt: "2026-05-30T11:00:00.000Z",
    image: cover,
    gameName: "Path of Exile",
    categoryLabel: null,
    source: "steam",
    external: true,
};

const meta: Meta<typeof ArticleFeedItem> = {
    title: "Components/ArticleFeedItem",
    component: ArticleFeedItem,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ArticleFeedItem>;

const sized = (width: string, height?: string) => [
    (Story: React.ComponentType) => (
        <div style={{ width, height, display: "flex" }}>
            <Story />
        </div>
    ),
];

// Grid - sits in the dashboard grid beside game cards (min-h-80 at md and up).
export const Grid: Story = {
    args: { item: articleItem, variant: "grid" },
    decorators: sized("370px", "320px"),
};

export const GridGenericArticle: Story = {
    name: "Grid - generic (no game)",
    args: { item: newsItem, variant: "grid" },
    decorators: sized("370px", "320px"),
};

export const GridNoImage: Story = {
    name: "Grid - missing cover",
    args: { item: { ...articleItem, image: null }, variant: "grid" },
    decorators: sized("370px", "320px"),
};

// Rail - height-matched to the collapsed Timeline in the extras band.
export const Rail: Story = {
    args: { item: articleItem, variant: "rail" },
    decorators: sized("320px"),
};

export const RailStack: Story = {
    name: "Rail - three rows as used in the band",
    render: () => (
        <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <ArticleFeedItem item={articleItem} variant="rail" />
            <ArticleFeedItem item={newsItem} variant="rail" />
            <ArticleFeedItem item={steamItem} variant="rail" />
        </div>
    ),
};

// Feed - the unified news tab.
export const Feed: Story = {
    args: { item: articleItem, variant: "feed" },
    decorators: sized("380px"),
};

export const FeedSteamSource: Story = {
    name: "Feed - Steam news (external, HTML title)",
    args: { item: steamItem, variant: "feed" },
    decorators: sized("380px"),
};

export const FeedWithoutGameChip: Story = {
    name: "Feed - game chip hidden",
    args: { item: articleItem, variant: "feed", showGame: false },
    decorators: sized("380px"),
};
