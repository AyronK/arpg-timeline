import { SanityImageAssetDocument } from "next-sanity";

import { SeasonEndDateInfo, SeasonStartDateInfo } from "@/lib/cms/queries/indexQuery";
import { sanityFetch } from "@/lib/sanity/sanityClient";

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

async function fetchDocumentAtRevision(
    documentId: string,
    revisionId: string,
): Promise<Record<string, unknown> | null> {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const token = process.env.SANITY_STUDIO_READ_TOKEN;
    const apiVersion = "2025-06-08";

    if (!projectId || !dataset || !token) {
        throw new Error("Missing required Sanity configuration");
    }

    const encodedDocumentId = encodeURIComponent(documentId);
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/history/${dataset}/documents/${encodedDocumentId}?revision=${encodeURIComponent(revisionId)}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to fetch document at revision: ${response.status} ${response.statusText} - ${errorText}`,
            );
        }

        const data = await response.json();
        if (data.documents && Array.isArray(data.documents) && data.documents.length > 0) {
            return data.documents[0];
        }
        return null;
    } catch (error) {
        console.error("Error fetching document at revision:", error);
        return null;
    }
}

async function getPreviousRevisionId(
    documentId: string,
    currentRev: string,
    updatedAt?: string,
): Promise<string | null> {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const token = process.env.SANITY_STUDIO_READ_TOKEN;
    const apiVersion = "2025-06-08";

    if (!projectId || !dataset || !token) {
        throw new Error("Missing required Sanity configuration");
    }

    const encodedDocumentId = encodeURIComponent(documentId);

    let timeParam: string;
    if (updatedAt) {
        const updateDate = new Date(updatedAt);
        const oneSecondBefore = new Date(updateDate.getTime() - 1000);
        timeParam = oneSecondBefore.toISOString();
    } else {
        const now = new Date();
        const minuteAgo = new Date(now.getTime() - 60000);
        timeParam = minuteAgo.toISOString();
    }

    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/history/${dataset}/documents/${encodedDocumentId}?time=${encodeURIComponent(timeParam)}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to fetch previous revision: ${response.status} ${response.statusText} - ${errorText}`,
            );
        }

        const data = await response.json();

        const previousRev = data.documents?.[0]?._rev;
        if (!previousRev || previousRev === currentRev) {
            return null;
        }
        return previousRev;
    } catch (error) {
        console.error("Error fetching previous revision ID:", error);
        return null;
    }
}

async function transformHistoryDocumentToProjection(
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

        const gameQuery = `*[_id == $gameId] {
            name,
            seasonKeyword,
            "url": url,
            "logo": logo.asset->{
                _id,
                url,
                metadata
            }
        }[0]`;

        const gameData = (await sanityFetch({
            query: gameQuery,
            revalidate: 3600,
            tags: ["game"],
            params: { gameId: gameRef },
        })) as {
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
        } | null;

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

export async function getPreviousRevision(
    documentId: string,
    currentRev: string,
    updatedAt?: string,
): Promise<SeasonProjection | null> {
    try {
        const previousRev = await getPreviousRevisionId(documentId, currentRev, updatedAt);

        if (!previousRev) {
            return null;
        }

        const previousDoc = await fetchDocumentAtRevision(documentId, previousRev);

        if (!previousDoc) {
            return null;
        }

        return await transformHistoryDocumentToProjection(previousDoc);
    } catch (error) {
        console.error("Error fetching previous revision:", error);
        return null;
    }
}
