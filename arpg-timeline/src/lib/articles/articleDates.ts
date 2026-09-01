interface HasModified {
    updatedAt?: string | null;
    _updatedAt: string;
}

export const getArticleModified = (article: HasModified): string =>
    article.updatedAt || article._updatedAt;
