import type { Metadata } from "next";

import {
    articleIndexGameParams,
    renderArticleIndex,
    resolveArticleIndexMetadata,
} from "@/lib/articles/renderArticleIndex";

import { GuidesEmptyState } from "../../components/guides/GuidesEmptyState";
import { getGameDetails } from "../../gameData";

interface Props {
    params: Promise<{ gameSlug: string }>;
}

export default async function GameResourcesIndexPage({ params }: Props) {
    const { gameSlug } = await params;
    const { game } = await getGameDetails(gameSlug);

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
