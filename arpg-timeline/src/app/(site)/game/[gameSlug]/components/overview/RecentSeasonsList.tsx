import { formatSeasonRow } from "../../overview";
import { ArchivalSeason } from "../../types";

export const RecentSeasonsList = ({ seasons }: { seasons: ArchivalSeason[] }) => (
    <ul className="divide-foreground/10 divide-y">
        {seasons.map((season) => (
            <li
                key={`${season.name}-${season.startDate.toISOString()}`}
                className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
                <span className="text-sm font-medium">{season.name}</span>
                <span className="text-muted-foreground text-sm">{formatSeasonRow(season)}</span>
            </li>
        ))}
    </ul>
);
