"use client";
import { useState } from "react";

import { addUTMParameters } from "@/lib/utm";

import { Logo } from "./Logo";

const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_content: "steam_embed",
});

export const SteamEmbed = ({ appId }: { appId: number }) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className="relative min-h-[190px] w-full">
            {isLoading && (
                <div className="absolute inset-0 grid place-items-center">
                    <div className="font-heading flex flex-col items-center justify-center gap-1 text-sm">
                        <Logo className="animate-pulse" />
                        Loading...
                    </div>
                </div>
            )}
            <iframe
                src={addUTM(`https://store.steampowered.com/widget/${appId}`)}
                height="190"
                style={{ border: 0, overflow: "hidden", width: "100%" }}
                loading="lazy"
                onLoad={handleIframeLoad}
            />
        </div>
    );
};
