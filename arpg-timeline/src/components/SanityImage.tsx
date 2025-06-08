import createImageUrlBuilder from "@sanity/image-url";
import { ImageProps } from "next/image";
import Image from "next/image";

import { dataset, projectId } from "@/lib/sanity.api";

type ImageType = {
    url: string | undefined;
    alternativeText?: string | undefined;
};
type SanityImageBlock = SanityBase<{
    _type?: "imageBlock";
    alternativeText?: string;
    asset?: SanityImageBlockAsset;
    lqip?: string;
}>;
type SanityImageBlockAsset = {
    _ref: string;
    _type: "reference";
};
type SanityBase<T = unknown> = T & {
    _key?: string | undefined;
    _type?: string | undefined;
};

const imageBuilder = createImageUrlBuilder({
    projectId: projectId || "",
    dataset: dataset || "",
});

export const urlForImage = (source: Image) => {
    // Ensure that source image contains a valid reference
    if (!source?.asset?._ref) {
        return undefined;
    }

    return imageBuilder?.image(source).auto("format");
};

export const SanityImage = ({
    src,
    objectFit = "cover",
    ...remaining
}: ImageProps & { objectFit: "cover" | "contain" }) => {
    const imageUrl = (src as ImageType)?.url ?? urlForImage(src as SanityImageBlock)?.url();

    const altText =
        (src as SanityImageBlock)?.alternativeText ?? (src as ImageType)?.alternativeText;

    const imageLqip = (src as SanityImageBlock)?.lqip;

    if (!imageUrl) {
        return null;
    }

    return (
        <Image
            {...remaining}
            alt={altText}
            blurDataURL={imageLqip}
            placeholder={imageLqip ? "blur" : "empty"}
            src={imageUrl}
            style={{
                width: "100%",
                height: "100%",
                objectFit: objectFit,
                objectPosition: "center",
            }}
            quality={75}
        />
    );
};
