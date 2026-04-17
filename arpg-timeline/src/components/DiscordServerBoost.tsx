import Image from "next/image";
import Link from "next/link";

import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";

export const DiscordServerBoost = () => (
    <Link
        href={process.env.NEXT_PUBLIC_DISCORD_URL || "#"}
        rel="noopener noreferrer nofollow"
        target="_blank"
        data-sa-click="discord-boost-banner"
        className={getCtaBannerClassName("indigo")}
    >
        <CtaBannerContent
            icon={
                <Image
                    loading="lazy"
                    src="/assets/third-party/discord-logo.svg"
                    className="m-auto h-6 w-6 opacity-70 md:h-7 md:w-7"
                    alt="Discord logo"
                    width={32}
                    height={32}
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
        rel="noopener noreferrer nofollow"
        target="_blank"
        data-sa-click="discord-boost-banner"
        className={getCtaBannerClassName("indigo")}
    >
        <CtaBannerContent
            icon={
                <Image
                    loading="lazy"
                    src="/assets/third-party/discord-logo.svg"
                    className="m-auto h-6 w-6 opacity-70 md:h-7 md:w-7"
                    alt="Discord logo"
                    width={32}
                    height={32}
                />
            }
            title="Contact us on Discord"
            description="Contact us on Discord for any questions or feedback!"
            actionLabel="Join Discord"
            color="indigo"
        />
    </Link>
);
