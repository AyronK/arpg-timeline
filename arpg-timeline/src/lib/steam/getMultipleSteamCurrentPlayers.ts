export type SteamPlayersResult = {
    success: boolean;
    error?: string;
    currentPlayers: number;
    appId: number;
};

export async function getSteamCurrentPlayers(appId: number): Promise<SteamPlayersResult> {
    const url = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}&format=json`;

    try {
        const response = await fetch(url, { next: { revalidate: 60 } });
        const data = await response.json();

        if (data.response && data.response.result === 1) {
            return {
                success: true,
                currentPlayers: data.response.player_count,
                appId: appId,
            };
        } else {
            return {
                success: false,
                error: "Failed to fetch player count",
                currentPlayers: 0,
                appId: appId,
            };
        }
    } catch (error) {
        return {
            success: false,
            error: (error as Error)?.message,
            currentPlayers: 0,
            appId: appId,
        };
    }
}

export async function getMultipleSteamCurrentPlayers(
    appIds: number[],
): Promise<SteamPlayersResult[]> {
    const promises = appIds.map((appId) => getSteamCurrentPlayers(appId));
    const results = await Promise.allSettled(promises);

    return results.map((result, index) => {
        if (result.status === "fulfilled") {
            return result.value;
        } else {
            return {
                success: false,
                currentPlayers: 0,
                error: result.reason,
                appId: appIds[index],
            };
        }
    });
}
