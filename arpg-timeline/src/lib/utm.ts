export interface UTMParameters {
    utm_source: "arpg-timeline" | "obs" | "discord";
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
}

// Outbound links from game pages, tagged by campaign and game
export const addGameLinkUTM = (campaign: string, gameSlug: string) =>
    addUTMParameters({
        utm_source: "arpg-timeline",
        utm_medium: "link",
        utm_campaign: campaign,
        utm_content: gameSlug,
    });

/**
 * Decorator function that adds UTM parameters to a URL
 * @param utmParams - Object containing UTM parameters to add
 * @returns Function that takes a URL string and returns it with UTM parameters added
 */
export function addUTMParameters(utmParams: UTMParameters) {
    return function (url: string): string {
        try {
            const urlObj = new URL(url);

            Object.entries(utmParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    urlObj.searchParams.set(key, value);
                }
            });

            return urlObj.toString();
        } catch {
            return url;
        }
    };
}
