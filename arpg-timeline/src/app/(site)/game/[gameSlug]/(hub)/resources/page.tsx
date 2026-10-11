import type { Metadata } from "next";

import {
    articleIndexGameParams,
    renderArticleIndex,
    resolveArticleIndexMetadata,
} from "@/lib/articles/renderArticleIndex";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { gameDetailsQuery, GameDetailsQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";

import { GuidesEmptyState } from "../../components/guides/GuidesEmptyState";

interface Props {
    params: Promise<{ gameSlug: string }>;
}

export default async function GameResourcesIndexPage({ params }: Props) {
    const { gameSlug } = await params;
    const data: GameDetailsQueryResult = await sanityFetch({
        query: gameDetailsQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "game"],
    });
    const game = parseGamesFromSanity(data).find((g) => g.slug === gameSlug);

    return renderArticleIndex({
        category: "resources",
        gameSlug,
        emptyState: game && <GuidesEmptyState game={game} />,
    });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { gameSlug } = await params;
    return resolveArticleIndexMetadata({ category: "resources", gameSlug });
}

export function generateStaticParams() {
    return articleIndexGameParams("resources");
}

export const revalidate = false;
export const dynamicParams = true;
