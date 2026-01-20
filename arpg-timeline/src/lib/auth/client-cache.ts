import { unstable_cache } from "next/cache";

import { createClient } from "@/utils/supabase/client";

import { Scope } from "./scopes";

type ApiClient = {
    client_id: string;
    client_name: string;
    user_id: string;
    is_active: boolean;
    scopes: Scope[];
};

async function fetchClientFromDatabase(
    clientName: string,
    clientSecret: string,
): Promise<ApiClient | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("api_clients")
        .select("client_id, client_name, user_id, is_active, scopes")
        .eq("client_name", clientName)
        .eq("client_secret", clientSecret)
        .single();

    if (error || !data) {
        return null;
    }

    return data as ApiClient;
}

export async function getCachedClient(
    clientName: string,
    clientSecret: string,
): Promise<ApiClient | null> {
    const cachedClient = unstable_cache(
        async () => {
            const result = await fetchClientFromDatabase(clientName, clientSecret);

            if (result === null) {
                throw new Error("Client not found");
            }

            return result;
        },
        [`api-client-${clientName}`],
        {
            revalidate: 30 * 24 * 60 * 60,
            tags: [`api-client-${clientName}`],
        },
    );

    try {
        return await cachedClient();
    } catch {
        return null;
    }
}
