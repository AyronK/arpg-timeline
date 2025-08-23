import { ObsBrowserSourceManual } from "@/components/Manuals/ObsBrowserSourceManual";
import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";

const ObsBrowserSourceManualPage = async ({
    params,
}: {
    params: Promise<{ gameSlug: string }>;
}) => {
    const { gameSlug } = await params;
    return (
        <div className="relative container mx-auto mt-4 mb-8 md:mt-8">
            <ObsBrowserSourceManual game={gameSlug} />
        </div>
    );
};

export default ObsBrowserSourceManualPage;

export async function generateStaticParams() {
    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
    });

    return data.games.map((g) => ({
        gameSlug: g.slug,
    }));
}
