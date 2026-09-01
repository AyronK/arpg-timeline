import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { parsePageParam } from "@/lib/articles/pagination";
import {
    articleIndexPageParams,
    renderArticleIndex,
    resolveArticleIndexMetadata,
} from "@/lib/articles/renderArticleIndex";

interface Props {
    params: Promise<{ page: string }>;
}

export default async function NewsIndexPagedPage({ params }: Props) {
    const { page } = await params;
    if (parsePageParam(page) < 2) notFound();
    return renderArticleIndex({ category: "news", page });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { page } = await params;
    return resolveArticleIndexMetadata({ category: "news", page });
}

export function generateStaticParams() {
    return articleIndexPageParams("news");
}

export const revalidate = false;
export const dynamicParams = true;
