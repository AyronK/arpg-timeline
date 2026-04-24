import Image from "next/image";
import Link from "next/link";

import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";

const SITE_MONTHLY_COST = 25;
const MONTHLY_VISITORS = "30K";

export const BuyMeACoffee = () => {
    if (!process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL) return null;

    return (
        <Link
            href={process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL}
            rel="noopener noreferrer nofollow"
            target="_blank"
            data-sa-click="bmc-banner"
            className={getCtaBannerClassName("amber")}
        >
            <CtaBannerContent
                icon={
                    <Image
                        loading="lazy"
                        src="/assets/third-party/bmc-logo.svg"
                        className="m-auto h-6 w-6 opacity-70 md:h-7 md:w-7"
                        alt="Buy Me a Coffee logo"
                        width={32}
                        height={32}
                    />
                }
                title="Buy Me a Coffee"
                description={`Hosting costs us $${SITE_MONTHLY_COST}/month. Your tips keep it free for ${MONTHLY_VISITORS}+ gamers and help us grow.`}
                actionLabel="Tip"
                color="amber"
            />
        </Link>
    );
};
