import type { Metadata } from "next";

import { renderArticleIndex, resolveArticleIndexMetadata } from "@/lib/articles/renderArticleIndex";

interface Props {
    params: Promise<{ gameSlug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export default async function GameResourcesIndexPage({ params, searchParams }: Props) {
    const { gameSlug } = await params;
    const { page } = await searchParams;
    return renderArticleIndex({ category: "resources", gameSlug, page });
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { gameSlug } = await params;
    const { page } = await searchParams;
    return resolveArticleIndexMetadata({ category: "resources", gameSlug, page });
}

export const revalidate = false;
