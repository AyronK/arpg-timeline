import {
  INTL_LOCAL_DATE,
  INTL_LOCAL_DATETIME,
  INTL_LOCAL_DATETIME_LONG,
} from "@/lib/date";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

interface LocalDateProps {
  utcDate: string;
  dateOnly?: boolean;
  longDate?: boolean;
}

const LocalDate: React.FC<LocalDateProps> = ({
  utcDate,
  dateOnly,
  longDate,
}) => {
  const [localDate, setLocalDate] = useState<string | null>(null);

  useEffect(() => {
    const date = new Date(utcDate);
    setLocalDate(
      dateOnly
        ? INTL_LOCAL_DATE.format(date)
        : longDate
          ? INTL_LOCAL_DATETIME_LONG.format(date)
          : INTL_LOCAL_DATETIME.format(date),
    );
  }, [utcDate]);

  return (
    <span className={cn({ "opacity-0": !localDate })}>
      {localDate ? localDate : `${new Date(utcDate).toUTCString()} UTC`}
    </span>
  );
};

export default LocalDate;
