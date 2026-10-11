import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/articles/Breadcrumbs";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import type { Crumb } from "@/lib/articles/breadcrumbs";
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
import { SeasonTimeline } from "./components/SeasonTimeline";
import { buildTimelineEntries, groupByYear } from "./timeline";

const fetchOptions = { revalidate: 24 * 60 * 60, tags: ["season", "game"] };

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
    const groups = groupByYear(entries);
    const pagePath = `/game/${gameSlug}/timeline`;

    const crumbs: Crumb[] = [
        { name: "Home", href: "/" },
        { name: game.name, href: `/game/${gameSlug}` },
        { name: "Timeline", href: pagePath },
    ];

    const itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${game.name} ${terms.many} timeline`,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: entries.length,
        itemListElement: entries.map((entry, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
                "@type": "Event",
                name: entry.name,
                ...(entry.startDate ? { startDate: entry.startDate.toISOString() } : {}),
            },
        })),
    };

    return (
        <>
            <BreadcrumbSchema crumbs={crumbs} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
            />
            <div className="relative container mx-auto py-6 md:py-8">
                <Breadcrumbs crumbs={crumbs} />
                <header className="mb-6 max-w-2xl">
                    <h1 className="font-heading text-3xl md:text-4xl">
                        {game.name} {terms.One} Timeline
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
                        Every {game.name} {terms.one} and event in order, with start dates and how
                        long each one ran.
                    </p>
                </header>
                {groups.length === 0 ? (
                    <p className="text-muted-foreground">No {terms.many} tracked yet.</p>
                ) : (
                    <>
                        {groups.length > 1 && (
                            <a
                                href={`#year-${groups[groups.length - 1]!.key}`}
                                className="text-muted-foreground hover:text-foreground mb-2 inline-block text-sm hover:underline"
                            >
                                Jump to oldest
                            </a>
                        )}
                        <SeasonTimeline groups={groups} gameLogo={game.logo} game={game} />
                    </>
                )}
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
    const description = `Full history of ${game.name} ${terms.many}: start dates, durations and events, from the first ${terms.one} to the latest.`;
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
