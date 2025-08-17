import { ObsBrowserSourceManual } from "@/components/Manuals/ObsBrowserSourceManual";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { indexQuery, IndexQueryResult } from "@/queries/indexQuery";

const ObsBrowserSourceManualPage = async ({
    params,
}: {
    params: Promise<{ gameSlug: string }>;
}) => {
    const { gameSlug } = await params;
    return (
        <div className="relative container mx-auto mb-8 md:mt-8">
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

export const revalidate = 43200;
export const dynamic = "force-static";
