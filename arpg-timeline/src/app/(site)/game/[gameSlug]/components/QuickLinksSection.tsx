"use client";

import {
    BookOpen,
    CalendarCheck,
    ChevronRight,
    Code2,
    FastForward,
    Gamepad2,
    GitBranch,
    Globe,
    Monitor,
    Play,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";

import { CalendarSubscribeDialog } from "@/components/CalendarSubscribeDialog";
import { GuardedExternalLink } from "@/components/GuardedExternalLink";
import { sa_event } from "@/lib/sa_event";
import { addUTMParameters } from "@/lib/utm";

import { QuickLinksSectionProps } from "../types";

const IconWrap = ({ children }: { children: ReactNode }) => (
    <div className="bg-muted/50 grid h-10 w-10 shrink-0 place-content-center rounded-full">
        {children}
    </div>
);

const LinkContent = ({
    icon,
    title,
    description,
}: {
    icon: ReactNode;
    title: string;
    description: string;
}) => (
    <>
        <IconWrap>{icon}</IconWrap>
        <div className="flex flex-col gap-0.5">
            <span className="font-heading text-foreground text-sm font-medium">{title}</span>
            <span className="text-muted-foreground text-xs leading-tight text-pretty">
                {description}
            </span>
        </div>
        <ChevronRight className="text-muted-foreground ml-auto h-4 w-4 shrink-0 translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 max-md:opacity-100" />
    </>
);

const rowCls =
    "group flex w-full items-center !gap-3 rounded-md px-3 py-3 -mx-3 cursor-pointer text-left transition-colors hover:bg-accent hover:!brightness-100";

export const QuickLinksSection = ({ game, gameSlug, steamAppId }: QuickLinksSectionProps) => {
    const [calendarOpen, setCalendarOpen] = useState(false);

    return (
        <>
            <div className="bg-card text-card-foreground flex min-h-0 flex-1 flex-col rounded-lg border p-4 md:p-6">
                <h2 className="font-heading mb-3 text-lg md:mb-4 md:text-xl">Quick Links</h2>
                <div className="flex max-h-64 min-h-0 flex-1 flex-col overflow-y-auto">
                    {game.url && (
                        <GuardedExternalLink
                            href={game.url}
                            isOfficial={game.isOfficial}
                            noIcon
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            data-sa-click={`${gameSlug}-official-website`}
                            className={rowCls}
                        >
                            <LinkContent
                                icon={<Globe className="h-5 w-5 opacity-70" />}
                                title={game.isOfficial ? "Official Website" : "Project Website"}
                                description={
                                    game.isOfficial
                                        ? `Visit the official ${game.name} website`
                                        : `Visit the ${game.name} project website`
                                }
                            />
                        </GuardedExternalLink>
                    )}

                    {steamAppId && (
                        <a
                            href={addUTMParameters({
                                utm_source: "arpg-timeline",
                                utm_medium: "link",
                                utm_campaign: "steam-store",
                                utm_content: gameSlug,
                            })(`https://store.steampowered.com/app/${steamAppId}`)}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            data-sa-click={`${gameSlug}-steam-page`}
                            className={rowCls}
                        >
                            <LinkContent
                                icon={<Gamepad2 className="h-5 w-5 opacity-70" />}
                                title="Steam Page"
                                description={`View ${game.name} on the Steam store`}
                            />
                        </a>
                    )}

                    {game.buildsUrl && (
                        <a
                            href={addUTMParameters({
                                utm_source: "arpg-timeline",
                                utm_medium: "link",
                                utm_campaign: "builds",
                                utm_content: gameSlug,
                            })(game.buildsUrl)}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            data-sa-click={`${gameSlug}-builds-quicklink`}
                            className={rowCls}
                        >
                            <LinkContent
                                icon={<GitBranch className="h-5 w-5 opacity-70" />}
                                title="Builds"
                                description={`Find build guides for ${game.name}`}
                            />
                        </a>
                    )}

                    {game.guidesUrl && (
                        <a
                            href={addUTMParameters({
                                utm_source: "arpg-timeline",
                                utm_medium: "link",
                                utm_campaign: "guides",
                                utm_content: gameSlug,
                            })(game.guidesUrl)}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            data-sa-click={`${gameSlug}-guides-quicklink`}
                            className={rowCls}
                        >
                            <LinkContent
                                icon={<BookOpen className="h-5 w-5 opacity-70" />}
                                title="Guides"
                                description={`Browse guides and resources for ${game.name}`}
                            />
                        </a>
                    )}

                    {game.currentSeason?.url && (
                        <GuardedExternalLink
                            href={game.currentSeason.url}
                            isOfficial={game.isOfficial}
                            noIcon
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            data-sa-click={`${gameSlug}-current-season-details`}
                            className={rowCls}
                        >
                            <LinkContent
                                icon={<Play className="h-5 w-5 opacity-70" />}
                                title={`Current ${game.seasonKeyword}`}
                                description={`Read about what's in the current ${game.seasonKeyword}`}
                            />
                        </GuardedExternalLink>
                    )}

                    {game.nextSeason?.url && (
                        <GuardedExternalLink
                            href={game.nextSeason.url}
                            isOfficial={game.isOfficial}
                            noIcon
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            data-sa-click={`${gameSlug}-next-season-details`}
                            className={rowCls}
                        >
                            <LinkContent
                                icon={<FastForward className="h-5 w-5 opacity-70" />}
                                title={`Next ${game.seasonKeyword}`}
                                description={`Preview details about the upcoming ${game.seasonKeyword}`}
                            />
                        </GuardedExternalLink>
                    )}
                </div>

                <CalendarSubscribeDialog
                    open={calendarOpen}
                    onOpenChange={setCalendarOpen}
                    gameSlug={gameSlug}
                    gameName={game.name}
                />
            </div>
            <div className="bg-card text-card-foreground flex-1 rounded-lg border p-4 md:p-6">
                <h2 className="font-heading mb-3 text-lg md:mb-4 md:text-xl">
                    Tools &amp; Features
                </h2>
                <div className="flex flex-col">
                    <button
                        onClick={() => {
                            sa_event("calendar_subscribe_opened", { game: gameSlug });
                            setCalendarOpen(true);
                        }}
                        data-sa-click={`${gameSlug}-calendar-subscribe-quick-link`}
                        className={rowCls}
                    >
                        <LinkContent
                            icon={<CalendarCheck className="h-5 w-5 opacity-70" />}
                            title="Subscribe to the Calendar"
                            description="Get every season in your phone or desktop calendar"
                        />
                    </button>

                    <Link
                        href={`/docs/obs/${gameSlug}`}
                        data-sa-click={`${gameSlug}-obs-docs`}
                        className={rowCls}
                    >
                        <LinkContent
                            icon={<Monitor className="h-5 w-5 opacity-70" />}
                            title="OBS Widget Integration"
                            description="Add a live countdown overlay to your OBS scene"
                        />
                    </Link>

                    <Link
                        href={`/docs/html/${gameSlug}`}
                        data-sa-click={`${gameSlug}-html-docs`}
                        className={rowCls}
                    >
                        <LinkContent
                            icon={<Code2 className="h-5 w-5 opacity-70" />}
                            title="HTML Widget Documentation"
                            description="Embed the countdown widget on your own website"
                        />
                    </Link>
                </div>
            </div>
        </>
    );
};
