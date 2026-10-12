import type { Metadata } from "next";

import { getGameArticlesPreview } from "@/lib/articles/getArticleListData";
import {
    articleIndexGameParams,
    renderArticleIndex,
    resolveArticleIndexMetadata,
} from "@/lib/articles/renderArticleIndex";

import { OfficialAnnouncements } from "../../components/news/OfficialAnnouncements";
import { SupportCard } from "../../components/overview/OverviewSidebar";
import { getGameFeed } from "../../feed";

interface Props {
    params: Promise<{ gameSlug: string }>;
}

const FEED_LIMIT = 5;

export default async function GameNewsIndexPage({ params }: Props) {
    const { gameSlug } = await params;
    const feed = await getGameFeed(gameSlug, FEED_LIMIT);

    return renderArticleIndex({
        category: "news",
        gameSlug,
        extra: feed.length > 0 && <OfficialAnnouncements entries={feed} gameSlug={gameSlug} />,
        aside: <SupportCard />,
        emptyText: "No news yet.",
    });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { gameSlug } = await params;
    const [metadata, articles, feed] = await Promise.all([
        resolveArticleIndexMetadata({ category: "news", gameSlug }),
        getGameArticlesPreview(gameSlug),
        getGameFeed(gameSlug, 1),
    ]);

    // The hub hides the News tab for games with no news; keep the empty page out of search
    if (articles.news.length === 0 && feed.length === 0) {
        return { ...metadata, robots: { index: false, follow: true } };
    }
    return metadata;
}

export function generateStaticParams() {
    return articleIndexGameParams("news");
}

// Hourly for the official feed
export const revalidate = 3600;
export const dynamicParams = true;
