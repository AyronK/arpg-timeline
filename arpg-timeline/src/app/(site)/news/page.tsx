import type { Metadata } from "next";

import { renderArticleIndex, resolveArticleIndexMetadata } from "@/lib/articles/renderArticleIndex";

interface Props {
    searchParams: Promise<{ page?: string }>;
}

export default async function NewsIndexPage({ searchParams }: Props) {
    const { page } = await searchParams;
    return renderArticleIndex({ category: "news", page });
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { page } = await searchParams;
    return resolveArticleIndexMetadata({ category: "news", page });
}

export const revalidate = false;
