import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";

/** Same-game items first, topped up with same-category, deduped by `_id`, capped at `limit`. */
export const pickRelated = (
    sameGame: ArticleListItem[],
    sameCategory: ArticleListItem[],
    limit = 5,
): ArticleListItem[] => {
    const seen = new Set<string>();
    const out: ArticleListItem[] = [];

    for (const article of [...sameGame, ...sameCategory]) {
        if (seen.has(article._id)) continue;
        seen.add(article._id);
        out.push(article);
        if (out.length === limit) break;
    }

    return out;
};
