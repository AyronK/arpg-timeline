import { MaybeLinkWrapper } from "./MaybeLinkWrapper";

export const SideNotes = () => {
    return (
        <section className="container mt-4 flex flex-col gap-8 md:mt-16">
            <div>
                <h2 className="sr-only">Support</h2>
                <div className="mx-auto mb-12 flex max-w-prose flex-col gap-2 text-center">
                    <p className="text-muted-foreground text-sm">
                        Looking for news section? Check out the{" "}
                        <MaybeLinkWrapper href="/games/news" className="inline-flex! underline">
                            news page
                        </MaybeLinkWrapper>
                        .
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Need calender subscription? Check out our{" "}
                        <MaybeLinkWrapper
                            className="inline-flex! underline"
                            href="/calendar"
                            data-sa-click="faq"
                        >
                            calendar page
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
                    <p className="text-muted-foreground text-sm">
                        Feeling lonely? Check out our{" "}
                        <MaybeLinkWrapper
                            className="inline-flex! underline"
                            href={process.env.NEXT_PUBLIC_DISCORD_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-sa-click="discord"
                        >
                            Discord
                        </MaybeLinkWrapper>
                        .
                    </p>
                </div>
            </div>
        </section>
    );
};
