import { CalendarClock, CalendarOff, Sword, TimerOff, TimerReset } from "lucide-react";

import { IconLabel } from "@/components/IconLabel/IconLabel";
import LocalDate from "@/components/LocalDate";
import { SeasonChip } from "@/components/SeasonWidget";
import { inGracePeriod } from "@/lib/games/sortBySeasons";

export const getProgress = (
    startDate: string | null,
    endDate: string | null,
    currentTime?: Date | null,
) => {
    if (!startDate || !endDate) {
        return 0;
    }

    const now = currentTime?.getTime() ?? Date.now();
    const startTimeMs = new Date(startDate).getTime();
    const endTimeMs = new Date(endDate).getTime();

    const totalDuration = endTimeMs - startTimeMs;
    const elapsedTime = now - startTimeMs;

    const progressPercentage = (elapsedTime / totalDuration) * 100;

    return progressPercentage;
};

export const getCurrentSeasonChip = (
    startDate: string | null,
    endDate: string | null,
    currentTime?: Date | null,
): SeasonChip | null => {
    if (!startDate || !endDate) {
        return null;
    }

    const now = currentTime?.getTime() ?? Date.now();
    const endTimeMs = new Date(endDate).getTime();

    return inGracePeriod(startDate) ? "live" : endTimeMs <= now ? "over" : "now";
};

export const getProgressStartContent = (
    startDate: string | null,
    endDate: string | null,
    currentTime?: Date | null,
    isDormant?: boolean,
) => {
    if (!startDate || !endDate) {
        return null;
    }

    const now = currentTime?.getTime() ?? Date.now();
    const startTimeMs = new Date(startDate).getTime();
    const endTimeMs = new Date(endDate).getTime();

    const elapsedMinutes = Math.ceil((now - startTimeMs) / 1000 / 60);
    const elapsedHours = Math.ceil(elapsedMinutes / 60);
    const elapsedDays = Math.ceil(elapsedHours / 24);

    if (elapsedMinutes < 60) {
        return <IconLabel icon={TimerReset}>Started {elapsedMinutes}min ago</IconLabel>;
    }

    if (elapsedHours <= 48) {
        return <IconLabel icon={TimerReset}>Started {elapsedHours}h ago</IconLabel>;
    }

    if (endTimeMs <= now) {
        return <IconLabel icon={TimerOff}>Started {elapsedDays} days ago</IconLabel>;
    }

    if (isDormant) {
        return (
            <IconLabel icon={Sword}>
                Released on{" "}
                {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }).format(new Date(startDate))}
            </IconLabel>
        );
    }

    return <IconLabel icon={TimerReset}>Started {elapsedDays} days ago</IconLabel>;
};

export const getProgressEndContent = (
    text: string | null,
    endDate: string | null | undefined,
    currentTime?: Date | null | undefined,
) => {
    if (!text && !endDate) {
        return null;
    }

    if (text) {
        return (
            <IconLabel iconPosition="end" icon={CalendarClock}>
                <i>{text}</i>
            </IconLabel>
        );
    }

    if (!endDate) {
        return null;
    }

    const now = currentTime?.getTime() ?? Date.now();
    const endTimeMs = new Date(endDate).getTime();
    const timeLeft = Math.ceil((endTimeMs - now) / 1000 / 60 / 60 / 24);

    if (endTimeMs <= now) {
        return (
            <IconLabel iconPosition="end" icon={CalendarOff}>
                Ended <LocalDate dateOnly utcDate={endDate} />
            </IconLabel>
        );
    }

    return (
        <IconLabel iconPosition="end" icon={CalendarClock}>
            <span>{timeLeft} days left</span>
        </IconLabel>
    );
};
