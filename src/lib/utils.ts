import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function addToGoogleCalendar(eventTitle: string, eventDate: Date) {
  const formattedDate =
    new Date(eventDate).toISOString().replace(/[-:]/g, "").slice(0, -5) + "Z";
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${encodeURIComponent(formattedDate)}/${encodeURIComponent(formattedDate)}`;
  window.open(googleCalendarUrl, "_blank");
}

export function addToICloudCalendar(eventTitle: string, eventDate: Date) {
  const formattedDate =
    eventDate.toISOString().replace(/[-:]/g, "").slice(0, -5) + "Z";
  const iCloudCalendarUrl = `https://www.icloud.com/calendar/event?title=${encodeURIComponent(eventTitle)}&starts=${encodeURIComponent(formattedDate)}`;
  window.open(iCloudCalendarUrl, "_blank");
}

export function addToOutlookCalendar(eventTitle: string, eventDate: Date) {
  const formattedDate =
    eventDate.toISOString().replace(/[-:]/g, "").slice(0, -5) + "Z";
  const outlookCalendarUrl = `https://outlook.live.com/owa/?path=/calendar/action/compose&subject=${encodeURIComponent(eventTitle)}&startdt=${encodeURIComponent(formattedDate)}`;
  window.open(outlookCalendarUrl, "_blank");
}
