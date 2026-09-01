import Link from "next/link";
import { FaPatreon } from "react-icons/fa6";

import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";

const SITE_MONTHLY_COST = 25;
const MONTHLY_VISITORS = "30K";

export const PatreonFunding = () => (
    <Link
        href={process.env.NEXT_PUBLIC_PATREON_URL || "#"}
        rel="noopener noreferrer nofollow"
        target="_blank"
        data-sa-click="patreon-banner"
        className={getCtaBannerClassName("white")}
    >
        <CtaBannerContent
            icon={
                <FaPatreon
                    className="m-auto h-5 w-5 text-white md:h-6 md:w-6"
                    aria-label="Patreon logo"
                />
            }
            title="Support aRPG Timeline on Patreon"
            description={`Hosting costs us $${SITE_MONTHLY_COST}/month. Join to keep it free for ${MONTHLY_VISITORS}+ gamers and help us grow.`}
            actionLabel="Support"
            color="white"
        />
    </Link>
);
