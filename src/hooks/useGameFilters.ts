import { useSearchParams } from "@/hooks/useSearchParams";
import { Game } from "@/lib/cms/games.types";

export const useGameFilters = (games: Game[]) => {
  const [, setSearchParam, getSearchParam] = useSearchParams();
  const searchParam = getSearchParam("exclude");

  const excludedSlugs =
    typeof searchParam === "string"
      ? [searchParam]
      : ((searchParam as string[]) ?? []);

  const toggleGameFilter = (slug: string, value: boolean) => {
    const filtersParams: string | string[] | null = getSearchParam("exclude");
    const filters =
      filtersParams instanceof Array
        ? filtersParams
        : filtersParams !== null
          ? [filtersParams]
          : [];

    if (value) {
      setSearchParam(
        "exclude",
        filters.filter((f) => f !== slug),
      );
    } else {
      filters.push(slug);
      setSearchParam("exclude", filters);
    }
  };

  const toggleGroupFilter = (group: string, value: boolean) => {
    const slugs = games
      .filter((g) => (group ? g?.group === group : !g?.group))
      .map((g) => g?.slug ?? "")
      .filter((g) => !!g);

    const filtersParams: string | string[] | null = getSearchParam("exclude");
    const filters =
      filtersParams instanceof Array
        ? filtersParams
        : filtersParams !== null
          ? [filtersParams]
          : [];

    if (value) {
      setSearchParam(
        "exclude",
        filters.filter((f) => !slugs.includes(f)),
      );
    } else {
      setSearchParam("exclude", [...filters, ...slugs]);
    }
  };

  const filteredGames = games.filter((g) => !excludedSlugs.includes(g!.slug!));

  const activeFilters = games
    .map((g) => g!.slug!)
    .filter((s) => !excludedSlugs.includes(s!));

  const gameFilters = games
    .map((g) => ({
      label: g!.title!,
      value: g!.slug!,
      group: g!.group!,
    }))
    .sort((a, b) => (a.label > b.label ? 1 : -1));

  return {
    gameFilters,
    toggleGameFilter,
    toggleGroupFilter,
    filteredGames,
    activeFilters,
  };
};
