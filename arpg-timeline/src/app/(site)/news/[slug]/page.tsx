import type { Metadata } from "next";

import {
    articleStaticParams,
    renderArticlePage,
    resolveArticleMetadata,
} from "@/lib/articles/renderArticlePage";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function NewsArticlePage({ params }: Props) {
    const { slug } = await params;
    return renderArticlePage({ category: "news", slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return resolveArticleMetadata({ category: "news", slug });
}

export async function generateStaticParams() {
    return articleStaticParams("news", "root");
}

export const revalidate = false;
export const dynamicParams = true;
