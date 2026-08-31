interface HasModified {
    updatedAt?: string | null;
    _updatedAt: string;
}

/** Author-set `updatedAt` override, falling back to the document's own edit time. */
export const getArticleModified = (article: HasModified): string =>
    article.updatedAt || article._updatedAt;
