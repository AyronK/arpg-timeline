import { addUTMParameters, UTMParameters } from "@/lib/utm";

type ShareActionParams = {
    title?: string;
    text?: string;
    url?: string;
};

export const useShareAction = (
    defaultParams?: ShareActionParams | null,
    utmParams?: UTMParameters,
) => {
    const addUTM = utmParams ? addUTMParameters(utmParams) : undefined;

    const handleShare = async (params?: ShareActionParams) => {
        const finalParams = {
            title: params?.title ?? defaultParams?.title ?? "aRPG Timeline",
            text: params?.text ?? defaultParams?.text ?? "Check out aRPG timeline",
            url: params?.url ?? defaultParams?.url ?? window.location.href,
        };

        const finalUrl = addUTM ? addUTM(finalParams.url) : finalParams.url;

        if (navigator.share) {
            try {
                await navigator.share({
                    ...finalParams,
                    url: finalUrl,
                });
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    console.error("Error sharing:", error);
                }
            }
        } else {
            navigator.clipboard.writeText(finalUrl);
        }
    };

    return { handleShare };
};
