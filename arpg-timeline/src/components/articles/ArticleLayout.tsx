import { AiDisclosureBadge } from "@/components/articles/AiDisclosureBadge";
import { ArticleBody } from "@/components/articles/ArticleBody";
import { ArticleDate } from "@/components/articles/ArticleDate";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleToc } from "@/components/articles/ArticleToc";
import { Breadcrumbs } from "@/components/articles/Breadcrumbs";
import { RelatedArticles } from "@/components/articles/RelatedArticles";
import { getArticleModified } from "@/lib/articles/articleDates";
import { ARTICLE_AUTHOR_NAME } from "@/lib/articles/author";
import { buildArticleCrumbs } from "@/lib/articles/breadcrumbs";
import { extractToc } from "@/lib/articles/tableOfContents";
import type { Article, ArticleListItem } from "@/lib/cms/queries/articleQuery";
import { cn } from "@/lib/utils";
import { Chip } from "@/ui/Chip";

import { BuyMeACoffee } from "../BuyMeACoffee";
import { PatreonFunding } from "../PatreonFunding";

const sameDay = (a: string, b: string) => a.slice(0, 10) === b.slice(0, 10);

const CATEGORY_LABEL: Record<Article["category"], string> = {
    news: "News",
    resources: "Resources",
};

interface ArticleLayoutProps {
    article: Article;
    related: ArticleListItem[];
}

export const ArticleLayout = ({ article, related }: ArticleLayoutProps) => {
    const crumbs = buildArticleCrumbs(article);
    const toc = extractToc(article.body);
    const modified = getArticleModified(article);
    const showPublished = !sameDay(article.publishedAt, modified);
    const hasToc = toc.length >= 2;
    const hasRelated = related.length > 0;
    const hasSidebar = hasToc || hasRelated;

    return (
        <div className="relative container mx-auto pt-6 pb-24 md:pt-10 lg:pb-10">
            <div
                className={cn(
                    hasSidebar && "xl:grid xl:grid-cols-[1fr_minmax(0,55rem)_1fr] xl:gap-x-8",
                )}
            >
                {hasToc && (
                    <aside className="hidden xl:col-start-1 xl:row-start-1 xl:block xl:justify-self-end">
                        <div className="sticky top-12 ml-24 w-48">
                            <ArticleToc headings={toc} variant="sidebar" />
                        </div>
                    </aside>
                )}

                {hasRelated && (
                    <aside className="hidden xl:col-start-3 xl:row-start-1 xl:block xl:justify-self-start">
                        <div className="sticky top-12 w-72">
                            <RelatedArticles articles={related} />
                        </div>
                    </aside>
                )}

                <article className="mx-auto max-w-[55rem] min-w-0 xl:col-start-2 xl:row-start-1">
                    <div className="mb-6">
                        <PatreonFunding />
                    </div>
                    <Breadcrumbs crumbs={crumbs} />

                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Chip className="bg-muted">{CATEGORY_LABEL[article.category]}</Chip>
                        {article.game && <Chip className="bg-muted">{article.game.name}</Chip>}
                    </div>

                    <h1 className="font-heading text-3xl leading-tight md:text-4xl">
                        {article.title}
                    </h1>

                    <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                        <span className="text-foreground font-medium">{ARTICLE_AUTHOR_NAME}</span>
                        <span aria-hidden>·</span>
                        <AiDisclosureBadge value={article.aiDisclosure} />
                        <span aria-hidden>·</span>
                        <span>
                            Updated <ArticleDate iso={modified} />
                        </span>
                        {showPublished && (
                            <>
                                <span aria-hidden>·</span>
                                <span>
                                    Published <ArticleDate iso={article.publishedAt} />
                                </span>
                            </>
                        )}
                    </div>

                    {article.excerpt && (
                        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                            {article.excerpt}
                        </p>
                    )}

                    {article.coverImage?.asset?.url && (
                        <ArticleImage
                            image={article.coverImage}
                            priority
                            sizes="(min-width: 880px) 830px, 100vw"
                            className="mt-6"
                        />
                    )}

                    <div className="mt-8">
                        <ArticleBody body={article.body} />
                    </div>

                    <BuyMeACoffee />

                    <RelatedArticles articles={related} className="mt-6 xl:hidden" />
                </article>
            </div>

            <ArticleToc headings={toc} variant="bottom" />
        </div>
    );
};
