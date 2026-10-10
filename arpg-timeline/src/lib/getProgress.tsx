import { CalendarClock, CalendarOff, Sword, TimerReset } from "lucide-react";

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

const DAY_MS = 24 * 60 * 60 * 1000;

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;

const formatTimeLeft = (msLeft: number) => {
    const hours = Math.round(msLeft / (60 * 60 * 1000));
    const days = Math.floor(msLeft / DAY_MS);

    if (hours < 1) return "less than an hour left";
    if (hours < 24) return `about ${plural(hours, "hour")} left`;
    if (days < 14) return `${plural(days, "day")} left`;
    if (days < 60) return `about ${plural(Math.round(days / 7), "week")} left`;
    return `about ${plural(Math.round(days / 30), "month")} left`;
};

const getSeasonPhase = (passed: number, seasonKeyword: string) => {
    if (passed < 5) return "Just started";
    if (passed < 20) return `Early in the ${seasonKeyword}`;
    if (passed < 50) return `Midway through the ${seasonKeyword}`;
    if (passed < 85) return `Late in the ${seasonKeyword}`;
    return "Ending soon";
};

export const getProgressTooltipText = (
    startDate: string | null | undefined,
    endDate: string | null | undefined,
    endConfirmed: boolean | null | undefined,
    seasonKeyword: string,
    currentTime?: Date | null,
) => {
    if (!startDate || !endDate) {
        return null;
    }

    const now = currentTime?.getTime() ?? Date.now();
    const endTimeMs = new Date(endDate).getTime();
    const passed = getProgress(startDate, endDate, currentTime);

    // Estimated ends only drive a soft phase: no time left and no "Ending soon".
    if (!endConfirmed) {
        return `${getSeasonPhase(Math.min(passed, 50), seasonKeyword)} – end date not announced`;
    }

    if (endTimeMs <= now) {
        return `The ${seasonKeyword} has ended`;
    }

    return `${getSeasonPhase(passed, seasonKeyword)} – ${formatTimeLeft(endTimeMs - now)}`;
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

    return inGracePeriod(startDate, endDate) ? "live" : endTimeMs <= now ? "over" : "now";
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

    const elapsedMinutes = Math.max(Math.floor((now - startTimeMs) / 1000 / 60), 1);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);
    const startedAgoLabel =
        elapsedDays > 100
            ? `Started ${Math.round(elapsedDays / 30)} months ago`
            : `Started ${elapsedDays} days ago`;

    if (elapsedMinutes < 60) {
        return <IconLabel icon={TimerReset}>Started {elapsedMinutes}min ago</IconLabel>;
    }

    if (elapsedHours <= 48) {
        return <IconLabel icon={TimerReset}>Started {elapsedHours}h ago</IconLabel>;
    }

    if (endTimeMs <= now) {
        return <IconLabel icon={TimerReset}>{startedAgoLabel}</IconLabel>;
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

    return <IconLabel icon={TimerReset}>{startedAgoLabel}</IconLabel>;
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
    const hoursLeft = Math.floor((endTimeMs - now) / 1000 / 60 / 60);
    const daysLeft = Math.floor(hoursLeft / 24);
    const timeLeft =
        daysLeft >= 1
            ? `${daysLeft} ${daysLeft === 1 ? "day" : "days"}`
            : hoursLeft >= 1
              ? `${hoursLeft}h`
              : "<1h";

    if (endTimeMs <= now) {
        return (
            <IconLabel iconPosition="end" icon={CalendarOff}>
                Ended <LocalDate dateOnly utcDate={endDate} />
            </IconLabel>
        );
    }

    return (
        <IconLabel iconPosition="end" icon={CalendarClock}>
            <span>{timeLeft} left</span>
        </IconLabel>
    );
};
