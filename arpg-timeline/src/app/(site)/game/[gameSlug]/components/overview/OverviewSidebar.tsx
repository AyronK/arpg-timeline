import { BookOpen, ChevronRight, Code2, GitBranch, Globe, Monitor, Twitch } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { RiSteamLine } from "react-icons/ri";

import { GuardedExternalLink } from "@/components/GuardedExternalLink";
import { Game } from "@/lib/cms/games.types";
import { cn } from "@/lib/utils";
import { addGameLinkUTM } from "@/lib/utm";

import { ExternalRow, hostname, linkClassName, LinkRow, SupportCard } from "../hub/SidebarParts";
import { cardClassName } from "./OverviewCard";

const LinkGroup = ({ title, children }: { title: string; children: ReactNode[] }) => {
    const rows = children.filter(Boolean);
    if (rows.length === 0) return null;

    return (
        <div>
            <h3 className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                {title}
            </h3>
            <ul>{rows}</ul>
        </div>
    );
};

// Grouped by intent: things to do vs. official reference links
const GameLinks = ({ game, steamAppId }: { game: Game; steamAppId?: number | null }) => {
    const slug = game.slug;
    const buildsHost = game.buildsUrl && hostname(game.buildsUrl);
    const guidesHost = game.guidesUrl && hostname(game.guidesUrl);

    const actions = [
        game.buildsUrl && (
            <ExternalRow
                key="builds"
                href={addGameLinkUTM("builds", slug)(game.buildsUrl)}
                saClick={`${slug}-builds-quicklink`}
                icon={<GitBranch className="h-4 w-4" />}
            >
                Find builds{buildsHost && ` (${buildsHost})`}
            </ExternalRow>
        ),
        game.guidesUrl && (
            <ExternalRow
                key="guides"
                href={addGameLinkUTM("guides", slug)(game.guidesUrl)}
                saClick={`${slug}-guides-quicklink`}
                icon={<BookOpen className="h-4 w-4" />}
            >
                Read guides{guidesHost && ` (${guidesHost})`}
            </ExternalRow>
        ),
        game.twitchCategory && (
            <ExternalRow
                key="twitch-category"
                href={addGameLinkUTM(
                    "twitch-category",
                    slug,
                )(`https://www.twitch.tv/directory/category/${game.twitchCategory}`)}
                saClick={`${slug}-twitch-category`}
                icon={<Twitch className="h-4 w-4" />}
            >
                Watch live on Twitch
            </ExternalRow>
        ),
    ];

    const official = [
        game.url && (
            <li key="website">
                <GuardedExternalLink
                    href={addGameLinkUTM("official-website", slug)(game.url)}
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
        ),
        steamAppId && (
            <ExternalRow
                key="steam"
                href={addGameLinkUTM(
                    "steam-store",
                    slug,
                )(`https://store.steampowered.com/app/${steamAppId}`)}
                saClick={`${slug}-steam-page`}
                icon={<RiSteamLine className="h-4 w-4" />}
            >
                Steam store page
            </ExternalRow>
        ),
        game.twitchChannel && (
            <ExternalRow
                key="twitch-channel"
                href={`https://www.twitch.tv/${game.twitchChannel}`}
                saClick={`${slug}-twitch-channel`}
                icon={<Twitch className="h-4 w-4" />}
            >
                Official Twitch channel
            </ExternalRow>
        ),
    ];

    if (!actions.some(Boolean) && !official.some(Boolean)) return null;

    return (
        <section className={cn(cardClassName, "flex flex-col gap-4")}>
            <h2 className="sr-only">Links</h2>
            <LinkGroup title="Useful links">{actions}</LinkGroup>
            <LinkGroup title="Official">{official}</LinkGroup>
        </section>
    );
};

const CreatorRow = ({
    href,
    saClick,
    icon,
    title,
    description,
}: {
    href: string;
    saClick: string;
    icon: ReactNode;
    title: string;
    description: string;
}) => (
    <li>
        <Link href={href} data-sa-click={saClick} className={cn(linkClassName, "items-start")}>
            <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
            <span className="flex-1">
                <span className="block font-medium">{title}</span>
                <span className="text-muted-foreground block text-xs">{description}</span>
            </span>
            <ChevronRight className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        </Link>
    </li>
);

const CreatorTools = ({ gameSlug }: { gameSlug: string }) => (
    <section className={cardClassName}>
        <h2 className="font-heading mb-2 text-lg">For creators</h2>
        <ul>
            <CreatorRow
                href={`/docs/obs/${gameSlug}`}
                saClick={`${gameSlug}-obs-docs`}
                icon={<Monitor className="h-4 w-4" />}
                title="OBS overlay"
                description="Live countdown for your stream"
            />
            <CreatorRow
                href={`/docs/html/${gameSlug}`}
                saClick={`${gameSlug}-html-docs`}
                icon={<Code2 className="h-4 w-4" />}
                title="HTML widget"
                description="Embed the countdown on your site"
            />
        </ul>
    </section>
);

export const OverviewSidebar = ({
    game,
    steamAppId,
}: {
    game: Game;
    steamAppId?: number | null;
}) => (
    <aside className="flex flex-col gap-4 md:gap-6">
        <SupportCard />
        <GameLinks game={game} steamAppId={steamAppId} />
        <CreatorTools gameSlug={game.slug} />
    </aside>
);
