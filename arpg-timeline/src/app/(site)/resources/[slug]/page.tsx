import type { Metadata } from "next";

import {
    articleStaticParams,
    renderArticlePage,
    resolveArticleMetadata,
} from "@/lib/articles/renderArticlePage";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ResourceArticlePage({ params }: Props) {
    const { slug } = await params;
    return renderArticlePage({ category: "resources", slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return resolveArticleMetadata({ category: "resources", slug });
}

export async function generateStaticParams() {
    return articleStaticParams("resources", "root");
}

export const revalidate = false;
export const dynamicParams = true;
