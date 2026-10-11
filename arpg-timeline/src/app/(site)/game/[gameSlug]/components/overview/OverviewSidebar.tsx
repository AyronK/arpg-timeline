import { BookOpen, ExternalLink, GitBranch, Globe, Twitch } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { FaPatreon } from "react-icons/fa6";
import { RiSteamLine } from "react-icons/ri";

import { GuardedExternalLink } from "@/components/GuardedExternalLink";
import { MONTHLY_VISITORS, SITE_MONTHLY_COST } from "@/components/PatreonFunding";
import { Game } from "@/lib/cms/games.types";
import { cn } from "@/lib/utils";
import { addUTMParameters } from "@/lib/utm";
import { Button } from "@/ui/Button";

import { cardClassName } from "./OverviewCard";

const utm = (campaign: string, gameSlug: string) =>
    addUTMParameters({
        utm_source: "arpg-timeline",
        utm_medium: "link",
        utm_campaign: campaign,
        utm_content: gameSlug,
    });

const linkClassName =
    "hover:bg-accent -mx-2 flex items-center !gap-3 rounded-md px-2 py-2 text-sm transition-colors";

const LinkRow = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
    <>
        <span className="text-muted-foreground shrink-0">{icon}</span>
        <span className="flex-1">{children}</span>
        <ExternalLink className="text-muted-foreground h-3.5 w-3.5 shrink-0" aria-hidden />
    </>
);

export const PatreonCard = ({ className }: { className?: string }) => {
    if (!process.env.NEXT_PUBLIC_PATREON_URL) return null;

    return (
        <section className={cn(cardClassName, "flex flex-col gap-4", className)}>
            <div>
                <h2 className="font-heading text-lg">Keep aRPG Timeline free</h2>
                <p className="text-muted-foreground mt-2 text-sm">
                    Hosting costs ${SITE_MONTHLY_COST}/month. Patreon keeps it running for{" "}
                    {MONTHLY_VISITORS}+ players.
                </p>
            </div>
            <Button asChild className="mt-auto w-full">
                <Link
                    href={process.env.NEXT_PUBLIC_PATREON_URL}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    data-sa-click="patreon-game-sidebar"
                >
                    <FaPatreon className="mr-2 h-4 w-4" aria-hidden />
                    Support on Patreon
                </Link>
            </Button>
        </section>
    );
};

const hostname = (url: string) => {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return null;
    }
};

const GameLinks = ({ game, steamAppId }: { game: Game; steamAppId?: number | null }) => {
    const slug = game.slug;
    const buildsHost = game.buildsUrl && hostname(game.buildsUrl);
    const guidesHost = game.guidesUrl && hostname(game.guidesUrl);
    const hasAny =
        game.buildsUrl || game.guidesUrl || game.url || steamAppId || game.twitchCategory;
    if (!hasAny) return null;

    return (
        <section className={cardClassName}>
            <h2 className="font-heading mb-2 text-lg">Links</h2>
            <ul>
                {game.buildsUrl && (
                    <li>
                        <a
                            href={utm("builds", slug)(game.buildsUrl)}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            data-sa-click={`${slug}-builds-quicklink`}
                            className={linkClassName}
                        >
                            <LinkRow icon={<GitBranch className="h-4 w-4" />}>
                                Builds{buildsHost && ` (${buildsHost})`}
                            </LinkRow>
                        </a>
                    </li>
                )}
                {game.guidesUrl && (
                    <li>
                        <a
                            href={utm("guides", slug)(game.guidesUrl)}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            data-sa-click={`${slug}-guides-quicklink`}
                            className={linkClassName}
                        >
                            <LinkRow icon={<BookOpen className="h-4 w-4" />}>
                                Guides{guidesHost && ` (${guidesHost})`}
                            </LinkRow>
                        </a>
                    </li>
                )}
                {game.url && (
                    <li>
                        <GuardedExternalLink
                            href={utm("official-website", slug)(game.url)}
                            isOfficial={game.isOfficial}
                            noIcon
                            target="_blank"
                            rel="noopener noreferrer"
                            data-sa-click={`${slug}-official-website`}
                            className={linkClassName}
                        >
                            <LinkRow icon={<Globe className="h-4 w-4" />}>
                                {game.isOfficial ? "Official website" : "Project website"}
                            </LinkRow>
                        </GuardedExternalLink>
                    </li>
                )}
                {steamAppId && (
                    <li>
                        <a
                            href={utm(
                                "steam-store",
                                slug,
                            )(`https://store.steampowered.com/app/${steamAppId}`)}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            data-sa-click={`${slug}-steam-page`}
                            className={linkClassName}
                        >
                            <LinkRow icon={<RiSteamLine className="h-4 w-4" />}>Steam</LinkRow>
                        </a>
                    </li>
                )}
                {game.twitchCategory && (
                    <li>
                        <a
                            href={utm(
                                "twitch-category",
                                slug,
                            )(`https://www.twitch.tv/directory/category/${game.twitchCategory}`)}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            data-sa-click={`${slug}-twitch-category`}
                            className={linkClassName}
                        >
                            <LinkRow icon={<Twitch className="h-4 w-4" />}>Twitch</LinkRow>
                        </a>
                    </li>
                )}
            </ul>
        </section>
    );
};

export const OverviewSidebar = ({
    game,
    steamAppId,
    withPatreon,
    className,
}: {
    game: Game;
    steamAppId?: number | null;
    withPatreon?: boolean;
    className?: string;
}) => (
    <aside className={cn("flex flex-col gap-4 md:gap-6", className)}>
        {withPatreon && <PatreonCard />}
        <GameLinks game={game} steamAppId={steamAppId} />
        <p className="text-muted-foreground px-1 text-sm">
            For creators:{" "}
            <Link
                href={`/docs/obs/${game.slug}`}
                data-sa-click={`${game.slug}-obs-docs`}
                className="hover:text-foreground underline underline-offset-2"
            >
                OBS overlay
            </Link>
            ,{" "}
            <Link
                href={`/docs/html/${game.slug}`}
                data-sa-click={`${game.slug}-html-docs`}
                className="hover:text-foreground underline underline-offset-2"
            >
                HTML widget
            </Link>
        </p>
    </aside>
);
