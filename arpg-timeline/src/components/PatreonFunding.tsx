import Image from "next/image";
import Link from "next/link";

import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";

const SITE_MONTHLY_COST = 25;
const MONTHLY_VISITORS = "30K";

export const PatreonFunding = () => (
    <Link
        href={process.env.NEXT_PUBLIC_PATREON_URL || "#"}
        rel="noopener noreferrer nofollow"
        target="_blank"
        data-sa-click="patreon-banner"
        className={getCtaBannerClassName("orange")}
    >
        <CtaBannerContent
            icon={
                <Image
                    loading="lazy"
                    src="/assets/third-party/patreon-logo.png"
                    className="m-auto h-6 w-6 opacity-70 md:h-7 md:w-7"
                    alt="Patreon logo"
                    width={32}
                    height={32}
                />
            }
            title="Keep aRPG Timeline Running"
            description={`The site costs $${SITE_MONTHLY_COST}/month. Your 3$ powers ${MONTHLY_VISITORS}+ gamers and keeps us growing.`}
            actionLabel="Support"
            color="orange"
        />
    </Link>
);
