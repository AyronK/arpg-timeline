import Image from "next/image";
import Link from "next/link";

import { CtaBannerContent, getCtaBannerClassName } from "@/components/CtaBanner";

export const DiscordBotBanner = ({
    gameName,
    seasonKeyword = "season",
}: {
    gameName: string;
    seasonKeyword?: string;
}) => (
    <Link
        href="/discord-bot"
        data-sa-click="discord-bot-game-banner"
        className={getCtaBannerClassName("indigo")}
    >
        <CtaBannerContent
            icon={
                <Image
                    loading="lazy"
                    unoptimized
                    src="/assets/third-party/discord-logo.svg"
                    className="m-auto h-6 w-6 opacity-70 md:h-7 md:w-7"
                    alt="Discord logo"
                    width={32}
                    height={32}
                />
            }
            title={`Get ${gameName} ${seasonKeyword}s in your Discord`}
            description={`Our free bot adds every new ${seasonKeyword} to your server's Events tab.`}
            actionLabel="Get the bot"
            color="indigo"
        />
    </Link>
);
