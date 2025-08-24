import { ExternalLink, Calendar, Newspaper } from "lucide-react";

import { addUTMParameters } from "@/lib/utm";
import { cn } from "@/lib/utils";
import { SteamNewsItem } from "@/lib/steam/getSteamNews";

interface SteamNewsProps {
    steamAppId: number;
    gameName: string;
    news: SteamNewsItem[];
    className?: string;
}

const addUTM = addUTMParameters({
    utm_source: "arpg-timeline",
    utm_content: "steam_news",
});

const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
};

export const SteamNews = ({ steamAppId, gameName, news, className }: SteamNewsProps) => {
    if (news.length === 0) {
        return (
            <div className={cn("bg-card rounded-lg border p-4", className)}>
                <div className="border-border mb-4 flex items-center gap-2 border-b pb-2">
                    <Newspaper className="h-5 w-5 text-blue-500" />
                    <h3 className="text-foreground text-lg font-semibold">Steam News</h3>
                </div>
                <p className="text-muted-foreground text-sm">No recent news available.</p>
            </div>
        );
    }

    return (
        <div className={cn("bg-card rounded-lg border p-4", className)}>
            <div className="border-border mb-4 flex items-center gap-2 border-b pb-2">
                <Newspaper className="h-5 w-5 text-blue-500" />
                <h3 className="text-foreground text-lg font-semibold">Steam News</h3>
            </div>
            <div className="space-y-3">
                {news.slice(0, 3).map((item, index) => (
                    <article key={index} className="group">
                        <a
                            href={addUTM(item.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-muted/20 hover:border-border hover:bg-muted/40 block rounded-md border border-transparent p-3 transition-all hover:shadow-sm"
                        >
                            <div className="space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                    <h4
                                        className="text-foreground line-clamp-2 flex-1 text-sm leading-tight font-semibold transition-colors group-hover:text-blue-600"
                                        dangerouslySetInnerHTML={{
                                            __html: truncateText(item.title, 80),
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
                                        {truncateText(item.description, 200)}
                                    </p>
                                )}
                            </div>
                        </a>
                    </article>
                ))}
            </div>

            <div className="mt-4 border-t pt-3">
                <a
                    href={addUTM(`https://store.steampowered.com/news/app/${steamAppId}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                >
                    View all news
                    <ExternalLink className="h-3 w-3" />
                </a>
            </div>
        </div>
    );
};
