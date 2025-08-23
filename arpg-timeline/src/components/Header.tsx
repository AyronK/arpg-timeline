"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/ui/DropdownMenu";

import { Logo } from "./Logo";

interface SocialButtonProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    dataSaClick: string;
    className?: string;
}

export const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const SocialButton = ({
        href,
        icon,
        label,
        dataSaClick,
        className = "",
    }: SocialButtonProps) => (
        <Button variant="ghost" asChild className={`px-2 lg:px-3 2xl:px-4 ${className}`}>
            <Link
                href={href}
                rel="external noopener noreferrer"
                target="_blank"
                data-sa-click={dataSaClick}
                className="flex items-center gap-2"
            >
                <div className="grid h-[1.4rem] w-[1.4rem] place-content-center">{icon}</div>
                <span className="hidden text-sm font-medium 2xl:block">{label}</span>
            </Link>
        </Button>
    );

    return (
        <header className="max-lg:bg-card relative h-[56px] px-2 max-sm:shadow-sm lg:h-[80px] lg:px-8 lg:pt-6 lg:pb-0">
            <div className="relative h-full w-full">
                <Link
                    href="/"
                    rel="self"
                    className="absolute top-0 left-2 z-20 mr-auto transform text-base font-semibold tracking-[0.3rem] sm:text-lg lg:left-1/2 lg:ml-auto lg:-translate-x-1/2 lg:text-4xl"
                >
                    <h1 className="flex flex-row items-center lg:gap-2">
                        <Logo className="scale-75 lg:mx-auto lg:scale-100" />
                        <span className="text-nowrap">aRPG Timeline</span>
                    </h1>
                </Link>

                <div className="flex h-full items-center justify-between gap-2">
                    <div className="ml-auto flex items-center">
                        <SocialButton
                            href={process.env.NEXT_PUBLIC_DISCORD_URL}
                            icon={
                                <Image
                                    src="/assets/discord-logo.svg"
                                    className="m-auto h-[1rem] w-[1rem]"
                                    alt="Discord logo"
                                    width={22}
                                    height={22}
                                />
                            }
                            label="Discord"
                            dataSaClick="click"
                            className="hidden lg:flex"
                        />
                        <SocialButton
                            href={process.env.NEXT_PUBLIC_PATREON_URL}
                            icon={
                                <Image
                                    src="/assets/patreon-logo.png"
                                    className="m-auto h-[1rem] w-[1rem]"
                                    alt="Patreon logo"
                                    width={22}
                                    height={22}
                                />
                            }
                            label="Support Our Work"
                            dataSaClick="patron"
                            className="hidden lg:flex"
                        />
                        <SocialButton
                            href={`${process.env.NEXT_PUBLIC_GITHUB_URL}/${process.env.NEXT_PUBLIC_GITHUB_REPO}/issues`}
                            icon={
                                <svg
                                    aria-hidden="true"
                                    viewBox="-2 -2 20.4 20.4"
                                    version="1.1"
                                    className="fill-foreground h-[1.4rem] w-[1.4rem]"
                                >
                                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                                </svg>
                            }
                            label="GitHub"
                            dataSaClick="github"
                            className="hidden sm:flex"
                        />
                    </div>

                    <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <DropdownMenuTrigger asChild className="lg:hidden">
                            <Button variant="ghost" size="icon" className="h-10 w-10">
                                {isMobileMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-56 border-2 border-slate-500 bg-gray-800 p-2 shadow-2xl"
                            sideOffset={8}
                            collisionPadding={0}
                            alignOffset={-8}
                        >
                            <div className="flex flex-col">
                                <Link
                                    href={process.env.NEXT_PUBLIC_DISCORD_URL}
                                    className="hover:bg-accent flex items-center gap-3 rounded-lg p-2 transition-colors"
                                    target="_blank"
                                    rel="external noopener noreferrer"
                                >
                                    <Image
                                        src="/assets/discord-logo.svg"
                                        className="h-4 w-4"
                                        alt="Discord logo"
                                        width={20}
                                        height={20}
                                    />
                                    <span className="text-nowrap">Join Discord</span>
                                </Link>
                                <Link
                                    href={process.env.NEXT_PUBLIC_PATREON_URL}
                                    className="hover:bg-accent flex items-center gap-3 rounded-lg p-2 transition-colors"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    <Image
                                        src="/assets/patreon-logo.png"
                                        className="h-4 w-4"
                                        alt="Patreon logo"
                                        width={20}
                                        height={20}
                                    />
                                    <span className="text-nowrap">Support Our Work</span>
                                </Link>
                                <Link
                                    href={`${process.env.NEXT_PUBLIC_GITHUB_URL}/${process.env.NEXT_PUBLIC_GITHUB_REPO}/issues`}
                                    className="hover:bg-accent flex items-center gap-3 rounded-lg p-2 transition-colors"
                                    target="_blank"
                                    rel="external nofollow noreferrer"
                                >
                                    <svg
                                        className="fill-foreground h-4 w-4"
                                        viewBox="-2 -2 20.4 20.4"
                                    >
                                        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                                    </svg>
                                    <span className="text-nowrap">GitHub</span>
                                </Link>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};
