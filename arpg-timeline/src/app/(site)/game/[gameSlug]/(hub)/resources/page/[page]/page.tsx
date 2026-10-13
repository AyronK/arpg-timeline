import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SupportCard } from "@/app/(site)/game/[gameSlug]/components/hub/SidebarParts";
import { parsePageParam } from "@/lib/articles/pagination";
import {
    gameArticleIndexPageParams,
    renderArticleIndex,
    resolveArticleIndexMetadata,
} from "@/lib/articles/renderArticleIndex";

interface Props {
    params: Promise<{ gameSlug: string; page: string }>;
}

export default async function GameResourcesIndexPagedPage({ params }: Props) {
    const { gameSlug, page } = await params;
    if (parsePageParam(page) < 2) notFound();
    return renderArticleIndex({ category: "resources", gameSlug, page, aside: <SupportCard /> });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { gameSlug, page } = await params;
    return resolveArticleIndexMetadata({ category: "resources", gameSlug, page });
}

export function generateStaticParams() {
    return gameArticleIndexPageParams("resources");
}

export const revalidate = false;
export const dynamicParams = true;
