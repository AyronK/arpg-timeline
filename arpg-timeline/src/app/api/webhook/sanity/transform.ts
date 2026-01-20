import { SanityImageAssetDocument } from "next-sanity";

import { SeasonEndDateInfo, SeasonStartDateInfo } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";

import { SeasonProjection } from "../types";

const GAME_QUERY = `*[_id == $gameId] {
    name,
    seasonKeyword,
    "url": url,
    "logo": logo.asset->{
        _id,
        url,
        metadata
    }
}[0]`;

type GameData = {
    name?: string;
    seasonKeyword?: string;
    url?: string;
    logo?: {
        _id: string;
        url: string;
        metadata?: {
            palette?: {
                dominant?: {
                    background?: string;
                };
            };
        };
    };
};

export async function transformHistoryDocumentToProjection(
    doc: Record<string, unknown>,
): Promise<SeasonProjection | null> {
    if (!doc || typeof doc._id !== "string" || typeof doc._rev !== "string") {
        return null;
    }

    try {
        const gameRefObj = doc.game as { _ref?: string; _id?: string } | undefined;
        const gameRef = gameRefObj?._ref || gameRefObj?._id;
        if (!gameRef) {
            return null;
        }

        const gameData = (await sanityFetch({
            query: GAME_QUERY,
            revalidate: 3600,
            tags: ["game"],
            params: { gameId: gameRef },
        })) as GameData | null;

        if (!gameData) {
            return null;
        }

        const logoAsset = gameData.logo;
        const color = logoAsset?.metadata?.palette?.dominant?.background || "#000000";

        return {
            _id: doc._id as string,
            _rev: doc._rev as string,
            _type: (doc._type as string) || "",
            name: (doc.name as string) || "",
            game: gameData.name || "",
            gameUrl: gameData.url || "",
            seasonUrl: (doc.url as string | null) || null,
            patchNotesUrl: (doc.patchNotesUrl as string | null) || null,
            seasonKeyword: gameData.seasonKeyword || "",
            thumbnail: logoAsset as SanityImageAssetDocument,
            start: doc.start as SeasonStartDateInfo | undefined,
            end: doc.end as SeasonEndDateInfo | undefined,
            color,
        } as SeasonProjection;
    } catch (error) {
        console.error("Error transforming history document:", error);
        return null;
    }
}
