import React from "react";
import { createEvent } from "ics";

async function downloadICSFile(eventTitle: string, eventDate: Date) {
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

export const ICSCalendarButton = ({
  title,
  date,
}: {
  title: string;
  date: Date;
}) => {
  return (
    <button
      type="button"
      title="Download ICS Calendar file"
      onClick={() => downloadICSFile(title, date)}
    >
      <img
        width="20"
        height="20"
        src="/assets/ics-logo.svg"
        alt="Add to calendar"
      />
    </button>
  );
};
