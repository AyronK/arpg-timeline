import type { Metadata } from "next";

import { renderArticleIndex, resolveArticleIndexMetadata } from "@/lib/articles/renderArticleIndex";

export default async function ResourcesIndexPage() {
    return renderArticleIndex({ category: "resources" });
}

export function generateMetadata(): Promise<Metadata> {
    return resolveArticleIndexMetadata({ category: "resources" });
}

export const revalidate = false;
