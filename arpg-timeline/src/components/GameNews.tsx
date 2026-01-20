import { Calendar, ExternalLink } from "lucide-react";

import { SteamNewsItem } from "@/lib/steam/getSteamNews";
import { cn } from "@/lib/utils";
import { addUTMParameters } from "@/lib/utm";

import { MaybeLinkWrapper } from "./MaybeLinkWrapper";

interface GameNewsProps {
    steamAppId?: number | null;
    news: SteamNewsItem[];
    className?: string;
}

const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_content: "steam_news",
});

export const GameNews = ({ steamAppId, news, className }: GameNewsProps) => {
    if (news.length === 0) {
        return (
            <div className={cn("bg-card text-card-foreground rounded-lg border p-4", className)}>
                <div className="border-border mb-4 flex items-center gap-2 border-b pb-2">
                    <h3 className="font-heading text-foreground text-lg">Game news</h3>
                </div>
                <p className="text-muted-foreground text-sm">No recent news available.</p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "bg-card text-card-foreground flex flex-1 flex-col rounded-lg border p-4",
                className,
            )}
        >
            <div className="border-border mb-4 flex items-center gap-2 border-b pb-2">
                <h3 className="font-heading text-foreground text-lg">Game news</h3>
            </div>
            <div className="space-y-3">
                {news.map((item, index) => (
                    <article key={index} className="group">
                        <a
                            href={addUTM(item.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-muted/20 hover:bg-muted/40 hover:border-border block rounded-md border border-transparent p-3 transition-all hover:shadow-lg"
                        >
                            <div className="space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                    <h4
                                        className="text-foreground group-hover:text-primary line-clamp-2 flex-1 text-sm leading-tight font-semibold transition-colors"
                                        dangerouslySetInnerHTML={{
                                            __html: item.title,
                                        }}
                                    />
                                    <ExternalLink className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>

                                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    <time dateTime={item.pubDate}>
                                        {new Date(item.pubDate).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </time>
                                </div>

                                {item.description && (
                                    <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </a>
                    </article>
                ))}
            </div>

            {steamAppId && (
                <div className="border-border mt-auto flex w-full justify-end border-t pt-3">
                    <MaybeLinkWrapper
                        href={addUTM(`https://store.steampowered.com/news/app/${steamAppId}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 text-sm"
                    >
                        View all news
                    </MaybeLinkWrapper>
                </div>
            )}
        </div>
    );
};
