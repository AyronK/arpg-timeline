import ErrorBoundary from "@/components/ErrorBoundary";
import { Kicker } from "@/components/Home/Kicker";
import { SeasonCalendar } from "@/components/Home/SeasonCalendar";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";
import { parseGamesFromSanity } from "@/lib/cms/parseGamesFromSanity";
import { sanityFetch } from "@/lib/sanity/sanityClient";
import { indexQuery, IndexQueryResult } from "@/queries/indexQuery";

const CalendarPage = async () => {
    const data: IndexQueryResult = await sanityFetch({
        query: indexQuery,
        revalidate: 24 * 60 * 60,
        tags: ["season", "liveStreamTwitch", "game", "toast"],
    });
    const games = parseGamesFromSanity(data);

    return (
        <article className="relative flex min-h-[600px] flex-1">
            <h2 className="sr-only">Calendar</h2>
            <div className="container mt-4 flex flex-1 flex-col gap-4 xl:mt-8">
                <Kicker />
                <div className="flex-1">
                    <ErrorBoundary fallback={<WidgetDiedFallback />}>
                        <SeasonCalendar games={games} />
                    </ErrorBoundary>
                </div>
            </div>
        </article>
    );
};

export default CalendarPage;
