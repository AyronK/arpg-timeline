import { SeasonProjection } from "../types";
import { fetchDocumentAtRevision, getPreviousRevisionId } from "./history";
import { transformHistoryDocumentToProjection } from "./transform";

export type {
    DetectedChange,
    LiveStreamProjection,
    SeasonProjection,
    WebhookProjection,
} from "../types";

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
