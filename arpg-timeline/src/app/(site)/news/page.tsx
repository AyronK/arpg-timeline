import type { Metadata } from "next";

import { renderArticleIndex, resolveArticleIndexMetadata } from "@/lib/articles/renderArticleIndex";

export default async function NewsIndexPage() {
    return renderArticleIndex({ category: "news" });
}

export function generateMetadata(): Promise<Metadata> {
    return resolveArticleIndexMetadata({ category: "news" });
}

export const revalidate = false;
