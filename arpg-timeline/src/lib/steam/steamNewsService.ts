import { SteamNewsDbEntry, SteamNewsInsert, SteamNewsItem } from "@/types/steam-news";
import { createClient } from "@/utils/supabase/client";

export class SteamNewsService {
    private supabase = createClient();

    async insertSteamNews(entries: SteamNewsInsert[]): Promise<void> {
        if (entries.length === 0) return;

        const { error } = await this.supabase.from("steam_news").upsert(entries, {
            onConflict: "link",
            ignoreDuplicates: false,
        });

        if (error) {
            console.error("Error inserting Steam news:", error);
            throw new Error(`Failed to insert Steam news: ${error.message}`);
        }
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
}
