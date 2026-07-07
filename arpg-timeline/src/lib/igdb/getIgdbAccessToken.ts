interface CachedToken {
    accessToken: string;
    expiresAt: number;
}

// In-memory only - best effort. Resets on cold start and isn't shared across
// serverless instances, but Twitch client-credentials tokens are valid for
// ~60 days so this still avoids re-authenticating on most requests.
let cachedToken: CachedToken | null = null;

export async function getIgdbAccessToken(): Promise<string | null> {
    if (cachedToken && cachedToken.expiresAt > Date.now()) {
        return cachedToken.accessToken;
    }

    const clientId = process.env.IGDB_CLIENT_ID;
    const clientSecret = process.env.IGDB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error("IGDB_CLIENT_ID / IGDB_CLIENT_SECRET are not configured");
        return null;
    }

    try {
        const params = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "client_credentials",
        });

        const response = await fetch(`https://id.twitch.tv/oauth2/token?${params.toString()}`, {
            method: "POST",
        });

        if (!response.ok) {
            console.error(`Failed to fetch IGDB access token: ${response.status}`);
            return null;
        }

        const data: { access_token: string; expires_in: number } = await response.json();

        cachedToken = {
            accessToken: data.access_token,
            expiresAt: Date.now() + (data.expires_in - 60) * 1000,
        };

        return cachedToken.accessToken;
    } catch (error) {
        console.error("Error fetching IGDB access token:", error);
        return null;
    }
}
