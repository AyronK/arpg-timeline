import { UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/ui/Button";

import { MaybeLinkWrapper } from "./MaybeLinkWrapper";

export const SupportButtons = () => {
    return (
        <section className="container flex flex-col gap-4 md:my-16">
            <div>
                <h2 className="sr-only">Support</h2>
                <div className="mx-auto mb-12 flex max-w-prose flex-col gap-2 text-center">
                    <p className="text-muted-foreground text-sm">
                        Looking for news section? Check out the{" "}
                        <MaybeLinkWrapper href="/news" className="inline-flex! underline">
                            news page
                        </MaybeLinkWrapper>
                        .
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Have questions? Check out our{" "}
                        <MaybeLinkWrapper
                            className="inline-flex! underline"
                            href="/faq"
                            data-sa-click="faq"
                        >
                            FAQ
                        </MaybeLinkWrapper>
                        .
                    </p>
                </div>
                <div className="mx-auto flex max-w-prose flex-col-reverse justify-between gap-2 md:flex-row md:gap-8">
                    <Button variant={"link"} size="lg" asChild>
                        <Link
                            href={process.env.NEXT_PUBLIC_PATREON_URL}
                            rel="noopener"
                            target="_blank"
                            data-sa-click="patreon"
                        >
                            <div className="mr-2 grid h-[1.4rem] w-[1.4rem] place-content-center rounded-full bg-current">
                                <Image
                                    src="/assets/patreon-logo.png"
                                    className="m-auto h-[1rem] w-[1rem]"
                                    alt="Patreon logo"
                                    width={22}
                                    height={22}
                                />
                            </div>
                            <span>Support me</span>
                        </Link>
                    </Button>
                    <Button
                        variant={"default"}
                        asChild
                        size="lg"
                        className="font-ui font-semibold transition-all hover:opacity-100 max-sm:order-3"
                    >
                        <a href="/looking-for-moderators" rel="self" data-sa-click="moderators">
                            <UsersRound className="mr-2 h-[1.2rem] w-[1.2rem]" />
                            Looking for moderators
                        </a>
                    </Button>
                    <Button variant={"link"} size="lg" asChild>
                        <a
                            href="https://github.com/AyronK/arpg-timeline/issues"
                            rel="external nofollow noreferrer"
                            target="_blank"
                            data-sa-click="github"
                        >
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 16 16"
                                version="1.1"
                                data-view-component="true"
                                className="mr-2 h-[1.2rem] w-[1.2rem] fill-current"
                            >
                                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                            </svg>
                            Request a feature
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
};
