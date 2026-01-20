import { GameNewsDbEntry, GameNewsInsert, GameNewsItem } from "@/types/game-news";
import { createClient } from "@/utils/supabase/client";

export class GameNewsService {
    private supabase = createClient();

    async insertGameNews(entries: GameNewsInsert[]): Promise<void> {
        if (entries.length === 0) return;

        const existingLinks = await this.getExistingLinks(entries.map((e) => e.link));
        const newEntries = entries.filter((entry) => !existingLinks.has(entry.link));

        if (newEntries.length === 0) {
            console.log("All Game news entries already exist, skipping insert");
            return;
        }

        console.log(
            `Inserting ${newEntries.length} new Game news entries (${entries.length - newEntries.length} already exist)`,
        );

        const { error } = await this.supabase.from("game_news").insert(newEntries);

        if (error) {
            console.error("Error inserting Game news:", error);
            throw new Error(`Failed to insert Game news: ${error.message}`);
        }
    }

    private async getExistingLinks(links: string[]): Promise<Set<string>> {
        const { data, error } = await this.supabase
            .from("game_news")
            .select("link")
            .in("link", links);

        if (error) {
            console.error("Error checking existing links:", error);
            return new Set();
        }

        return new Set(data?.map((item) => item.link) || []);
    }

    async getGameNewsByGame(gameSlug: string, limit = 10): Promise<GameNewsDbEntry[]> {
        const { data, error } = await this.supabase
            .from("game_news")
            .select("*")
            .eq("game_slug", gameSlug)
            .order("pub_date", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Error fetching Game news:", error);
            throw new Error(`Failed to fetch Game news: ${error.message}`);
        }

        return data || [];
    }

    async deleteOldNews(olderThanDays = 30): Promise<void> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

        const { error } = await this.supabase
            .from("game_news")
            .delete()
            .lt("created_at", cutoffDate.toISOString());

        if (error) {
            console.error("Error deleting old Game news:", error);
            throw new Error(`Failed to delete old Game news: ${error.message}`);
        }
    }

    convertToDbEntry(gameSlug: string, steamAppId: number, newsItem: GameNewsItem): GameNewsInsert {
        return {
            game_slug: gameSlug,
            steam_app_id: steamAppId,
            title: newsItem.title,
            link: newsItem.link,
            description: newsItem.description,
            pub_date: newsItem.pubDate,
        };
    }

    async insertGameNewsBatch(entries: GameNewsInsert[], batchSize = 100): Promise<void> {
        if (entries.length === 0) return;

        for (let i = 0; i < entries.length; i += batchSize) {
            const batch = entries.slice(i, i + batchSize);
            await this.insertGameNews(batch);
        }
    }

    async getLatestNewsForGames(
        gameSlugs: string[],
    ): Promise<Array<{ gameSlug: string; news: GameNewsDbEntry[] }>> {
        if (gameSlugs.length === 0) return [];

        const { data, error } = await this.supabase
            .from("game_news")
            .select("*")
            .in("game_slug", gameSlugs)
            .gt("pub_date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            .order("pub_date", { ascending: false });

        if (error) {
            console.error("Error fetching latest news for games:", error);
            throw new Error(`Failed to fetch latest news for games: ${error.message}`);
        }

        const newsByGame = new Map<string, GameNewsDbEntry[]>();
        data?.forEach((news) => {
            if (!newsByGame.has(news.game_slug)) {
                newsByGame.set(news.game_slug, []);
            }
            newsByGame.get(news.game_slug)!.push(news);
        });

        return gameSlugs
            .map((gameSlug) => ({
                gameSlug,
                news: (newsByGame.get(gameSlug) || [])
                    .sort((a, b) => new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime())
                    .slice(0, 3),
            }))
            .filter((item) => item.news.length > 0)
            .sort(
                (a, b) =>
                    new Date(b.news[0].pub_date).getTime() - new Date(a.news[0].pub_date).getTime(),
            );
    }
}
