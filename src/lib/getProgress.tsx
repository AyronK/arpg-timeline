import { CurrentSeasonChip } from "@/components/CurrentSeasonWidget";
import LocalDate from "@/components/LocalDate";
import { inGracePeriod } from "@/lib/games/sortBySeasons";
import {
  CalendarClock,
  CalendarOff,
  Timer,
  TimerOff,
  TimerReset,
} from "lucide-react";

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
): CurrentSeasonChip | null => {
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
) => {
  if (!startDate || !endDate) {
    return null;
  }

  const now = currentTime?.getTime() ?? Date.now();
  const startTimeMs = new Date(startDate).getTime();
  const endTimeMs = new Date(endDate).getTime();
  const elapsedTime = Math.ceil((now - startTimeMs) / 1000 / 60 / 60 / 24);

  if (inGracePeriod(startDate)) {
    return (
      <div
        className="flex flex-row items-center gap-1"
        title="Running for 35 days"
      >
        <TimerReset className="h-4 w-4" />
        Just started
      </div>
    );
  }

  if (endTimeMs <= now) {
    return (
      <div className="flex flex-row items-center gap-1" title="Lasted 35 days">
        <TimerOff className="h-4 w-4" />
        <span className="hidden md:flex">Lasted</span>
        {elapsedTime} days
      </div>
    );
  }

  return (
    <div
      className="flex flex-row items-center gap-1"
      title="Running for 35 days"
    >
      <Timer className="h-4 w-4" />
      <span className="hidden md:flex">Lasts </span>
      {elapsedTime} days
    </div>
  );
};

export const getProgressEndContent = (
  text: string | null,
  endDate: string | null,
  currentTime?: Date | null,
) => {
  if (!text && !endDate) {
    return null;
  }

  if (text) {
    return (
      <div className="flex flex-row flex-nowrap items-center gap-1 md:flex">
        {text}
        <CalendarClock className="h-4 w-4" />
      </div>
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
      <div className="flex flex-row flex-nowrap items-center gap-1">
        <span className="hidden md:flex">Ended</span>
        <LocalDate dateOnly utcDate={endDate} />
        <CalendarOff className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-nowrap items-center gap-1">
      {timeLeft} days left
      <CalendarClock className="h-4 w-4" />
    </div>
  );
};
