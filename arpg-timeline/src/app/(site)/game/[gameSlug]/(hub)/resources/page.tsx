import type { Metadata } from "next";

import {
    articleIndexGameParams,
    renderArticleIndex,
    resolveArticleIndexMetadata,
} from "@/lib/articles/renderArticleIndex";

interface Props {
    params: Promise<{ gameSlug: string }>;
}

export default async function GameResourcesIndexPage({ params }: Props) {
    const { gameSlug } = await params;
    return renderArticleIndex({ category: "resources", gameSlug });
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
