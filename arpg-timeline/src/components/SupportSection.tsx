import { DiscordContactBanner, DiscordServerBoost } from "./DiscordServerBoost";
import { PatreonFunding } from "./PatreonFunding";
import { ProtonAffiliation } from "./ProtonAffiliation";

export const SupportSection = () => {
    return (
        <section className="container mt-4 mb-4 flex flex-col gap-4 md:mt-16">
            <h3 className="font-heading text-lg md:text-xl">Support</h3>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 md:flex-row">
                    <PatreonFunding />
                    <ProtonAffiliation />
                </div>
                <div className="flex flex-col gap-4 md:flex-row">
                    <DiscordServerBoost />
                    <DiscordContactBanner />
                </div>
            </div>
        </section>
    );
};
