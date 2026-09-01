"use client";

import { useMemo } from "react";

import { useDashboardArticlePool } from "@/contexts/DashboardArticlesContext";
import { useGameFilterContext } from "@/contexts/GameFilterContext";
import type { RankedArticle } from "@/lib/articles/rankArticles";
import {
    type DashboardArticlesOptions,
    selectDashboardArticles,
} from "@/lib/articles/selectDashboardArticles";

/**
 * Game-filtered, ranked articles for one dashboard slot. All the selection rules
 * live in selectDashboardArticles - this only wires the pool and the active game
 * filters into it.
 */
export const useDashboardArticles = (options: DashboardArticlesOptions = {}): RankedArticle[] => {
    const pool = useDashboardArticlePool();
    const { filteredGames } = useGameFilterContext();
    const { limit, minScore, genericShare, maxAgeDays } = options;

    return useMemo(
        () =>
            selectDashboardArticles(pool, filteredGames, {
                limit,
                minScore,
                genericShare,
                maxAgeDays,
            }),
        [pool, filteredGames, limit, minScore, genericShare, maxAgeDays],
    );
};
