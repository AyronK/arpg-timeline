import { createImageUrlBuilder } from "@sanity/image-url";
import { ImageProps } from "next/image";
import Image from "next/image";
import { SanityImageAssetDocument } from "next-sanity";

import { dataset, projectId } from "@/lib/sanity.api";

const imageBuilder = createImageUrlBuilder({
    projectId: projectId || "",
    dataset: dataset || "",
});

// images.imageSizes + images.deviceSizes from next.config.ts.
const NEXT_IMAGE_SIZES = [32, 64, 128, 256, 640, 1080];
const MAX_WIDTH = NEXT_IMAGE_SIZES[NEXT_IMAGE_SIZES.length - 1];

// Largest variant Next's optimizer can request for a fixed-size image (2x DPR).
const upstreamWidth = (renderWidth: number | undefined) =>
    renderWidth
        ? (NEXT_IMAGE_SIZES.find((size) => size >= renderWidth * 2) ?? MAX_WIDTH)
        : MAX_WIDTH;

export const urlForImage = (source: SanityImageAssetDocument) => {
    if (!source?.asset?._ref && !source?._id && !source?.url) {
        return undefined;
    }

    return imageBuilder?.image(source).auto("format");
};

export const SanityImage = ({
    src,
    quality = 75,
    objectFit = "cover",
    ...remaining
}: Omit<ImageProps, "src"> & { src: SanityImageAssetDocument } & {
    objectFit: "cover" | "contain";
}) => {
    if (!src) {
        return null;
    }

    const imageUrl = urlForImage(src)
        ?.width(upstreamWidth(typeof remaining.width === "number" ? remaining.width : undefined))
        .fit("max")
        .format("webp")
        .quality(Number(quality))
        .url();
    const imageLqip = src.metadata?.lqip;

    if (!imageUrl) {
        return null;
    }

    return (
        <Image
            {...remaining}
            alt={remaining.alt}
            blurDataURL={imageLqip}
            placeholder={imageLqip ? "blur" : "empty"}
            src={imageUrl}
            style={{
                width: "100%",
                height: "100%",
                objectFit: objectFit,
                objectPosition: "center",
            }}
            quality={quality}
        />
    );
};
