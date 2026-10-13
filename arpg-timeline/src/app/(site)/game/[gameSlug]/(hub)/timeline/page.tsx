import { Metadata } from "next";
import { notFound } from "next/navigation";

import { SupportCard } from "@/app/(site)/game/[gameSlug]/components/hub/SidebarParts";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import type { Crumb } from "@/lib/articles/breadcrumbs";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { buildSeasonTerms, SeasonTerms } from "@/lib/seasonTerms";
import { SITE_URL } from "@/lib/siteUrl";

import { getGameDetails } from "../../gameData";
import { buildCadenceHint } from "../../overview";
import { GamePageProps } from "../../types";
import { calculateGameStatistics, countTrackedSeasons } from "../../utils";
import { TimelineView } from "./components/TimelineView";
import { buildTimelineDescription, buildTimelineKeywords, buildTimelineTitle } from "./metadata";
import { buildTimelineItemList } from "./structuredData";
import {
    addNextPlaceholder,
    buildTimelineEntries,
    buildTimelineSummary,
    countGameEntries,
    getTimelinePath,
    hasTimeline,
    TimelineSummary,
} from "./timeline";

const fetchOptions = { revalidate: 24 * 60 * 60, tags: ["season", "game"] };

const buildSummarySentences = (
    gameName: string,
    terms: SeasonTerms,
    summary: TimelineSummary,
): string[] => {
    if (summary.count === 0) return [`Every ${gameName} ${terms.one} and event in order.`];
    return [
        `${summary.count} ${gameName} ${summary.count === 1 ? terms.one : terms.many} tracked since ${summary.firstYear}.`,
        ...(summary.next ? [`Next up: ${summary.next.name} (${summary.next.label}).`] : []),
    ];
};

const TimelinePage = async ({ params }: GamePageProps) => {
    const { gameSlug } = await params;

    const { data, game } = await getGameDetails(gameSlug);

    if (!game || !hasTimeline(game, countGameEntries(data.seasons, gameSlug))) {
        notFound();
    }

    const terms = buildSeasonTerms(game.seasonKeyword);
    const entries = buildTimelineEntries(data.seasons, gameSlug, new Date());
    const pagePath = getTimelinePath(gameSlug);

    const crumbs: Crumb[] = [
        { name: "Home", href: "/" },
        { name: game.name, href: `/game/${gameSlug}` },
        { name: "Timeline", href: pagePath },
    ];

    const summary = buildTimelineSummary(entries);
    // Same soft hint as the Overview Next card while the next season is unannounced
    const cadenceHint = !game.isDormant
        ? buildCadenceHint({
              currentStart: game.currentSeason?.start?.startDate,
              medianDays: calculateGameStatistics(data, gameSlug).medianDuration,
              trackedCount: countTrackedSeasons(data, gameSlug),
              terms,
              now: new Date(),
          })
        : null;
    const displayEntries = game.isComingSoon ? entries : addNextPlaceholder(entries, terms.One);
    const itemList = buildTimelineItemList(
        entries,
        `${game.name} ${terms.many} timeline`,
        `${SITE_URL}${pagePath}`,
    );

    return (
        <>
            <BreadcrumbSchema crumbs={crumbs} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(itemList).replace(/</g, "\\u003c"),
                }}
            />
            <div className="relative container mx-auto pt-6 pb-24 xl:pb-10">
                <TimelineView
                    entries={displayEntries}
                    gameLogo={game.logo}
                    game={game}
                    emptyText={`No ${terms.many} tracked yet.`}
                    header={
                        <header className="mb-6">
                            <h1 className="font-heading text-2xl md:text-3xl">
                                {game.name} {terms.One} Timeline
                            </h1>
                            <p className="text-muted-foreground mt-2 leading-relaxed">
                                {buildSummarySentences(game.name, terms, summary).map(
                                    (sentence) => (
                                        <span key={sentence} className="block">
                                            {sentence}
                                        </span>
                                    ),
                                )}
                            </p>
                            <p className="text-muted-foreground mt-2 text-xs italic">
                                Data is provided on a best-effort basis and may not be 100%
                                accurate. Dates and durations can be estimated or assumed and may
                                contain errors - especially for older data.
                            </p>
                        </header>
                    }
                    aside={<SupportCard />}
                    cadenceHint={cadenceHint}
                />
            </div>
        </>
    );
};

export default TimelinePage;

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
    const { gameSlug } = await params;

    const data: IndexQueryResult = await sanityFetch({ query: indexQuery, ...fetchOptions });
    const game = parseGamesFromSanity(data).find((g) => g.slug === gameSlug);

    if (!game || !hasTimeline(game, countGameEntries(data.seasons, gameSlug))) {
        return { title: "Game Not Found" };
    }

    const terms = buildSeasonTerms(game.seasonKeyword);
    const summary = buildTimelineSummary(buildTimelineEntries(data.seasons, gameSlug, new Date()));
    const metaInput = {
        gameName: game.name,
        shortName: game.shortName,
        terms,
        currentName: game.currentSeason?.name,
        next: summary.next,
        count: summary.count,
        firstYear: summary.firstYear,
    };
    const title = buildTimelineTitle(metaInput);
    const description = buildTimelineDescription(metaInput);
    const path = getTimelinePath(gameSlug);

    return {
        title,
        description,
        keywords: buildTimelineKeywords(metaInput),
        alternates: { canonical: path },
        openGraph: {
            title,
            description,
            siteName: "aRPG Timeline",
            type: "website",
            url: `${SITE_URL}${path}`,
            locale: "en_US",
            images: [{ url: `/api/og?game=${gameSlug}`, width: 1200, height: 630 }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`/api/og?game=${gameSlug}`],
        },
        robots: { index: true, follow: true },
    };
}

export async function generateStaticParams() {
    const data: IndexQueryResult = await sanityFetch({ query: indexQuery, ...fetchOptions });

    return parseGamesFromSanity(data)
        .filter((g) => hasTimeline(g, countGameEntries(data.seasons, g.slug)))
        .map((g) => ({ gameSlug: g.slug }));
}

export const revalidate = 3600;
