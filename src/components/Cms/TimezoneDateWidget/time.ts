import { timeZoneMappings } from "@/components/Cms/TimezoneDateWidget/timeZoneMappings";
import { DateTime } from "luxon";

export const formatDate = (date: Date, timeZone: string): string => {
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  return new Intl.DateTimeFormat(navigator.language, {
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

export const convertFromTimeZoneToUtc = (date: string, timeZone: string) => {
  const tz = timeZoneMappings.find((t) => t.abbr === timeZone);
  if (!tz || !date) return;

  const dt = DateTime.fromISO(date, { zone: tz.iana });

  return dt.toUTC().toISO();
};

export const calculateLocalDate = (date: Date, timezone: string) => {
  const timeZoneDifference = calculateTimezoneDifference(timezone);
  date.setMinutes(date.getMinutes() + timeZoneDifference);
  const iana = timeZoneMappings.find((t) => t.abbr === timezone)?.iana;
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: iana,
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  const [month, day, year] = formattedDate.split(", ")[0].split("/");
  const [hour, minute] = formattedDate.split(", ")[1].split(":");
  return `${year}-${month}-${day}T${hour}:${minute}`;
};
