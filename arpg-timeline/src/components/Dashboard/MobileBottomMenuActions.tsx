import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function MobileBottomMenuActions() {
    return (
        <div className="flex flex-1 justify-around">
            <Link
                href={process.env.NEXT_PUBLIC_DISCORD_URL}
                rel="external noopener noreferrer"
                target="_blank"
                data-sa-click="click"
                className="flex flex-col items-center justify-center gap-1 px-2 py-1 text-gray-300 hover:bg-transparent hover:text-blue-400"
            >
                <Image
                    loading="lazy"
                    unoptimized
                    src="/assets/third-party/discord-logo.svg"
                    className="h-5 w-5 brightness-200 grayscale-100"
                    alt="Discord logo"
                    width={20}
                    height={20}
                />
                <span className="text-[0.65rem] leading-2 font-medium">Discord</span>
            </Link>
            <Link
                href="/support"
                data-sa-click="support"
                className="flex flex-col items-center justify-center gap-1 px-2 py-1 text-gray-300 hover:bg-transparent hover:text-blue-400"
            >
                <Heart className="h-5 w-5" />
                <span className="text-[0.65rem] leading-2 font-medium">Support</span>
            </Link>
        </div>
    );
}
