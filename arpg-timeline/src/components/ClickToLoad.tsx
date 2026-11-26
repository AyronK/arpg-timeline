"use client";

import {
    createContext,
    Fragment,
    ReactNode,
    useContext,
    useId,
    useState,
    useSyncExternalStore,
} from "react";

import {
    getEmbedConsent,
    setEmbedConsent,
    subscribeToEmbedConsent,
} from "@/lib/storage/embedConsentStorage";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { Checkbox } from "@/ui/Checkbox";

export type ThirdPartyProvider = {
    id: string;
    name: string;
    privacyUrl: string;
};

export const STEAM_PROVIDER: ThirdPartyProvider = {
    id: "steam",
    name: "Steam",
    privacyUrl: "https://store.steampowered.com/privacy_agreement/",
};

export const STEAMDB_PROVIDER: ThirdPartyProvider = {
    id: "steamdb",
    name: "SteamDB",
    privacyUrl: "https://steamdb.info/privacy/",
};

export const YOUTUBE_PROVIDER: ThirdPartyProvider = {
    id: "youtube",
    name: "YouTube",
    privacyUrl: "https://policies.google.com/privacy",
};

export const EMBED_PROVIDERS = [STEAM_PROVIDER, STEAMDB_PROVIDER, YOUTUBE_PROVIDER];

const LoadedByClickContext = createContext(false);

export const useLoadedByClick = () => useContext(LoadedByClickContext);

export const useEmbedConsent = (providerId: string): boolean =>
    useSyncExternalStore(
        subscribeToEmbedConsent,
        () => getEmbedConsent(providerId),
        () => false,
    );

export const ClickToLoad = ({
    providers,
    actionLabel,
    poster,
    className,
    children,
}: {
    providers: ThirdPartyProvider[];
    actionLabel: string;
    poster?: ReactNode;
    className?: string;
    children: ReactNode;
}) => {
    const rememberId = useId();
    const [clicked, setClicked] = useState(false);
    const [remember, setRemember] = useState(false);
    const allRemembered = useSyncExternalStore<boolean | null>(
        subscribeToEmbedConsent,
        () => providers.every((p) => getEmbedConsent(p.id)),
        () => null,
    );

    if (clicked || allRemembered) {
        return (
            <LoadedByClickContext.Provider value={clicked}>
                {children}
            </LoadedByClickContext.Provider>
        );
    }

    const frameClassName = cn(
        "bg-muted/40 relative flex w-full items-center justify-center overflow-hidden rounded-lg border",
        className,
    );

    if (allRemembered === null) return <div className={frameClassName} />;

    const names = providers.map((p) => p.name).join(" and ");

    const load = () => {
        setClicked(true);
        if (remember) providers.forEach((p) => setEmbedConsent(p.id, true));
    };

    return (
        <div className={frameClassName}>
            {poster && <div className="absolute inset-0 opacity-40">{poster}</div>}
            <div className="bg-background/80 relative m-4 flex max-w-sm flex-col items-center gap-3 rounded-lg p-4 text-center backdrop-blur-sm">
                <Button type="button" size="sm" onClick={load}>
                    {actionLabel}
                </Button>
                <div className="flex items-center gap-3">
                    <Checkbox
                        id={rememberId}
                        checked={remember}
                        onCheckedChange={(checked) => setRemember(checked === true)}
                    />
                    <label
                        htmlFor={rememberId}
                        className="cursor-pointer text-sm leading-none select-none"
                    >
                        Remember my choice
                    </label>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                    Loads content from {names}, which may set cookies and receive your IP address.
                </p>
                <p className="text-muted-foreground text-xs">
                    {providers.map((p, i) => (
                        <Fragment key={p.id}>
                            {i > 0 && " · "}
                            <a
                                href={p.privacyUrl}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="underline hover:opacity-80"
                            >
                                {p.name} privacy policy
                            </a>
                        </Fragment>
                    ))}
                </p>
            </div>
        </div>
    );
};
