import { GameNewsService } from "@/lib/gameNewsService";
import type { GameNewsDbEntry } from "@/types/game-news";

export async function getGameFeed(gameSlug: string, limit: number): Promise<GameNewsDbEntry[]> {
    try {
        return await new GameNewsService().getGameNewsByGame(gameSlug, limit);
    } catch (error) {
        console.error("Error fetching Game news from database:", error);
        return [];
    }
}
