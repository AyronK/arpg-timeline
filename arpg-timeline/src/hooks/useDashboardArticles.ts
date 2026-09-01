"use client";

import { useMemo } from "react";

import { useDashboardArticlePool } from "@/contexts/DashboardArticlesContext";
import { useGameFilterContext } from "@/contexts/GameFilterContext";
import { rankArticles, type RankedArticle } from "@/lib/articles/rankArticles";

export interface DashboardArticlesOptions {
    /** How many articles the slot can show. */
    limit: number;
    /**
     * Minimum score an article needs to be shown at all. Slots that intrude on the
     * game grid set this so they stay empty unless something is genuinely worth it;
     * slots with reserved space leave it at 0.
     */
    minScore?: number;
    /**
     * Ceiling on how much of the slot generic (gameless) articles may claim while
     * game-specific ones are still available. They still backfill leftover space.
     */
    genericShare?: number;
}

const DEFAULT_GENERIC_SHARE = 0.5;

/**
 * Game-filtered, ranked articles for one dashboard slot.
 *
 * Filter rules:
 * - game-scoped article -> shown only while its game survives the user's filters
 * - generic article     -> never hidden by game filters, but capped by genericShare
 *   so a heavily filtered dashboard doesn't turn into all-generic content
 */
export const useDashboardArticles = ({
    limit,
    minScore = 0,
    genericShare = DEFAULT_GENERIC_SHARE,
}: DashboardArticlesOptions): RankedArticle[] => {
    const pool = useDashboardArticlePool();
    const { filteredGames } = useGameFilterContext();

    return useMemo(() => {
        if (limit <= 0) return [];

        const visibleSlugs = new Set(filteredGames.map((g) => g.slug));

        const ranked = rankArticles(pool, filteredGames).filter((r) => r.score >= minScore);

        const scoped: RankedArticle[] = [];
        const generic: RankedArticle[] = [];

        for (const entry of ranked) {
            const gameSlug = entry.article.game?.slug;
            if (!gameSlug) generic.push(entry);
            else if (visibleSlugs.has(gameSlug)) scoped.push(entry);
        }

        const genericCap = Math.max(1, Math.ceil(limit * genericShare));
        const selected = [...scoped, ...generic.slice(0, genericCap)]
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        // Backfill rather than leave a reserved slot half empty.
        if (selected.length < limit) {
            const taken = new Set(selected.map((r) => r.article._id));
            for (const entry of generic) {
                if (selected.length === limit) break;
                if (!taken.has(entry.article._id)) selected.push(entry);
            }
        }

        return selected;
    }, [pool, filteredGames, limit, minScore, genericShare]);
};
