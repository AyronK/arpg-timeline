import { getSanityConfig, SANITY_API_VERSION } from "./constants";

export async function fetchDocumentAtRevision(
    documentId: string,
    revisionId: string,
): Promise<Record<string, unknown> | null> {
    const { projectId, dataset, token } = getSanityConfig();

    const encodedDocumentId = encodeURIComponent(documentId);
    const url = `https://${projectId}.api.sanity.io/v${SANITY_API_VERSION}/data/history/${dataset}/documents/${encodedDocumentId}?revision=${encodeURIComponent(revisionId)}`;

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

export async function getPreviousRevisionId(
    documentId: string,
    currentRev: string,
    updatedAt?: string,
): Promise<string | null> {
    const { projectId, dataset, token } = getSanityConfig();

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

    const url = `https://${projectId}.api.sanity.io/v${SANITY_API_VERSION}/data/history/${dataset}/documents/${encodedDocumentId}?time=${encodeURIComponent(timeParam)}`;

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

