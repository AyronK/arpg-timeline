import { notFound } from "next/navigation";

import { Games } from "@/components/Home/Games";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { indexQuery, IndexQueryResult } from "@/queries/indexQuery";

const Home = async ({ params }: { params: Promise<{ gameSlug: string }> }) => {
    const { gameSlug } = await params;
    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "liveStreamTwitch", "game", "toast"],
    });
    const game = parseGamesFromSanity(data).find((g) => g.slug === gameSlug);

    if (!game) {
        return notFound();
    }

    // TODO: replace with dedicated embed widget
    // 1. No interactive buttons
    // 2. Link to arpg-timeline
    // 3. Embed-targeted tracking
    // 4. "Like this widget? CTA website/support
    // 5. Add cache headers and generate static params
    return <Games games={[game]} />;
};

export const revalidate = 900;

export default Home;
