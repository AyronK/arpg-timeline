import { ArticleCard } from "@/components/articles/ArticleCard";
import { ArticlePagination } from "@/components/articles/ArticlePagination";
import { Breadcrumbs } from "@/components/articles/Breadcrumbs";
import type { Crumb } from "@/lib/articles/breadcrumbs";
import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";

interface ArticleIndexProps {
    title: string;
    intro: string;
    crumbs: Crumb[];
    articles: ArticleListItem[];
    basePath: string;
    page: number;
    pageCount: number;
    showGame?: boolean;
}

export const ArticleIndex = ({
    title,
    intro,
    crumbs,
    articles,
    basePath,
    page,
    pageCount,
    showGame = true,
}: ArticleIndexProps) => (
    <div className="relative container mx-auto py-8 md:py-10">
        <Breadcrumbs crumbs={crumbs} />

        <header className="mb-8 max-w-2xl">
            <h1 className="font-heading text-3xl md:text-4xl">{title}</h1>
            <p className="text-muted-foreground mt-3 text-lg leading-relaxed">{intro}</p>
        </header>

        {articles.length === 0 ? (
            <p className="text-muted-foreground">No articles here yet - check back soon.</p>
        ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                    <ArticleCard key={article._id} article={article} showGame={showGame} />
                ))}
            </div>
        )}

        <ArticlePagination basePath={basePath} page={page} pageCount={pageCount} />
    </div>
);
