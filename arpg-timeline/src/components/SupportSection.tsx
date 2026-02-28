import { DiscordServerBoost } from "./DiscordServerBoost";
import { PatreonFunding } from "./PatreonFunding";

export const SupportSection = () => {
    return (
        <section className="container mt-4 mb-4 flex flex-col gap-4 md:mt-16">
            <h3 className="font-heading text-lg md:text-xl">Support</h3>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 md:flex-row">
                    <PatreonFunding />
                    <DiscordServerBoost />
                    {/* Problem:
                        Referrals are intended to be private direct recommendations of the Services and any referral done through a public platform and/or website will not lead to any reward and may cause ineligibility for future referral benefits.
                        https://proton.me/pl/legal/terms 
                    */}
                    {/* <ProtonAffiliation /> */}
                </div>
            </div>
        </section>
    );
};
