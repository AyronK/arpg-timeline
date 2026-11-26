"use client";

import Image from "next/image";

import { ClickToLoad, useLoadedByClick, YOUTUBE_PROVIDER } from "@/components/ClickToLoad";
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from "@/lib/articles/youtube";

const YouTubeIframe = ({ id }: { id: string }) => {
    const autoplay = useLoadedByClick();
    return (
        <iframe
            src={autoplay ? `${getYouTubeEmbedUrl(id)}?autoplay=1` : getYouTubeEmbedUrl(id)}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="h-full w-full border-0"
        />
    );
};

export const YouTubeEmbed = ({ id }: { id: string }) => (
    <div className="my-6 aspect-video w-full overflow-hidden rounded-lg">
        <ClickToLoad
            providers={[YOUTUBE_PROVIDER]}
            actionLabel="Load video"
            className="h-full"
            poster={
                <Image
                    src={getYouTubeThumbnailUrl(id)}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                />
            }
        >
            <YouTubeIframe id={id} />
        </ClickToLoad>
    </div>
);
