"use client";

import { useMemo } from "react";

import { useDashboardArticlePool } from "@/contexts/DashboardArticlesContext";
import { useGameFilterContext } from "@/contexts/GameFilterContext";
import type { RankedArticle } from "@/lib/articles/rankArticles";
import {
    type DashboardArticlesOptions,
    selectDashboardArticles,
} from "@/lib/articles/selectDashboardArticles";

/** Wires the article pool and active game filters into selectDashboardArticles. */
export const useDashboardArticles = (options: DashboardArticlesOptions = {}): RankedArticle[] => {
    const pool = useDashboardArticlePool();
    const { filteredGames } = useGameFilterContext();
    const { maxAgeDays } = options;

    return useMemo(
        () => selectDashboardArticles(pool, filteredGames, { maxAgeDays }),
        [pool, filteredGames, maxAgeDays],
    );
};
