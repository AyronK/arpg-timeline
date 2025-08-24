import Image from "next/image";
import Link from "next/link";

import { Button } from "@/ui/Button";

export const CantFindGame = () => (
    <div className="bg-card 3xl:nth-[2]:order-first 3xl:nth-[3]:order-first 3xl:nth-[4]:order-first 4xl:nth-[2]:order-first 4xl:nth-[3]:order-first 4xl:nth-[4]:order-first 4xl:nth-[5]:order-first order-last flex flex-col items-center justify-center rounded-lg p-6 text-center lg:nth-[2]:order-first xl:nth-[2]:order-first">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Can&apos;t find a game?
        </h3>
        <p className="hidden text-sm text-gray-600 lg:block dark:text-gray-400">
            Switch between different dashboard views using the tabs above, or request a game on
            Discord
        </p>
        <p className="flex flex-col items-center gap-6 pt-2 lg:hidden">
            <span className="text-sm">
                Use the diamond button in the mobile menu to switch between different dashboard
                views. Still not there? Request the game on Discord.
            </span>
            <Button variant={"ghost"} asChild className="px-2 2xl:px-4">
                <Link
                    href={process.env.NEXT_PUBLIC_DISCORD_URL}
                    rel="external noopener noreferrer"
                    target="_blank"
                    data-sa-click="click"
                >
                    <Button variant="outline" size="sm">
                        <Image
                            src="/assets/discord-logo.svg"
                            className="mr-2 h-4 w-4 brightness-200 grayscale-100"
                            alt="Discord logo"
                            width={20}
                            height={20}
                        />
                        Join Discord
                    </Button>
                </Link>
            </Button>
        </p>
    </div>
);
