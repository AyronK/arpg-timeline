import type { Metadata } from "next";

import { renderArticleIndex, resolveArticleIndexMetadata } from "@/lib/articles/renderArticleIndex";

interface Props {
    searchParams: Promise<{ page?: string }>;
}

export default async function ResourcesIndexPage({ searchParams }: Props) {
    const { page } = await searchParams;
    return renderArticleIndex({ category: "resources", page });
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { page } = await searchParams;
    return resolveArticleIndexMetadata({ category: "resources", page });
}

export const revalidate = false;
