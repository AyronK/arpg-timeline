"use client";
import { Heart, Menu, X } from "lucide-react";
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
    target?: string;
    rel?: string;
}

const SocialButton = ({
    href,
    icon,
    label,
    dataSaClick,
    className = "",
    target = "_blank",
    rel = "noopener noreferrer nofollow",
}: SocialButtonProps) => (
    <Button variant="ghost" asChild className={cn("px-2 lg:px-3 2xl:px-4", className)}>
        <Link
            href={href}
            rel={rel}
            target={target}
            data-sa-click={dataSaClick}
            className="flex items-center gap-2"
        >
            <div className="grid h-[1.4rem] w-[1.4rem] place-content-center">{icon}</div>
            <span className="hidden text-sm font-medium lg:block">{label}</span>
        </Link>
    </Button>
);

export const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="max-xl:bg-card relative h-[56px] max-sm:shadow-sm xl:container xl:mx-auto xl:h-[80px] xl:pt-6 xl:pb-0">
            <div className="relative h-full w-full">
                <Link
                    href="/"
                    rel="self"
                    className="absolute top-0 z-20 mr-auto flex transform flex-col gap-1 text-base font-semibold tracking-[0.3rem] sm:text-lg lg:left-1/2 lg:ml-auto lg:-translate-x-1/2 lg:text-4xl"
                >
                    <div className="flex flex-row items-center lg:gap-4">
                        <span className="text-muted-foreground font-heading hidden w-0 flex-1 overflow-visible text-xs text-nowrap [direction:rtl] lg:block">
                            Every Season
                        </span>
                        <div className="flex flex-row items-center px-2 lg:gap-4 xl:px-0">
                            <Logo className="scale-75 lg:mx-auto lg:scale-100" />
                            <h1 className="text-nowrap">aRPG Timeline</h1>
                        </div>
                        <span className="text-muted-foreground font-heading hidden w-0 flex-1 overflow-visible text-left text-xs text-nowrap lg:block">
                            Just On Time
                        </span>
                    </div>
                </Link>
                <div className="flex h-full items-center justify-between gap-2 px-2">
                    <div className="ml-auto flex items-center">
                        <SocialButton
                            href={process.env.NEXT_PUBLIC_DISCORD_URL}
                            rel="noopener noreferrer nofollow"
                            icon={
                                <Image
                                    unoptimized
                                    src="/assets/third-party/discord-logo.svg"
                                    className="m-auto h-[1rem] w-[1rem]"
                                    alt="Discord logo"
                                    width={22}
                                    height={22}
                                />
                            }
                            label="Discord"
                            dataSaClick="click"
                            className="hidden xl:flex"
                        />
                        <SocialButton
                            href="/support"
                            icon={
                                <Heart className="m-auto h-[1rem] w-[1rem] fill-rose-500 text-rose-500" />
                            }
                            label="Support us"
                            dataSaClick="support"
                            target="_self"
                            rel=""
                            className="hidden xl:flex"
                        />
                    </div>

                    <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <DropdownMenuTrigger asChild className="xl:hidden">
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
                            className="border-foreground/35 w-56 border p-2 shadow-xl"
                            sideOffset={8}
                            collisionPadding={0}
                            alignOffset={-8}
                        >
                            <div className="flex flex-col text-sm">
                                <Link
                                    href="/support"
                                    className="hover:bg-accent flex items-center gap-3 rounded-lg p-2 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    data-sa-click="support"
                                >
                                    <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                                    <span className="text-nowrap">Support us</span>
                                </Link>
                                <Link
                                    href={process.env.NEXT_PUBLIC_DISCORD_URL}
                                    className="hover:bg-accent flex items-center gap-3 rounded-lg p-2 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    data-sa-click="discord"
                                >
                                    <Image
                                        loading="lazy"
                                        unoptimized
                                        src="/assets/third-party/discord-logo.svg"
                                        className="h-4 w-4"
                                        alt="Discord logo"
                                        width={20}
                                        height={20}
                                    />
                                    <span className="text-nowrap">Join Discord</span>
                                </Link>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};
