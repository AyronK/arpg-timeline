import { BookOpen, GitBranch } from "lucide-react";

import { Game } from "@/lib/cms/games.types";

import { cardClassName } from "../overview/OverviewCard";
import { ExternalRow, hostname, utm } from "../overview/OverviewSidebar";

// Guides aren't written here, so point to the game's external build/guide sites
export const GuidesEmptyState = ({ game }: { game: Game }) => {
    const slug = game.slug;
    const hasLinks = game.buildsUrl || game.guidesUrl;

    return (
        <section className={`${cardClassName} max-w-xl`}>
            <h2 className="font-heading text-lg">Builds and guides for {game.name}</h2>
            <p className="text-muted-foreground mt-2 text-sm">
                {hasLinks ? "The best places to find them:" : "Nothing here yet."}
            </p>
            {hasLinks && (
                <ul className="mt-3">
                    {game.buildsUrl && (
                        <ExternalRow
                            href={utm("builds", slug)(game.buildsUrl)}
                            saClick={`${slug}-guides-empty-builds`}
                            icon={<GitBranch className="h-4 w-4" />}
                        >
                            Find builds
                            {hostname(game.buildsUrl) && ` (${hostname(game.buildsUrl)})`}
                        </ExternalRow>
                    )}
                    {game.guidesUrl && (
                        <ExternalRow
                            href={utm("guides", slug)(game.guidesUrl)}
                            saClick={`${slug}-guides-empty-guides`}
                            icon={<BookOpen className="h-4 w-4" />}
                        >
                            Read guides
                            {hostname(game.guidesUrl) && ` (${hostname(game.guidesUrl)})`}
                        </ExternalRow>
                    )}
                </ul>
            )}
        </section>
    );
};
