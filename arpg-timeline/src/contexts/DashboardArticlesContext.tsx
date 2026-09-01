"use client";

import { createContext, ReactNode, useContext } from "react";

import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";

// Must be mounted inside GameFilterProvider - the hook reads filteredGames from it.
const DashboardArticlesContext = createContext<ArticleListItem[] | undefined>(undefined);

export const DashboardArticlesProvider = ({
    articles,
    children,
}: {
    articles: ArticleListItem[];
    children: ReactNode;
}) => (
    <DashboardArticlesContext.Provider value={articles}>
        {children}
    </DashboardArticlesContext.Provider>
);

export const useDashboardArticlePool = (): ArticleListItem[] => {
    const context = useContext(DashboardArticlesContext);
    if (context === undefined) {
        throw new Error("useDashboardArticlePool must be used within a DashboardArticlesProvider");
    }
    return context;
};
