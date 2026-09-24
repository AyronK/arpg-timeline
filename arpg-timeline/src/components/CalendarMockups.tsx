import { AlignLeft, CalendarDays, ChevronLeft, ChevronRight, Clock, Link2, X } from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

// Static HTML recreations of a generic calendar app, used instead of screenshots

const week = [
    { day: "Mon", date: 28 },
    { day: "Tue", date: 29 },
    { day: "Wed", date: 30 },
    { day: "Thu", date: 1, dot: "bg-emerald-500" },
    { day: "Fri", date: 2, dot: "bg-violet-500" },
    { day: "Sat", date: 3 },
    { day: "Sun", date: 4, dot: "bg-emerald-500" },
];

const agenda = [
    {
        when: "Thu 1",
        time: "18:00",
        title: "Ashen Kingdoms | Season 5 - Rise of the Frost launch",
        bar: "bg-emerald-500",
    },
    {
        when: "Fri 2",
        time: "20:00",
        title: "Hollow Depths | Season 12 reveal | on Twitch",
        bar: "bg-violet-500",
    },
    {
        when: "Sun 4",
        time: "12:00",
        title: "Hollow Depths | Season 12 - The Sunken Crown launch",
        bar: "bg-emerald-500",
    },
];

export const CalendarAgendaMockup = ({ className }: { className?: string }) => (
    <div
        aria-hidden
        className={cn(
            "bg-card w-full max-w-sm overflow-hidden rounded-[9px] text-left select-none",
            className,
        )}
    >
        <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="font-heading text-foreground text-base font-semibold">October</span>
            <span className="text-muted-foreground flex items-center gap-1">
                <span className="rounded-md border px-2 py-0.5 text-xs">Today</span>
                <ChevronLeft className="h-4 w-4" />
                <ChevronRight className="h-4 w-4" />
            </span>
        </div>
        <div className="grid grid-cols-7 border-b px-2 py-2 text-center">
            {week.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-0.5">
                    <span className="text-muted-foreground text-[10px] uppercase">{d.day}</span>
                    <span
                        className={cn(
                            "grid h-7 w-7 place-content-center rounded-full text-sm",
                            d.date === 1 && "bg-emerald-500/20 text-emerald-300",
                        )}
                    >
                        {d.date}
                    </span>
                    <span className={cn("h-1 w-1 rounded-full", d.dot ?? "bg-transparent")} />
                </div>
            ))}
        </div>
        <ul className="flex flex-col gap-1 p-2">
            {agenda.map((e) => (
                <li key={e.title} className="flex gap-3 rounded-md px-2 py-2">
                    <span className="text-muted-foreground flex w-12 shrink-0 flex-col text-xs">
                        <span className="text-foreground font-medium">{e.when}</span>
                        {e.time}
                    </span>
                    <span className={cn("w-1 shrink-0 rounded-full", e.bar)} />
                    <span className="text-foreground min-w-0 text-sm leading-snug">{e.title}</span>
                </li>
            ))}
        </ul>
        <div className="text-muted-foreground flex items-center gap-2 border-t px-4 py-2.5 text-xs">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            arpg-timeline.com
            <span className="ml-auto opacity-70">Subscribed</span>
        </div>
    </div>
);

const DetailRow = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
    <div className="flex gap-3">
        <span className="text-muted-foreground mt-0.5 shrink-0 [&_svg]:h-4 [&_svg]:w-4">
            {icon}
        </span>
        <div className="min-w-0 text-sm">{children}</div>
    </div>
);

export const CalendarEventMockup = ({
    title,
    when,
    links,
    calendarName,
    color,
}: {
    title: string;
    when: string;
    links: string[];
    calendarName: string;
    color: string;
}) => (
    <div
        aria-hidden
        className="bg-card w-full max-w-md min-w-0 overflow-hidden rounded-lg border text-left shadow-lg select-none"
    >
        <div className="text-muted-foreground flex justify-end px-3 pt-3">
            <X className="h-4 w-4" />
        </div>
        <div className="flex flex-col gap-4 px-5 pb-5">
            <div className="flex gap-3">
                <span className={cn("mt-1.5 h-3.5 w-3.5 shrink-0 rounded-sm", color)} />
                <div className="min-w-0">
                    <div className="font-heading text-foreground text-lg leading-snug">{title}</div>
                    <div className="text-muted-foreground text-sm">{when}</div>
                </div>
            </div>
            <DetailRow icon={<AlignLeft />}>
                <div className="flex flex-col gap-1">
                    {links.map((l) => (
                        <span key={l} className="truncate">
                            {l.split(": ")[0]}:{" "}
                            <span className="text-sky-400 underline underline-offset-2">
                                {l.split(": ")[1]}
                            </span>
                        </span>
                    ))}
                </div>
            </DetailRow>
            <DetailRow icon={<Clock />}>Shown in your local time</DetailRow>
            <DetailRow icon={<Link2 />}>
                <span className="text-sky-400 underline underline-offset-2">arpg-timeline.com</span>
            </DetailRow>
            <DetailRow icon={<CalendarDays />}>
                <span className="flex items-center gap-2">
                    {calendarName}
                </span>
            </DetailRow>
        </div>
    </div>
);
