import React, { useState, useEffect } from "react";

interface LocalDateProps {
  utcDate: string;
}

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  hourCycle: "h24",
  hour: "numeric",
  minute: "numeric",
};

const locale = "en-US";
const localIntl = new Intl.DateTimeFormat(locale, dateFormatOptions);

const LocalDate: React.FC<LocalDateProps> = ({ utcDate }) => {
  const [localDate, setLocalDate] = useState<string | null>(null);

  useEffect(() => {
    const date = new Date(utcDate);
    setLocalDate(localIntl.format(date));
  }, [utcDate]);

  return (
    <span>
      {localDate ? localDate : `${new Date(utcDate).toUTCString()} UTC`}
    </span>
  );
};

export default LocalDate;
