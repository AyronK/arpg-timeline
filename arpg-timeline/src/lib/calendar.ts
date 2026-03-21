import { createEvent, DateTime, EventAttributes } from "ics";

import { sa_event } from "@/lib/sa_event";

import { TIME_UNKNOWN_NOTE } from "./calendarConstants";

export async function downloadICSFile(eventTitle: string, eventDate: Date, timeUnknown?: boolean) {
    const formattedDate = new Date(eventDate);
    const fileName = `${eventTitle}.ics`;
    const event: EventAttributes = {
        title: eventTitle,
        description: timeUnknown ? TIME_UNKNOWN_NOTE : undefined,
        start: [
            formattedDate.getFullYear(),
            formattedDate.getMonth() + 1,
            formattedDate.getDate(),
            formattedDate.getHours(),
            formattedDate.getMinutes(),
        ] as DateTime,
        duration: { hours: 1 },
    };

    const file = await new Promise((resolve, reject) => {
        sa_event(`Calendar - iCal - ${eventTitle}}`);
        createEvent(event, (error, value) => {
            if (error) {
                reject(error);
            }
            resolve(new File([value], fileName, { type: "text/calendar" }));
        });
    });

    const url = URL.createObjectURL(file as Blob);

    // trying to assign the file URL to a window could cause cross-site
    // issues so this is a workaround using HTML5
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
}

const HOUR_IN_MS = 60 * 60 * 1000;

function formatDateForCalendar(date: Date): string {
    return date.toISOString().replace(/[-:]/g, "").slice(0, -5) + "Z";
}

function getEndDateTime(startDate: Date): Date {
    return new Date(startDate.getTime() + HOUR_IN_MS);
}

export function addToGoogleCalendar(eventTitle: string, eventDate: Date, timeUnknown?: boolean) {
    sa_event(`Calendar - Google - ${eventTitle}}`);
    const endDateTime = getEndDateTime(eventDate);
    const formattedStart = formatDateForCalendar(eventDate);
    const formattedEnd = formatDateForCalendar(endDateTime);
    const details = timeUnknown ? TIME_UNKNOWN_NOTE : "";
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${encodeURIComponent(formattedStart)}/${encodeURIComponent(formattedEnd)}${details ? `&details=${encodeURIComponent(details)}` : ""}`;
    window.open(googleCalendarUrl, "_blank");
}

export function addToICloudCalendar(eventTitle: string, eventDate: Date, timeUnknown?: boolean) {
    sa_event(`Calendar - Apple - ${eventTitle}}`);
    const endDateTime = getEndDateTime(eventDate);
    const formattedStart = formatDateForCalendar(eventDate);
    const formattedEnd = formatDateForCalendar(endDateTime);
    const notes = timeUnknown ? TIME_UNKNOWN_NOTE : "";
    const iCloudCalendarUrl = `https://www.icloud.com/calendar/event?title=${encodeURIComponent(eventTitle)}&starts=${encodeURIComponent(formattedStart)}&ends=${encodeURIComponent(formattedEnd)}${notes ? `&notes=${encodeURIComponent(notes)}` : ""}`;
    window.open(iCloudCalendarUrl, "_blank");
}
