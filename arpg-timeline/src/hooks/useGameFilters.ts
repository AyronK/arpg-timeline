import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

import { Game } from "@/lib/cms/games.types";
import { GameFilterCategory } from "@/lib/cms/gameTags";
import { sa_event } from "@/lib/sa_event";

export const useGameFilters = (
    games: Game[],
    category: GameFilterCategory = "all",
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

        if (category === "featured") {
            filteredGames = filteredGames.filter(
                (g) => g.categories?.includes("seasonal") || g.nextSeason?.start?.confirmed,
            );
        } else if (category === "seasonal") {
            filteredGames = filteredGames.filter((g) => g.categories?.includes("seasonal"));
        } else if (category === "non-seasonal") {
            filteredGames = filteredGames.filter((g) => !g.categories?.includes("seasonal"));
        } else if (category === "community") {
            filteredGames = filteredGames.filter((g) => g.categories?.includes("community"));
        } else if (category === "early-access") {
            filteredGames = filteredGames.filter((g) => g.categories?.includes("early-access"));
        }

        return filteredGames;
    }, [category, excludedSlugs, games]);

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
        shownGames: filteredGames.length,
        totalGames: games.length,
    };
};
