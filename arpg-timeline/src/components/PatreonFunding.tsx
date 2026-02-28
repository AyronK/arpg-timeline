import Image from "next/image";
import Link from "next/link";

import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";

export const PatreonFunding = () => (
    <Link
        href={process.env.NEXT_PUBLIC_PATREON_URL || "#"}
        rel="noopener"
        target="_blank"
        data-sa-click="patreon-banner"
        className={getCtaBannerClassName("orange")}
    >
        <CtaBannerContent
            icon={
                <Image
                    loading="lazy"
                    src="/assets/patreon-logo.png"
                    className="m-auto h-5 w-5 opacity-70 md:h-6 md:w-6"
                    alt="Patreon logo"
                    width={24}
                    height={24}
                />
            }
            title="Support aRPG Timeline"
            description="Help us grow and keep the site private and ad-free!"
            actionLabel="Support"
            color="orange"
        />
    </Link>
);
