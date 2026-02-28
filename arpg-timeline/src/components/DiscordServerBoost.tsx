import Image from "next/image";
import Link from "next/link";

import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";

export const DiscordServerBoost = () => (
    <Link
        href={process.env.NEXT_PUBLIC_DISCORD_URL || "#"}
        rel="noopener noreferrer"
        target="_blank"
        data-sa-click="discord-boost-banner"
        className={getCtaBannerClassName("indigo")}
    >
        <CtaBannerContent
            icon={
                <Image
                    loading="lazy"
                    src="/assets/discord-logo.svg"
                    className="m-auto h-5 w-5 opacity-90 md:h-6 md:w-6"
                    alt="Discord logo"
                    width={24}
                    height={24}
                />
            }
            title="Boost our Discord server"
            description="Support the community with a Server Boost!"
            actionLabel="Join Discord"
            color="indigo"
        />
    </Link>
);

export const DiscordContactBanner = () => (
    <Link
        href={process.env.NEXT_PUBLIC_DISCORD_URL || "#"}
        rel="noopener noreferrer"
        target="_blank"
        data-sa-click="discord-boost-banner"
        className={getCtaBannerClassName("indigo")}
    >
        <CtaBannerContent
            icon={
                <Image
                    loading="lazy"
                    src="/assets/discord-logo.svg"
                    className="m-auto h-5 w-5 opacity-90 md:h-6 md:w-6"
                    alt="Discord logo"
                    width={24}
                    height={24}
                />
            }
            title="Contact us on Discord"
            description="Contact us on Discord for any questions or feedback!"
            actionLabel="Join Discord"
            color="indigo"
        />
    </Link>
);
