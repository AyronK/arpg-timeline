import { GuardedExternalLink } from "@/components/GuardedExternalLink";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { addUTMParameters } from "@/lib/utm";

import { QuickLinksSectionProps } from "../types";

export const QuickLinksSection = ({ game, gameSlug, steamAppId }: QuickLinksSectionProps) => {
    return (
        <div className="bg-card text-card-foreground flex-1 rounded-lg border p-4 md:p-6">
            <h2 className="font-heading mb-3 text-lg md:mb-4 md:text-xl">Quick Links</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
                {game.url && (
                    <div className="flex flex-col gap-1">
                        {!game.isOfficial ? (
                            <GuardedExternalLink
                                href={game.url}
                                isOfficial={false}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-sa-click={`${gameSlug}-official-website`}
                            >
                                Community Website
                            </GuardedExternalLink>
                        ) : (
                            <MaybeLinkWrapper
                                href={game.url}
                                target="_blank"
                                rel="noopener"
                                data-sa-click={`${gameSlug}-official-website`}
                            >
                                Official Game Website
                            </MaybeLinkWrapper>
                        )}
                    </div>
                )}
                {steamAppId && (
                    <MaybeLinkWrapper
                        href={addUTMParameters({
                            utm_source: "arpg-timeline",
                            utm_medium: "link",
                            utm_campaign: "steam-store",
                            utm_content: gameSlug,
                        })(`https://store.steampowered.com/app/${steamAppId}`)}
                        target="_blank"
                        rel="noopener"
                        data-sa-click={`${gameSlug}-steam-page`}
                    >
                        Steam Page
                    </MaybeLinkWrapper>
                )}
                {game.currentSeason?.url && (
                    <MaybeLinkWrapper
                        href={game.currentSeason?.url}
                        target="_blank"
                        rel="noopener"
                        data-sa-click={`${gameSlug}-current-season-details`}
                    >
                        Current {game.seasonKeyword} details
                    </MaybeLinkWrapper>
                )}
                {game.nextSeason?.url && (
                    <MaybeLinkWrapper
                        href={game.nextSeason?.url}
                        target="_blank"
                        rel="noopener"
                        data-sa-click={`${gameSlug}-next-season-details`}
                    >
                        Next {game.seasonKeyword} details
                    </MaybeLinkWrapper>
                )}

                <div className="border-muted-foreground col-span-full h-px border border-t opacity-50" />

                <MaybeLinkWrapper
                    href={`/docs/html/${gameSlug}`}
                    data-sa-click={`${gameSlug}-html-docs`}
                >
                    HTML Widget Documentation
                </MaybeLinkWrapper>
                <MaybeLinkWrapper
                    href={`/docs/obs/${gameSlug}`}
                    data-sa-click={`${gameSlug}-obs-docs`}
                >
                    OBS Widget Integration
                </MaybeLinkWrapper>
                <MaybeLinkWrapper
                    href={`/embed/season-widget/${gameSlug}`}
                    data-sa-click={`${gameSlug}-embed-widget`}
                >
                    Embed Widget
                </MaybeLinkWrapper>
            </div>
        </div>
    );
};
