import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { parsePageParam } from "@/lib/articles/pagination";
import {
    gameArticleIndexPageParams,
    renderArticleIndex,
    resolveArticleIndexMetadata,
} from "@/lib/articles/renderArticleIndex";

interface Props {
    params: Promise<{ gameSlug: string; page: string }>;
}

export default async function GameNewsIndexPagedPage({ params }: Props) {
    const { gameSlug, page } = await params;
    if (parsePageParam(page) < 2) notFound();
    return renderArticleIndex({ category: "news", gameSlug, page });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { gameSlug, page } = await params;
    return resolveArticleIndexMetadata({ category: "news", gameSlug, page });
}

export function generateStaticParams() {
    return gameArticleIndexPageParams("news");
}

export const revalidate = false;
export const dynamicParams = true;
