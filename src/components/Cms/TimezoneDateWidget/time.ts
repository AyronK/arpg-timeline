import { timeZoneMappings } from "@/components/Cms/TimezoneDateWidget/timeZoneMappings";

export const convertToTimezone = (date: Date, timezone: string): string => {
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  const iana = timeZoneMappings.find((t) => t.abbr === timezone)?.iana;
  if (!iana) {
    return "Invalid date";
  }
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export const formatDate = (date: Date, timeZone: string): string => {
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export const calculateTimezoneDifference = (targetTimeZone: string): number => {
  const currentDate = new Date();
  const iana = timeZoneMappings.find((t) => t.abbr === targetTimeZone)?.iana;
  const localOffset = currentDate.getTimezoneOffset();
  const targetDate = new Date(
    currentDate.toLocaleString("en-US", { timeZone: iana }),
  );
  const targetOffset = targetDate.getTimezoneOffset();
  return localOffset - targetOffset;
};

