export const SANITY_API_VERSION = "2025-06-08";

export function getSanityConfig() {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const token = process.env.SANITY_STUDIO_READ_TOKEN;

    if (!projectId || !dataset || !token) {
        throw new Error("Missing required Sanity configuration");
    }

    return { projectId, dataset, token };
}
