import { Suspense } from "react";

import { indexQuery, IndexQueryResult } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";

import ClientOnlyVisibleWrapper from "./ClientOnlyVisibleWrapper";
import { CarouselFallback, TopCarousel } from "./TopCarousel";

const CarouselData = async () => {
    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 24 * 60 * 60,
        tags: ["liveStreamTwitch", "game"],
    });

    return (
        <ClientOnlyVisibleWrapper>
            <TopCarousel games={data.games} />
        </ClientOnlyVisibleWrapper>
    );
};

export const LayoutCarousel = () => {
    return (
        <div className="mt-2 flex flex-col">
            <Suspense fallback={<CarouselFallback />}>
                <CarouselData />
            </Suspense>
        </div>
    );
};
