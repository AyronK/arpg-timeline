import { createClient, QueryParams } from "next-sanity";

export const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_STUDIO_READ_TOKEN,
    apiVersion: "2025-06-08",
    useCdn: true,
});

export async function sanityFetch<const QueryString extends string>({
    query,
    params = {},
    revalidate = 60,
    tags = [],
}: {
    query: QueryString;
    params?: QueryParams;
    revalidate?: number | false;
    tags?: string[];
}) {
    return sanityClient.fetch(query, params, {
        next: {
            revalidate: tags.length ? false : revalidate,
            tags,
        },
    });
}
