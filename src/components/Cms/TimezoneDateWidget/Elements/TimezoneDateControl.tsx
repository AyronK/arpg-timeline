import React, { useState, useEffect } from "react";
import { styles } from "@/components/Cms/TimezoneDateWidget/styles";
import {
  calculateLocalDate,
  convertFromTimeZoneToUtc,
  formatDate,
} from "@/components/Cms/TimezoneDateWidget/time";
import { TimezoneDateInput } from "@/components/Cms/TimezoneDateWidget/Elements/TimezoneDateInput";
import { WidgetControlProps } from "@/components/Cms/TimezoneDateWidget/TimezoneDateWidget";
import { TimezoneInfo } from "@/components/Cms/TimezoneDateWidget/Elements/TimezoneInfo";
import { TimezoneSelect } from "@/components/Cms/TimezoneDateWidget/Elements/TimezoneSelect";

export const TimezoneDateControl: React.FC<WidgetControlProps> = ({
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
        setLocalDate(calculateLocalDate(date, selectedAbbr));
      } else {
        setUtcValue("");
      }
    }
  }, [value, selectedAbbr]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const utcIso = convertFromTimeZoneToUtc(e.target.value, selectedAbbr);

    setUtcValue(utcIso);
    onChange(utcIso);
  };

  const handleSelectTimezone = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const abbr = e.target.value;
    setSelectedAbbr(abbr);
    if (utcValue) {
      const date = new Date(utcValue);
      setLocalDate(calculateLocalDate(date, abbr));
    }
  };

  const previewLocalTime = utcValue
    ? formatDate(new Date(utcValue), undefined)
    : "";
  const formattedUtcValue = utcValue
    ? formatDate(new Date(utcValue), "UTC")
    : "";
  const formattedLocalTime = formatDate(new Date(utcValue), selectedAbbr) || "";

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

