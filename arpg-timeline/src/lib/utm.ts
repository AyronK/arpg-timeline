export interface UTMParameters {
    utm_source: "arpg-timeline" | "obs" | "discord";
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
}

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
