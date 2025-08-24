"use client";
import { useEffect, useState } from "react";

import { addUTMParameters } from "@/lib/utm";

import { Logo } from "./Logo";

const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_content: "steamdb_embed",
});

export const SteamDBEmbed = ({ appId }: { appId: number }) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="relative min-h-[389px] w-full">
            {isLoading && (
                <div className="absolute inset-0 grid place-items-center">
                    <div className="font-heading flex flex-col items-center justify-center gap-1 text-sm">
                        <Logo className="animate-pulse" />
                        Loading...
                    </div>
                </div>
            )}
            <iframe
                src={addUTM(`https://steamdb.info/embed/?appid=${appId}`)}
                height="389"
                style={{ border: 0, overflow: "hidden", width: "100%" }}
                loading="lazy"
                onLoad={handleIframeLoad}
            />
        </div>
    );
};
