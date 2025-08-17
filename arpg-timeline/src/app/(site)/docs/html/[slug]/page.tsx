import { HtmlEmbedManual } from "@/components/Manuals/HtmlEmbedManual";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { indexQuery, IndexQueryResult } from "@/queries/indexQuery";

const HtmlEmbedManualPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    return (
        <div className="relative container mx-auto mb-8 md:mt-8">
            <HtmlEmbedManual game={slug} />
        </div>
    );
};

export default HtmlEmbedManualPage;

export async function generateStaticParams() {
    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
    });

    return data.games.map((g) => ({
        gameSlug: g.slug,
    }));
}

export const revalidate = 43200;
export const dynamic = "force-static";
