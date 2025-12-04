import Image from "next/image";
import Link from "next/link";

export const PatreonFunding = () => (
    <Link
        href={process.env.NEXT_PUBLIC_PATREON_URL || "#"}
        rel="noopener"
        target="_blank"
        data-sa-click="patreon-banner"
        className="text-card-foreground bg-card group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-lg border-2 border-orange-500/30 p-4 transition-all hover:border-orange-500/50 hover:shadow-md md:p-6"
    >
        <div className="flex flex-1 items-center gap-3">
            <div className="bg-muted/50 grid h-10 w-10 shrink-0 place-content-center rounded-full md:h-12 md:w-12">
                <Image
                    src="/assets/patreon-logo.png"
                    className="m-auto h-5 w-5 opacity-70 md:h-6 md:w-6"
                    alt="Patreon logo"
                    width={24}
                    height={24}
                />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
                <h3 className="font-heading text-foreground text-sm font-medium md:text-base">
                    Support aRPG Timeline
                </h3>
                <p className="text-muted-foreground text-xs leading-tight md:text-sm">
                    Help us grow and keep the site private and ad-free!
                </p>
            </div>
        </div>
        <div className="border-border text-secondary-foreground flex shrink-0 items-center gap-1.5 rounded-md border bg-orange-500/30 px-3 py-1.5 transition-colors group-hover:bg-orange-500/50 md:px-4 md:py-2">
            <div className="font-heading sr-only text-xs leading-none font-medium md:not-sr-only md:text-sm">
                Support
            </div>
            <svg
                className="h-3 w-3 md:h-3.5 md:w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                />
            </svg>
        </div>
    </Link>
);
