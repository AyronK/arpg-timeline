import { Metadata } from "next";

import { NewsContent } from "@/components/Dashboard/NewsContent";
import { LayoutCarousel } from "@/components/LayoutCarousel";
import { SupportButtons } from "@/components/SupportButtons";
import { GameFilterProvider } from "@/contexts/GameFilterContext";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { GameNewsService } from "@/lib/gameNewsService";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { SteamNewsItem } from "@/lib/steam/getSteamNews";

export const metadata: Metadata = {
    title: "Latest Game News | ARPG Timeline",
    description: "Stay up to date with the latest news and updates from your favorite ARPG games.",
};

const NewsPage = async () => {
    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "liveStreamTwitch", "game", "toast"],
    });

    const sanityGames = data.games;
    const gamesForNews = data.games;
    const gameSlugs = data.games.map((game) => game.slug);

    let gamesNews: Array<{
        gameSlug: string;
        gameName: string;
        steamAppId: number;
        news: SteamNewsItem;
    }> = [];

    if (gameSlugs.length > 0) {
        try {
            const steamNewsService = new GameNewsService();
            const latestNews = await steamNewsService.getLatestNewsForGames(gameSlugs);

            gamesNews = latestNews
                .flatMap((item) => {
                    const game = gamesForNews.find((g) => g.slug === item.gameSlug);
                    return item.news.map((news) => ({
                        gameSlug: item.gameSlug,
                        gameName: game?.name || item.gameSlug,
                        steamAppId: game?.steam?.appId || 0,
                        gameLogo: game?.logo,
                        news: {
                            title: news.title,
                            link: news.link,
                            description: news.description,
                            pubDate: news.pub_date,
                        } as SteamNewsItem,
                    }));
                })
                .sort(
                    (a, b) =>
                        new Date(b.news.pubDate).getTime() - new Date(a.news.pubDate).getTime(),
                );
        } catch (error) {
            console.error("Error fetching Game news for news page:", error);
        }
    }

    return (
        <GameFilterProvider games={sanityGames} category={"featured"}>
            <LayoutCarousel />
            <div className="relative container mx-auto mt-2 mb-8">
                <NewsContent gamesNews={gamesNews} />
            </div>
            <SupportButtons />
        </GameFilterProvider>
    );
};

export const revalidate = 3600;

export default NewsPage;
