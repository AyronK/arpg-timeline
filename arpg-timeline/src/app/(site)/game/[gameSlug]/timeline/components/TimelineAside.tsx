import { BuyMeACoffeeCompact } from "@/components/articles/BuyMeACoffeeCompact";
import { FollowShare } from "@/components/articles/FollowShare";
import { PatreonFundingCompact } from "@/components/articles/PatreonFundingCompact";
import { RelatedArticles } from "@/components/articles/RelatedArticles";
import type { ArticleListItem } from "@/lib/cms/queries/articleQuery";

export const TimelineAside = ({
    related,
    shareTitle,
}: {
    related: ArticleListItem[];
    shareTitle: string;
}) => (
    <div className="space-y-8">
        <RelatedArticles articles={related} />
        <div className="space-y-2">
            <PatreonFundingCompact />
            <BuyMeACoffeeCompact />
        </div>
        <FollowShare title={shareTitle} subject="page" />
    </div>
);
