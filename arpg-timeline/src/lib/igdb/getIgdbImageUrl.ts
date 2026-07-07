type IgdbImageSize = "t_thumb" | "t_cover_small" | "t_cover_big";

export const getIgdbImageUrl = (imageId: string, size: IgdbImageSize): string =>
    `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`;
