interface HasModified {
    updatedAt?: string | null;
    _updatedAt: string;
}

/**
 * The article's effective "last modified" timestamp: the author-set `updatedAt`
 * override when present, otherwise the document's own last-edit time.
 */
export const getArticleModified = (article: HasModified): string =>
    article.updatedAt || article._updatedAt;
