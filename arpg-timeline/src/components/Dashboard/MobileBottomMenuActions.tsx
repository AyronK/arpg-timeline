import Image from "next/image";
import Link from "next/link";

import { Button } from "@/ui/Button";

export function MobileBottomMenuActions() {
    return (
        <div className="flex flex-1 justify-around">
            <Button variant={"ghost"} asChild className="px-2 2xl:px-4">
                <Link
                    href={process.env.NEXT_PUBLIC_DISCORD_URL}
                    rel="external noopener noreferrer"
                    target="_blank"
                    data-sa-click="click"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex flex-col items-center gap-1 text-gray-300 hover:bg-transparent hover:text-blue-400"
                    >
                        <Image
                            loading="lazy"
                            unoptimized
                            src="/assets/discord-logo.svg"
                            className="h-5 w-5 brightness-200 grayscale-100"
                            alt="Discord logo"
                            width={20}
                            height={20}
                        />
                        <span className="text-[0.65rem] leading-2 font-medium">Discord</span>
                    </Button>
                </Link>
            </Button>
            <Button variant={"ghost"} asChild className="px-2 2xl:px-4">
                <Link
                    href={process.env.NEXT_PUBLIC_PATREON_URL}
                    rel="noopener"
                    target="_blank"
                    data-sa-click="patreon"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex flex-col items-center gap-1 text-gray-300 hover:bg-transparent hover:text-blue-400"
                    >
                        <Image
                            loading="lazy"
                            src="/assets/patreon-logo.png"
                            className="h-5 w-5 brightness-200 grayscale-100"
                            alt="Patreon logo"
                            width={22}
                            height={22}
                        />
                        <span className="text-[0.65rem] leading-2 font-medium">Donate</span>
                    </Button>
                </Link>
            </Button>
        </div>
    );
}
