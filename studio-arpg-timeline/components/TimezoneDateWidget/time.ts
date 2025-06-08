import { DateTime } from "luxon";

export const formatDate = (date: Date, timeZone?: string): string => {
    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

    return new Intl.DateTimeFormat(navigator.language, {
        timeZone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
};

export const calculateTimezoneDifference = (targetTimeZone: string): number => {
    const localOffset = new Date().getTimezoneOffset();
    const targetOffset = DateTime.now().setZone(targetTimeZone).offset; // in minutes
    return localOffset + targetOffset * -1;
};

export const convertFromTimeZoneToUtc = (date: string, timeZone: string): string | undefined => {
    if (!date || !timeZone) return;

    const dt = DateTime.fromISO(date, { zone: timeZone });
    return dt.toUTC().toISO();
};

export const calculateLocalDate = (date: Date, timeZone: string): string => {
    const dt = DateTime.fromJSDate(date).setZone(timeZone);
    return dt.toFormat("yyyy-MM-dd'T'HH:mm");
};
