import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/articles/Breadcrumbs";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import type { Crumb } from "@/lib/articles/breadcrumbs";
import { getRelatedArticles } from "@/lib/articles/getArticleListData";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import {
    gameDetailsQuery,
    GameDetailsQueryResult,
    indexQuery,
    IndexQueryResult,
} from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { buildSeasonTerms } from "@/lib/seasonTerms";
import { SITE_URL } from "@/lib/siteUrl";

import { GamePageProps } from "../types";
import { TimelineAside } from "./components/TimelineAside";
import { TimelineView } from "./components/TimelineView";
import {
    buildTimelineEntries,
    buildTimelineSummary,
    formatApproxMonths,
    TimelineSummary,
} from "./timeline";

const fetchOptions = { revalidate: 24 * 60 * 60, tags: ["season", "game"] };

const buildSummarySentences = (
    gameName: string,
    many: string,
    summary: TimelineSummary,
): string[] => {
    if (summary.count === 0) return [`Every ${gameName} ${many.slice(0, -1)} and event in order.`];
    return [
        `${summary.count} ${gameName} ${many} tracked since ${summary.firstYear}.`,
        ...(summary.next ? [`Next up: ${summary.next.name} (${summary.next.label}).`] : []),
    ];
};

const TimelinePage = async ({ params }: GamePageProps) => {
    const { gameSlug } = await params;

    const data: GameDetailsQueryResult = await sanityFetch({
        query: gameDetailsQuery,
        ...fetchOptions,
    });

    const game = parseGamesFromSanity(data).find((g) => g.slug === gameSlug);

    if (!game || !game.categories?.includes("seasonal")) {
        notFound();
    }

    const terms = buildSeasonTerms(game.seasonKeyword);
    const entries = buildTimelineEntries(data.seasons, gameSlug, new Date());
    const related = await getRelatedArticles({
        excludeId: "",
        gameRef: game._id,
        category: "news",
    });
    const shareTitle = `${game.name} ${terms.One} Timeline`;
    const pagePath = `/game/${gameSlug}/timeline`;

    const crumbs: Crumb[] = [
        { name: "Home", href: "/" },
        { name: game.name, href: `/game/${gameSlug}` },
        { name: "Timeline", href: pagePath },
    ];

    const summary = buildTimelineSummary(entries);
    const itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${game.name} ${terms.many} timeline`,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: entries.length,
        itemListElement: entries.map((entry, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: entry.name,
        })),
    };

    return (
        <>
            <BreadcrumbSchema crumbs={crumbs} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
            />
            <div className="relative container mx-auto pt-6 pb-24 md:pt-8 xl:pb-10">
                <TimelineView
                    entries={entries}
                    gameLogo={game.logo}
                    game={game}
                    emptyText={`No ${terms.many} tracked yet.`}
                    header={
                        <>
                            <Breadcrumbs crumbs={crumbs} />
                            <header className="mb-6">
                                <h1 className="font-heading text-3xl md:text-4xl">
                                    {game.name} {terms.One} Timeline
                                </h1>
                                <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
                                    {buildSummarySentences(game.name, terms.many, summary).map(
                                        (sentence) => (
                                            <span key={sentence} className="block">
                                                {sentence}
                                            </span>
                                        ),
                                    )}
                                </p>
                                <p className="text-muted-foreground mt-3 text-sm italic">
                                    Data is provided on a best-effort basis and may not be 100%
                                    accurate. Dates and durations can be estimated or assumed and
                                    may contain errors - especially for older data.
                                </p>
                            </header>
                        </>
                    }
                    aside={<TimelineAside related={related} shareTitle={shareTitle} />}
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

    if (!game || !game.categories?.includes("seasonal")) {
        return { title: "Game Not Found" };
    }

    const terms = buildSeasonTerms(game.seasonKeyword);
    const title = `${game.name} ${terms.One} Timeline | aRPG Timeline`;
    const summary = buildTimelineSummary(buildTimelineEntries(data.seasons, gameSlug, new Date()));
    const description = summary.count
        ? `${game.name} ${terms.many} timeline: ${summary.count} ${terms.many} since ${summary.firstYear}${
              summary.averageDays
                  ? `, averaging ${formatApproxMonths(summary.averageDays)} each`
                  : ""
          }. Start dates, durations and events${
              summary.next ? `, plus the next ${terms.one} (${summary.next.label})` : ""
          }.`
        : `Full history of ${game.name} ${terms.many}: start dates, durations and events.`;
    const path = `/game/${gameSlug}/timeline`;

    return {
        title,
        description,
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
        .filter((g) => g.categories?.includes("seasonal"))
        .map((g) => ({ gameSlug: g.slug }));
}

export const revalidate = 3600;
