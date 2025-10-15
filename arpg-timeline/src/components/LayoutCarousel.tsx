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
            <TopCarousel
                games={data.games}
                twitchChannels={data.twitchChannels}
                streams={
                    data.liveStreamsOnTwitch?.filter(
                        (s) =>
                            s.date && new Date(s.date).getTime() > Date.now() - 2 * 60 * 60 * 1000,
                    ) ?? []
                }
            />
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
