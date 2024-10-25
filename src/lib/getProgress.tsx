import { SeasonChip } from "@/components/CurrentSeasonWidget";
import { IconLabel } from "@/components/IconLabel/IconLabel";
import LocalDate from "@/components/LocalDate";
import { inGracePeriod } from "@/lib/games/sortBySeasons";
import { CalendarClock, CalendarOff, TimerOff, TimerReset } from "lucide-react";

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
) => {
  if (!startDate || !endDate) {
    return null;
  }

  const now = currentTime?.getTime() ?? Date.now();
  const startTimeMs = new Date(startDate).getTime();
  const endTimeMs = new Date(endDate).getTime();

  const elapsedTime = Math.ceil((now - startTimeMs) / 1000 / 60 / 60);
  const elapsedDays = Math.ceil(elapsedTime / 24);

  if (inGracePeriod(startDate)) {
    return <IconLabel icon={TimerReset}>Started {elapsedTime}h ago</IconLabel>;
  }

  if (endTimeMs <= now) {
    return <IconLabel icon={TimerOff}>Lasted {elapsedDays} days</IconLabel>;
  }

  return <IconLabel icon={TimerReset}>Lasts {elapsedDays} days</IconLabel>;
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
      <IconLabel iconPosition="end" icon={CalendarClock}>
        <span>{text}</span>
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
        <span>
          Ended <LocalDate dateOnly utcDate={endDate} />
        </span>
      </IconLabel>
    );
  }

  return (
    <IconLabel iconPosition="end" icon={CalendarClock}>
      <span>{timeLeft} days left</span>
    </IconLabel>
  );
};
