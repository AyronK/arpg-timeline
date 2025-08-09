import Image from "next/image";
import Link from "next/link";

import { Button } from "@/ui/Button";

import { Logo } from "./Logo";

export type HeaderProps = {
    discordUrl: string;
    patreonUrl: string;
    githubUrl: string;
};

export const Header = ({ discordUrl, patreonUrl, githubUrl }: HeaderProps) => (
    <header className="max-md:bg-card relative h-[56px] px-2 max-sm:shadow-sm md:h-[80px] md:px-8 md:pt-6 md:pb-0">
        <div className="relative h-full w-full">
            <Link
                href="/"
                rel="self"
                className="absolute top-0 z-20 transform text-base font-semibold tracking-[0.3rem] sm:text-lg md:left-1/2 md:mr-auto md:ml-auto md:-translate-x-1/2 md:text-4xl"
            >
                <h1 className="flex flex-row items-center md:gap-2">
                    <Logo className="mx-auto scale-75 md:scale-100" />
                    <span className="text-nowrap">aRPG Timeline</span>
                </h1>
            </Link>
            <div className="flex h-full items-center justify-between gap-2">
                <div className="ml-auto flex items-center">
                    <Button variant={"ghost"} asChild className="px-2 2xl:px-4">
                        <Link
                            href={discordUrl}
                            rel="external noopener noreferrer"
                            target="_blank"
                            data-sa-click="click"
                        >
                            <div className="grid h-[1.4rem] w-[1.4rem] place-content-center rounded-full bg-current 2xl:mr-3">
                                <Image
                                    src="/assets/discord-logo.svg"
                                    className="m-auto h-[1rem] w-[1rem]"
                                    alt="Discord logo"
                                    width={22}
                                    height={22}
                                />
                            </div>
                            <span className="hidden 2xl:block">Discord</span>
                        </Link>
                    </Button>
                    <Button variant={"ghost"} asChild className="px-2 2xl:px-4">
                        <Link
                            href={patreonUrl}
                            rel="noopener"
                            target="_blank"
                            data-sa-click="patron"
                        >
                            <div className="grid h-[1.4rem] w-[1.4rem] place-content-center rounded-full bg-current 2xl:mr-3">
                                <Image
                                    src="/assets/patreon-logo.png"
                                    className="m-auto h-[1rem] w-[1rem]"
                                    alt="Patreon logo"
                                    width={22}
                                    height={22}
                                />
                            </div>
                            <span className="hidden 2xl:block">Support me</span>
                        </Link>
                    </Button>
                    <Button variant={"ghost"} asChild className="hidden px-2 sm:flex 2xl:px-4">
                        <Link
                            href={githubUrl}
                            rel="external nofollow noreferrer"
                            target="_blank"
                            data-sa-click="github"
                        >
                            <div className="grid h-[1.4rem] w-[1.4rem] place-content-center rounded-full bg-current 2xl:mr-3">
                                <svg
                                    aria-hidden="true"
                                    viewBox="-2 -2 20.4 20.4"
                                    version="1.1"
                                    className="h-[1.4rem] w-[1.4rem]"
                                >
                                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                                </svg>
                            </div>
                            <span className="hidden 2xl:block">GitHub</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    </header>
);
