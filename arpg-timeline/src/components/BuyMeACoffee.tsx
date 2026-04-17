import Image from "next/image";
import Link from "next/link";

import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";

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
                        className="m-auto h-5 w-5 opacity-70 md:h-6 md:w-6"
                        alt="Buy Me a Coffee logo"
                        width={24}
                        height={24}
                    />
                }
                title="Buy Me a Coffee"
                description="A one-time tip to help cover server costs. Every bit helps!"
                actionLabel="Tip"
                color="amber"
            />
        </Link>
    );
};
