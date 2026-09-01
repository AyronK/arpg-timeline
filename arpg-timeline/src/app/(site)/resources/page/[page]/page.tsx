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

export default async function ResourcesIndexPagedPage({ params }: Props) {
    const { page } = await params;
    if (parsePageParam(page) < 2) notFound();
    return renderArticleIndex({ category: "resources", page });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { page } = await params;
    return resolveArticleIndexMetadata({ category: "resources", page });
}

export function generateStaticParams() {
    return articleIndexPageParams("resources");
}

export const revalidate = false;
export const dynamicParams = true;
