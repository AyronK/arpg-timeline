import { useSearchParams } from "next/navigation";
import { SanityImageAssetDocument } from "next-sanity";
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
        groupPriority: number;
        logo?: SanityImageAssetDocument;
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

    const excludedSlugs = useMemo(() => {
        const params =
            typeof searchParam === "string" ? [searchParam] : ((searchParam as string[]) ?? []);
        if (params.length === 0 && category === "featured") {
            return games
                .filter(
                    (g) =>
                        !g.categories?.includes("seasonal") &&
                        !g.categories?.includes("early-access") &&
                        !g.nextSeason?.start?.confirmed,
                )
                .map((g) => g.slug!)
                .filter(Boolean);
        }
        return params;
    }, [searchParam, category, games]);

    const toggleGameFilter = (slug: string, value: boolean) => {
        const filtersParams: string | string[] | null = searchParams.getAll("exclude");
        const currentFilters =
            filtersParams instanceof Array
                ? filtersParams
                : filtersParams !== null
                  ? [filtersParams]
                  : [];

        if (currentFilters.length === 0 && category === "featured") {
            const defaultExcludedSlugs = games
                .filter(
                    (g) =>
                        !g.categories?.includes("seasonal") &&
                        !g.categories?.includes("early-access") &&
                        !g.nextSeason?.start?.confirmed,
                )
                .map((g) => g.slug!)
                .filter(Boolean);

            if (value) {
                const newFilters = defaultExcludedSlugs.filter((f) => f !== slug);
                handleUpdate(newFilters);
            } else {
                handleUpdate([...defaultExcludedSlugs, slug]);
            }
        } else {
            if (value) {
                handleUpdate(currentFilters.filter((f) => f !== slug));
            } else {
                handleUpdate([...currentFilters, slug]);
            }
        }
    };

    const toggleGroupFilter = (group: string, value: boolean) => {
        const slugs = games
            .filter((g) => (group ? g?.group === group : !g?.group))
            .map((g) => g?.slug ?? "")
            .filter((g) => !!g);

        const filtersParams: string | string[] | null = searchParams.getAll("exclude");
        const currentFilters =
            filtersParams instanceof Array
                ? filtersParams
                : filtersParams !== null
                  ? [filtersParams]
                  : [];

        if (currentFilters.length === 0) {
            const defaultExcludedSlugs = games
                .filter(
                    (g) =>
                        !g.categories?.includes("seasonal") &&
                        !g.categories?.includes("early-access") &&
                        !g.nextSeason?.start?.confirmed,
                )
                .map((g) => g.slug!)
                .filter(Boolean);

            if (value) {
                const newFilters = defaultExcludedSlugs.filter((f) => !slugs.includes(f));
                handleUpdate(newFilters);
            } else {
                handleUpdate([...defaultExcludedSlugs, ...slugs]);
            }
        } else {
            if (value) {
                handleUpdate(currentFilters.filter((f) => !slugs.includes(f)));
            } else {
                handleUpdate([...currentFilters, ...slugs]);
            }
        }
    };

    const filteredGames = useMemo(() => {
        let filteredGames = games.filter((g) => !excludedSlugs.includes(g!.slug!));

        if (category === "non-seasonal") {
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
        .map((g) => ({
            label: g!.name!,
            value: g!.slug!,
            group: g.categories?.includes("early-access")
                ? "Early Access"
                : g.categories?.includes("community")
                  ? "Community"
                  : g.categories?.includes("seasonal")
                    ? "Seasonal"
                    : "Non-Seasonal",
            groupPriority: g.categories?.includes("early-access")
                ? 2
                : g.categories?.includes("community")
                  ? 3
                  : g.categories?.includes("seasonal")
                    ? 1
                    : 4,
            logo: g!.logo,
        }))
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
