import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

import { Game } from "@/lib/cms/games.types";
import { DashboardTag } from "@/lib/cms/gameTags";
import { sa_event } from "@/lib/sa_event";

export const useGameFilters = (
    games: Game[],
    dashboardTag: DashboardTag = "default-when-next-confirmed",
): {
    gameFilters: {
        label: string;
        value: string;
        group: string;
    }[];
    toggleGameFilter: (slug: string, value: boolean) => void;
    toggleGroupFilter: (group: string, value: boolean) => void;
    activeFilters: string[];
    filteredGames: Game[];
    totalGames: number;
    shownGames: number;
    dashboardTag: DashboardTag;
} => {
    const searchParams = useSearchParams();
    const searchParam = searchParams.getAll("exclude");

    const handleUpdate = useCallback((slugs: string[]) => {
        const params = new URLSearchParams();

        if (slugs?.length > 0) {
            slugs.forEach((val) => {
                params.append("exclude", val);
            });
        } else {
            params.delete("exclude");
        }

        window.history.pushState({}, "", "?" + params.toString());
    }, []);

    const excludedSlugs = useMemo(
        () => (typeof searchParam === "string" ? [searchParam] : ((searchParam as string[]) ?? [])),
        [searchParam],
    );

    const toggleGameFilter = (slug: string, value: boolean) => {
        const filtersParams: string | string[] | null = searchParams.getAll("exclude");
        const filters =
            filtersParams instanceof Array
                ? filtersParams
                : filtersParams !== null
                  ? [filtersParams]
                  : [];

        if (value) {
            handleUpdate(filters.filter((f) => f !== slug));
        } else {
            filters.push(slug);
            handleUpdate(filters);
        }
    };

    const toggleGroupFilter = (group: string, value: boolean) => {
        const slugs = games
            .filter((g) => (group ? g?.group === group : !g?.group))
            .map((g) => g?.slug ?? "")
            .filter((g) => !!g);

        const filtersParams: string | string[] | null = searchParams.getAll("exclude");
        const filters =
            filtersParams instanceof Array
                ? filtersParams
                : filtersParams !== null
                  ? [filtersParams]
                  : [];

        if (value) {
            handleUpdate(filters.filter((f) => !slugs.includes(f)));
        } else {
            handleUpdate([...filters, ...slugs]);
        }
    };

    const filteredGames = useMemo(() => {
        let filteredGames = games.filter((g) => !excludedSlugs.includes(g!.slug!));

        if (dashboardTag === "default-when-next-confirmed") {
            filteredGames = filteredGames.filter(
                (g) =>
                    g.dashboardTags?.includes("default") ||
                    (g.dashboardTags?.includes("default-when-next-confirmed") &&
                        g.nextSeason?.start?.confirmed),
            );
        } else {
            filteredGames = filteredGames.filter((g) => g.dashboardTags?.includes(dashboardTag));
        }

        return filteredGames;
    }, [dashboardTag, excludedSlugs, games]);

    useEffect(() => {
        for (const i in excludedSlugs) {
            if (Object.prototype.hasOwnProperty.call(filteredGames, i)) {
                const element = excludedSlugs[i];
                sa_event(`game-hidden--${element}`);
            }
        }

        if (filteredGames.length > 0) {
            sa_event("games-visible", {
                games: filteredGames
                    .sort((a, b) => a.slug.localeCompare(b.slug))
                    .map((g) => g.slug)
                    .join(","),
            });
        }
    }, [excludedSlugs, filteredGames, searchParam]);

    const activeFilters = games.map((g) => g!.slug!).filter((s) => !excludedSlugs.includes(s!));

    const gameFilters = games
        .map((g) => ({ label: g!.name!, value: g!.slug!, group: g!.group! }))
        .sort((a, b) => (a.label > b.label ? 1 : -1));

    return {
        gameFilters,
        toggleGameFilter,
        toggleGroupFilter,
        filteredGames,
        activeFilters,
        dashboardTag,
        shownGames: filteredGames.length,
        totalGames: games.length,
    };
};
