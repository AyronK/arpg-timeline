import type { Metadata } from "next";

import {
    articleIndexGameParams,
    renderArticleIndex,
    resolveArticleIndexMetadata,
} from "@/lib/articles/renderArticleIndex";

import { OfficialAnnouncements } from "../../components/news/OfficialAnnouncements";
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
        emptyText: "No news yet.",
    });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { gameSlug } = await params;
    return resolveArticleIndexMetadata({ category: "news", gameSlug });
}

export function generateStaticParams() {
    return articleIndexGameParams("news");
}

// Hourly for the official feed
export const revalidate = 3600;
export const dynamicParams = true;
