import { Game, GameFilter } from "@/lib/cms/games.types";

export const mapGameToFilter = (g: Game): GameFilter => ({
    label: g.name,
    value: g.slug,
    group: g.group,
});

export const byLabel = (a: GameFilter, b: GameFilter): number => (a.label > b.label ? 1 : -1);
