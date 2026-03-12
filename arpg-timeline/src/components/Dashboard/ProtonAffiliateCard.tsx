"use client";

import Image from "next/image";
import Link from "next/link";

export const ProtonAffiliateCard = () => (
    <div className="bg-card text-card-foreground relative order-4 col-span-1 flex flex-1 cursor-pointer flex-col gap-1 rounded-md border border-violet-500/30 p-4 hover:border-violet-500/50">
        <Link
            href={
                process.env.NEXT_PUBLIC_PROTON_AFFILIATE_URL ||
                "https://proton.me/Calendar"
            }
            rel="noopener noreferrer"
            target="_blank"
            data-sa-click="proton-calendar-affiliation-banner"
        >
            <div>
                <h3 className="font-heading text-xs">
                    Support us and get Proton Mail
                </h3>
                <div className="mx-8 my-6">
                    <Image
                        src="/assets/Mail_SPD_336x280@2x.png"
                        alt="Banner"
                        width={672}
                        height={560}
                    />
                </div>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Buying Proton Mail supports aRPG Timeline directly.
                </p>
            </div>
        </Link>
    </div>
);
