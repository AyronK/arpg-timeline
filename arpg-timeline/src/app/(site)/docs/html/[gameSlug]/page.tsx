import { HtmlEmbedManual } from "@/components/Manuals/HtmlEmbedManual";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";

const HtmlEmbedManualPage = async ({ params }: { params: Promise<{ gameSlug: string }> }) => {
    const { gameSlug } = await params;
    return (
        <div className="relative container mx-auto mt-4 mb-8 md:mt-8">
            <HtmlEmbedManual game={gameSlug} />
        </div>
    );
};

export default HtmlEmbedManualPage;

export async function generateStaticParams() {
    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 3600,
        tags: ["game", "season"],
    });

    return data.games.map((g) => ({
        gameSlug: g.slug,
    }));
}
