import ErrorBoundary from "@/components/ErrorBoundary";
import { TimelineEvent } from "@/components/Timeline/Const";
import { GanttChart } from "@/components/Timeline/NewTimeline";
import { WidgetDiedFallback } from "@/components/WidgetDiedFallback";

export const Events = ({ events }: { events: TimelineEvent[] }) => (
    <div className="bg-card text-card-foreground 3xl:col-span-4 4xl:col-span-5 lg-col-span-2 relative order-3 col-span-1 flex flex-col gap-4 rounded-md border p-4 md:col-span-2 md:gap-4 md:p-6 xl:col-span-3">
        <h3 className="mb-1.5 text-xs">Timeline</h3>
        <ErrorBoundary fallback={<WidgetDiedFallback />}>
            <GanttChart events={events} />
        </ErrorBoundary>
    </div>
);
