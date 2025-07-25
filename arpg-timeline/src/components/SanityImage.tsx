import createImageUrlBuilder from "@sanity/image-url";
import { ImageProps } from "next/image";
import Image from "next/image";
import { SanityImageAssetDocument } from "next-sanity";

import { dataset, projectId } from "@/lib/sanity.api";

const imageBuilder = createImageUrlBuilder({
    projectId: projectId || "",
    dataset: dataset || "",
});

export const urlForImage = (source: SanityImageAssetDocument) => {
    if (!source?.asset?._ref) {
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

    const imageUrl = src.url ?? urlForImage(src)?.url();
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
