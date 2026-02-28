"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";
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

const SocialButton = ({ href, icon, label, dataSaClick, className = "" }: SocialButtonProps) => (
    <Button variant="ghost" asChild className={cn("px-2 lg:px-3 2xl:px-4", className)}>
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

export const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="max-lg:bg-card relative container mx-auto h-[56px] max-sm:shadow-sm lg:h-[80px] lg:pt-6 lg:pb-0">
            <div className="relative h-full w-full">
                <Link
                    href="/"
                    rel="self"
                    className="absolute top-0 z-20 mr-auto flex transform flex-col gap-1 text-base font-semibold tracking-[0.3rem] sm:text-lg lg:left-1/2 lg:ml-auto lg:-translate-x-1/2 lg:text-4xl"
                >
                    <div className="flex flex-row items-center lg:gap-4">
                        <span className="text-muted-foreground font-heading hidden w-0 flex-1 overflow-visible text-xs text-nowrap [direction:rtl] md:block">
                            Every Season
                        </span>
                        <div className="flex flex-row items-center lg:gap-4">
                            <Logo className="scale-75 lg:mx-auto lg:scale-100" />
                            <h1 className="text-nowrap">aRPG Timeline</h1>
                        </div>
                        <span className="text-muted-foreground font-heading hidden w-0 flex-1 overflow-visible text-left text-xs text-nowrap md:block">
                            Just On Time
                        </span>
                    </div>
                </Link>
                <div className="flex h-full items-center justify-between gap-2">
                    <div className="ml-auto flex items-center">
                        <SocialButton
                            href={process.env.NEXT_PUBLIC_DISCORD_URL}
                            icon={
                                <Image
                                    unoptimized
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
                            label="Support us"
                            dataSaClick="patreon"
                            className="hidden lg:flex"
                        />
                    </div>

                    <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <DropdownMenuTrigger asChild className="lg:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10"
                                data-sa-click="menu-toggle"
                            >
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
                                    data-sa-click="discord"
                                >
                                    <Image
                                        loading="lazy"
                                        unoptimized
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
                                    data-sa-click="patreon"
                                >
                                    <Image
                                        loading="lazy"
                                        src="/assets/patreon-logo.png"
                                        className="h-4 w-4"
                                        alt="Patreon logo"
                                        width={20}
                                        height={20}
                                    />
                                    <span className="text-nowrap">Support us</span>
                                </Link>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};
