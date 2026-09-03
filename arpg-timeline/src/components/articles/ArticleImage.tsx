import Image from "next/image";

import type { ArticleImage as ArticleImageData } from "@/lib/cms/queries/articleQuery";
import { cn } from "@/lib/utils";

interface ArticleImageProps {
    image: ArticleImageData;
    priority?: boolean;
    className?: string;
    sizes?: string;
    quality?: number;
}

const DEFAULT_SIZES = "(min-width: 880px) 830px, 100vw";

// Explicit dimensions from the asset prevent layout shift.
export const ArticleImage = ({
    image,
    priority,
    className,
    sizes,
    quality = 90,
}: ArticleImageProps) => {
    const asset = image?.asset;
    if (!asset?.url) return null;

    const width = asset.dimensions?.width ?? 1600;
    const height = asset.dimensions?.height ?? 900;

    const img = (
        <Image
            src={asset.url}
            alt={image.alt ?? ""}
            width={width}
            height={height}
            sizes={sizes ?? DEFAULT_SIZES}
            quality={quality}
            placeholder={asset.lqip ? "blur" : "empty"}
            blurDataURL={asset.lqip}
            priority={priority}
            className="h-auto w-full rounded-lg"
        />
    );

    if (!image.caption && !image.credit) {
        return <div className={cn("my-6", className)}>{img}</div>;
    }

    return (
        <figure className={cn("my-6", className)}>
            {img}
            <figcaption className="text-muted-foreground mt-2 text-center text-sm text-balance">
                {image.caption}
                {image.credit && (
                    <span className="text-xs opacity-80">
                        {image.caption ? " (" : null}
                        Image credit:{" "}
                        {image.creditUrl ? (
                            <a
                                href={image.creditUrl}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                className="underline underline-offset-2 transition-all hover:brightness-125"
                            >
                                {image.credit}
                            </a>
                        ) : (
                            image.credit
                        )}
                        {image.caption ? ")" : null}
                    </span>
                )}
            </figcaption>
        </figure>
    );
};
