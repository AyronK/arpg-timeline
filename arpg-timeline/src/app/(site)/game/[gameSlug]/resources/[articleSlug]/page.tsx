import type { Metadata } from "next";

import {
    articleStaticParams,
    renderArticlePage,
    resolveArticleMetadata,
} from "@/lib/articles/renderArticlePage";

interface Props {
    params: Promise<{ gameSlug: string; articleSlug: string }>;
}

export default async function GameResourceArticlePage({ params }: Props) {
    const { gameSlug, articleSlug } = await params;
    return renderArticlePage({ category: "resources", slug: articleSlug, gameSlug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { gameSlug, articleSlug } = await params;
    return resolveArticleMetadata({ category: "resources", slug: articleSlug, gameSlug });
}

export async function generateStaticParams() {
    return articleStaticParams("resources", "game");
}

export const revalidate = false;
export const dynamicParams = true;
