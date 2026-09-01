import type { Metadata } from "next";

import {
    articleIndexGameParams,
    renderArticleIndex,
    resolveArticleIndexMetadata,
} from "@/lib/articles/renderArticleIndex";

interface Props {
    params: Promise<{ gameSlug: string }>;
}

export default async function GameNewsIndexPage({ params }: Props) {
    const { gameSlug } = await params;
    return renderArticleIndex({ category: "news", gameSlug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { gameSlug } = await params;
    return resolveArticleIndexMetadata({ category: "news", gameSlug });
}

export function generateStaticParams() {
    return articleIndexGameParams("news");
}

export const revalidate = false;
export const dynamicParams = true;
