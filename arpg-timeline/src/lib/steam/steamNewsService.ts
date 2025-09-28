import { SteamNewsDbEntry, SteamNewsInsert, SteamNewsItem } from "@/types/steam-news";
import { createClient } from "@/utils/supabase/client";

export class SteamNewsService {
    private supabase = createClient();

    async insertSteamNews(entries: SteamNewsInsert[]): Promise<void> {
        if (entries.length === 0) return;

        const existingLinks = await this.getExistingLinks(entries.map((e) => e.link));
        const newEntries = entries.filter((entry) => !existingLinks.has(entry.link));

        if (newEntries.length === 0) {
            console.log("All Steam news entries already exist, skipping insert");
            return;
        }

        console.log(
            `Inserting ${newEntries.length} new Steam news entries (${entries.length - newEntries.length} already exist)`,
        );

        const { error } = await this.supabase.from("steam_news").insert(newEntries);

        if (error) {
            console.error("Error inserting Steam news:", error);
            throw new Error(`Failed to insert Steam news: ${error.message}`);
        }
    }

    private async getExistingLinks(links: string[]): Promise<Set<string>> {
        const { data, error } = await this.supabase
            .from("steam_news")
            .select("link")
            .in("link", links);

        if (error) {
            console.error("Error checking existing links:", error);
            return new Set();
        }

        return new Set(data?.map((item) => item.link) || []);
    }

    async getSteamNewsByGame(gameSlug: string, limit = 10): Promise<SteamNewsDbEntry[]> {
        const { data, error } = await this.supabase
            .from("steam_news")
            .select("*")
            .eq("game_slug", gameSlug)
            .order("pub_date", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Error fetching Steam news:", error);
            throw new Error(`Failed to fetch Steam news: ${error.message}`);
        }

        return data || [];
    }

    async getSteamNewsByAppId(steamAppId: number, limit = 10): Promise<SteamNewsDbEntry[]> {
        const { data, error } = await this.supabase
            .from("steam_news")
            .select("*")
            .eq("steam_app_id", steamAppId)
            .order("pub_date", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Error fetching Steam news by app ID:", error);
            throw new Error(`Failed to fetch Steam news by app ID: ${error.message}`);
        }

        return data || [];
    }

    async deleteOldNews(olderThanDays = 30): Promise<void> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

        const { error } = await this.supabase
            .from("steam_news")
            .delete()
            .lt("created_at", cutoffDate.toISOString());

        if (error) {
            console.error("Error deleting old Steam news:", error);
            throw new Error(`Failed to delete old Steam news: ${error.message}`);
        }
    }

    convertToDbEntry(
        gameSlug: string,
        steamAppId: number,
        newsItem: SteamNewsItem,
    ): SteamNewsInsert {
        return {
            game_slug: gameSlug,
            steam_app_id: steamAppId,
            title: newsItem.title,
            link: newsItem.link,
            description: newsItem.description,
            pub_date: newsItem.pubDate,
        };
    }

    async insertSteamNewsBatch(entries: SteamNewsInsert[], batchSize = 100): Promise<void> {
        if (entries.length === 0) return;

        for (let i = 0; i < entries.length; i += batchSize) {
            const batch = entries.slice(i, i + batchSize);
            await this.insertSteamNews(batch);
        }
    }

    async getLatestNewsForGames(
        gameSlugs: string[],
    ): Promise<Array<{ gameSlug: string; news: SteamNewsDbEntry | null }>> {
        if (gameSlugs.length === 0) return [];

        const { data, error } = await this.supabase
            .from("steam_news")
            .select("*")
            .in("game_slug", gameSlugs)
            .order("pub_date", { ascending: false });

        if (error) {
            console.error("Error fetching latest news for games:", error);
            throw new Error(`Failed to fetch latest news for games: ${error.message}`);
        }

        // Group by game_slug and get the most recent for each
        const newsByGame = new Map<string, SteamNewsDbEntry>();
        data?.forEach((news) => {
            if (!newsByGame.has(news.game_slug)) {
                newsByGame.set(news.game_slug, news);
            }
        });

        // Return results ordered by publication date (most recent first)
        return gameSlugs
            .map((gameSlug) => ({
                gameSlug,
                news: newsByGame.get(gameSlug) || null,
            }))
            .filter((item) => item.news !== null)
            .sort(
                (a, b) =>
                    new Date(b.news!.pub_date).getTime() - new Date(a.news!.pub_date).getTime(),
            );
    }
}
