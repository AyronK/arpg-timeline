import { CalendarDays, CircleHelp, Heart, MessageCircle, Newspaper } from "lucide-react";

import { MaybeLinkWrapper } from "./MaybeLinkWrapper";

export const SideNotes = () => {
    return (
        <section className="container mt-4 mb-12 md:mt-16">
            <div className="border-foreground/20 mx-auto max-w-prose border-t pt-6">
                <h2 className="font-heading text-foreground text-md mb-3 tracking-widest uppercase">
                    Quick links
                </h2>
                <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Heart className="h-3.5 w-3.5 shrink-0" />
                        <span>
                            Like what we do? Check out our{" "}
                            <MaybeLinkWrapper
                                href="/support"
                                className="inline-flex! underline"
                                data-sa-click="support"
                            >
                                support page
                            </MaybeLinkWrapper>
                            .
                        </span>
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Newspaper className="h-3.5 w-3.5 shrink-0" />
                        <span>
                            Looking for the news section? Check out the{" "}
                            <MaybeLinkWrapper
                                href="/games/news"
                                className="inline-flex! underline"
                                data-sa-click="news"
                            >
                                news page
                            </MaybeLinkWrapper>
                            .
                        </span>
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        <span>
                            Need a calendar subscription? Check out our{" "}
                            <MaybeLinkWrapper
                                href="/calendar"
                                className="inline-flex! underline"
                                data-sa-click="calendar"
                            >
                                calendar page
                            </MaybeLinkWrapper>
                            .
                        </span>
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <CircleHelp className="h-3.5 w-3.5 shrink-0" />
                        <span>
                            Have questions? Check out our{" "}
                            <MaybeLinkWrapper
                                href="/faq"
                                className="inline-flex! underline"
                                data-sa-click="faq"
                            >
                                FAQ
                            </MaybeLinkWrapper>
                            .
                        </span>
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>
                            Feeling lonely? Join our{" "}
                            <MaybeLinkWrapper
                                href={process.env.NEXT_PUBLIC_DISCORD_URL}
                                className="inline-flex! underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                data-sa-click="discord"
                            >
                                Discord
                            </MaybeLinkWrapper>
                            .
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
};
