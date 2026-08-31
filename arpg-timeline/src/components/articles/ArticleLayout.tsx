import { AiDisclosureBadge } from "@/components/articles/AiDisclosureBadge";
import { ArticleBody } from "@/components/articles/ArticleBody";
import { ArticleDate } from "@/components/articles/ArticleDate";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleToc } from "@/components/articles/ArticleToc";
import { Breadcrumbs } from "@/components/articles/Breadcrumbs";
import { getArticleModified } from "@/lib/articles/articleDates";
import { ARTICLE_AUTHOR_NAME } from "@/lib/articles/author";
import { buildArticleCrumbs } from "@/lib/articles/breadcrumbs";
import { extractToc } from "@/lib/articles/tableOfContents";
import type { Article } from "@/lib/cms/queries/articleQuery";
import { cn } from "@/lib/utils";
import { Chip } from "@/ui/Chip";
import { PatreonFunding } from "../PatreonFunding";
import { BuyMeACoffee } from "../BuyMeACoffee";

const sameDay = (a: string, b: string) => a.slice(0, 10) === b.slice(0, 10);

const CATEGORY_LABEL: Record<Article["category"], string> = {
    news: "News",
    resources: "Resources",
};

export const ArticleLayout = ({ article }: { article: Article }) => {
    const crumbs = buildArticleCrumbs(article);
    const toc = extractToc(article.body);
    const modified = getArticleModified(article);
    const showPublished = !sameDay(article.publishedAt, modified);
    const hasToc = toc.length >= 2;

    return (
        <div className="relative container mx-auto pt-6 pb-24 md:pt-10 lg:pb-10">
            <div
                className={cn(
                    hasToc &&
                    "lg:grid lg:grid-cols-[14rem_minmax(0,52rem)] lg:justify-center lg:gap-10",
                )}
            >
                {hasToc && (
                    <aside className="hidden lg:block">
                        <div className="sticky top-12">
                            <ArticleToc headings={toc} variant="sidebar" />
                        </div>
                    </aside>
                )}

                <article className={cn("mx-auto max-w-[55rem] min-w-0", hasToc && "lg:mx-0")}>
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
                </article>

            </div>

            <ArticleToc headings={toc} variant="bottom" />
        </div>
    );
};
