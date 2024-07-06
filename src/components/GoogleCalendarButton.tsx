import React from "react";

function addToGoogleCalendar(eventTitle: string, eventDate: Date) {
  const formattedDate =
    new Date(eventDate).toISOString().replace(/[-:]/g, "").slice(0, -5) + "Z";
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${encodeURIComponent(formattedDate)}/${encodeURIComponent(formattedDate)}`;
  window.open(googleCalendarUrl, "_blank");
}

export const GoogleCalendarButton = ({
  title,
  date,
}: {
  title: string;
  date: Date;
}) => {
  return (
    <button
      type="button"
      title="Add to google calendar"
      onClick={() => addToGoogleCalendar(title, date)}
    >
      <img
        width="24"
        height="24"
        src="/assets/google-calenda.webp"
        alt="Add to calendar"
      />
    </button>
  );
};
