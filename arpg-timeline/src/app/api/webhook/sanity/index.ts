import { SanityImageAssetDocument } from "next-sanity";

import { sanityFetch } from "@/lib/sanity/sanityClient";
import { SeasonEndDateInfo, SeasonStartDateInfo } from "@/queries/indexQuery";

export type SeasonProjection = {
    _id: string;
    _rev: string;
    _type: string;
    name: string;
    game: string;
    gameUrl: string;
    seasonUrl?: string | null;
    patchNotesUrl?: string | null;
    seasonKeyword: string;
    thumbnail: SanityImageAssetDocument;
    start?: SeasonStartDateInfo;
    end?: SeasonEndDateInfo;
    color: string;
};

export type LiveStreamProjection = {
    _id: string;
    _rev: string;
    _type: string;
    name: string;
    date: string;
    game: string;
    gameUrl: string;
    color: string;
    thumbnail: SanityImageAssetDocument;
    twitchUrl: string;
};

export type WebhookProjection = SeasonProjection | LiveStreamProjection;

type ChangeType = "added" | "date_changed" | "patch_notes_changed" | "name_changed";

export type DetectedChange<T = unknown> = {
    type: ChangeType;
    field?: string;
    oldValue?: T;
    newValue?: T;
    discordMessage: string;
};

const historyQuery = `*[_id == $id] | order(_rev desc) [0...10] {
    _id,
    _rev,
    _type,
    name,
    "game":game->name,
    "seasonKeyword": game->seasonKeyword,
    "thumbnail":game->logo,
    "color": game->logo.asset->metadata.palette.dominant.background,
    start,
    end,
    "gameUrl": game->url,
    "seasonUrl": url,
    "patchNotesUrl": patchNotesUrl,
}`;

export async function getPreviousRevision(
    documentId: string,
    currentRev: string,
): Promise<SeasonProjection | null> {
    try {
        const history = await sanityFetch({
            query: historyQuery,
            params: { id: documentId },
        });

        if (!history || history.length === 0) {
            return null;
        }

        const currentIndex = history.findIndex((doc: SeasonProjection) => doc._rev === currentRev);

        if (currentIndex === -1) {
            return null;
        }

        if (currentIndex === history.length - 1) {
            return null;
        }

        return history[currentIndex + 1];
    } catch (error) {
        console.error("Error fetching previous revision:", error);
        return null;
    }
}
