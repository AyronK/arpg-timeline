import { createEvent } from "ics";

export async function downloadICSFile(eventTitle: string, eventDate: Date) {
  const formattedDate = new Date(eventDate);
  const fileName = `${eventTitle}.ics`;
  const event = {
    title: eventTitle,
    start: [
      formattedDate.getFullYear(),
      formattedDate.getMonth() + 1,
      formattedDate.getDate(),
      formattedDate.getHours(),
      formattedDate.getMinutes(),
    ],
  };

  const file = await new Promise((resolve, reject) => {
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
  const startDateTime = eventDate.toISOString();
  const endDateTime = new Date(eventDate.getTime() + 3600000).toISOString(); // Adding 1 hour for end time
  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventTitle)}&startdt=${encodeURIComponent(startDateTime)}&enddt=${encodeURIComponent(endDateTime)}&allday=false&body=&location=`;
  window.open(outlookCalendarUrl, "_blank");
}
