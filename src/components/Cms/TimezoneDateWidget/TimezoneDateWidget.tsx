import { DateTime } from "luxon";
import React, { useState, useEffect } from "react";
import { timeZoneMappings } from "@/components/Cms/TimezoneDateWidget/timeZoneMappings";
import {
  calculateTimezoneDifference,
  convertToTimezone,
  formatDate,
} from "@/components/Cms/TimezoneDateWidget/time";
import { styles } from "@/components/Cms/TimezoneDateWidget/styles";

type WidgetControlProps = {
  onChange: (v: string) => void;
  value: string;
  classNameWrapper: string;
};
type WidgetPreviewProps = { value: string };

const TimezoneInfo: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div style={styles.info}>
    <strong>{label}:</strong> {value}
  </div>
);

const TimezoneDateInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => (
  <input
    type="datetime-local"
    value={value}
    onChange={onChange}
    style={styles.input}
  />
);

const TimezoneSelect: React.FC<{
  selectedAbbr: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ selectedAbbr, onChange }) => (
  <select value={selectedAbbr} onChange={onChange} style={styles.select}>
    {timeZoneMappings.map(({ abbr, description }) => (
      <option key={abbr} value={abbr}>
        {abbr} – {description}
      </option>
    ))}
  </select>
);

const TimezoneDateControl: React.FC<WidgetControlProps> = ({
  value,
  classNameWrapper,
  onChange,
}) => {
  const [localDate, setLocalDate] = useState("");
  const [selectedAbbr, setSelectedAbbr] = useState("UTC");
  const [utcValue, setUtcValue] = useState(value);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setUtcValue(date);
        updateLocalDate(date, selectedAbbr);
      } else {
        setUtcValue("");
      }
    }
  }, [value, selectedAbbr]);

  const updateLocalDate = (date: Date, timezone: string) => {
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
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date,
    );
    const [month, day, year] = formattedDate.split(", ")[0].split("/");
    const [hour, minute] = formattedDate.split(", ")[1].split(":");
    setLocalDate(`${year}-${month}-${day}T${hour}:${minute}`);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value; // "YYYY-MM-DDTHH:mm"
    const tz = timeZoneMappings.find((t) => t.abbr === selectedAbbr);
    if (!tz || !input) return;

    // Parse the input as a local datetime in the selected timezone
    const dt = DateTime.fromISO(input, { zone: tz.iana });

    // Convert to UTC and get ISO string
    const utcIso = dt.toUTC().toISO();

    setUtcValue(utcIso);
    onChange(utcIso);
  };

  const handleSelectTimezone = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const abbr = e.target.value;
    setSelectedAbbr(abbr);
    if (utcValue) {
      const date = new Date(utcValue);
      updateLocalDate(date, abbr);
    }
  };

  const previewTimeOfSelectedTimeZone = utcValue
    ? convertToTimezone(new Date(utcValue), selectedAbbr)
    : "";
  const previewLocalTime = utcValue
    ? formatDate(new Date(utcValue), undefined)
    : "";
  const formattedUtcValue = utcValue
    ? formatDate(new Date(utcValue), "UTC")
    : "";
  const formattedLocalTime = previewTimeOfSelectedTimeZone || "";

  return (
    <div className={classNameWrapper}>
      <div style={styles.container}>
        <TimezoneInfo label="UTC time" value={formattedUtcValue} />
        <TimezoneInfo label={`Local time`} value={previewLocalTime} />
        <TimezoneInfo
          label={`${selectedAbbr} time`}
          value={formattedLocalTime}
        />
      </div>
      <div style={styles.container}>
        <TimezoneDateInput value={localDate} onChange={handleDateChange} />
        <TimezoneSelect
          selectedAbbr={selectedAbbr}
          onChange={handleSelectTimezone}
        />
      </div>
    </div>
  );
};

const TimezoneDatePreview: React.FC<WidgetPreviewProps> = ({ value }) => {
  return <div>{value}</div>;
};

export const TimezoneDateWidget = {
  name: "timezoneDate",
  controlComponent: TimezoneDateControl,
  previewComponent: TimezoneDatePreview,
};

