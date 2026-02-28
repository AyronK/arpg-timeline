import { DiscordContactBanner, DiscordServerBoost } from "./DiscordServerBoost";
import { PatreonFunding } from "./PatreonFunding";
import { ProtonCalendarAffiliation } from "./ProtonCalendarAffiliation";

export const SupportSection = () => {
    return (
        <section className="container mt-4 mb-4 flex flex-col gap-4 md:mt-16">
            <h3 className="font-heading text-lg md:text-xl">Support</h3>

            <div className="flex flex-col-reverse gap-4 md:flex-col">
                <div className="flex flex-col gap-4 md:flex-row">
                    <PatreonFunding />
                    <ProtonCalendarAffiliation />
                </div>
                <div className="flex flex-col gap-4 md:flex-row">
                    <DiscordServerBoost />
                    <DiscordContactBanner />
                </div>
            </div>
        </section>
    );
};
