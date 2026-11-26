"use client";

import { EMBED_PROVIDERS, ThirdPartyProvider, useEmbedConsent } from "@/components/ClickToLoad";
import { setEmbedConsent } from "@/lib/storage/embedConsentStorage";
import { Switch } from "@/ui/Switch";

const ProviderRow = ({ provider }: { provider: ThirdPartyProvider }) => {
    const allowed = useEmbedConsent(provider.id);
    return (
        <li>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Switch
                    checked={allowed}
                    onCheckedChange={(checked) => setEmbedConsent(provider.id, checked)}
                />
                Always load content from {provider.name}
            </label>
        </li>
    );
};

export const EmbedConsentSettings = () => (
    <ul className="space-y-3">
        {EMBED_PROVIDERS.map((provider) => (
            <ProviderRow key={provider.id} provider={provider} />
        ))}
    </ul>
);
