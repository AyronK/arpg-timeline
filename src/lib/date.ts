const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "2-digit",
  hourCycle: "h24",
  hour: "numeric",
  minute: "numeric",
};

const longDateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "2-digit",
  hourCycle: "h24",
  hour: "numeric",
  minute: "numeric",
};

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "2-digit",
};

const locale = "en-US";

export const INTL_LOCAL_DATETIME = new Intl.DateTimeFormat(
  locale,
  dateTimeFormatOptions,
);

export const INTL_LOCAL_DATETIME_LONG = new Intl.DateTimeFormat(
  locale,
  longDateTimeFormatOptions,
);

export const INTL_LOCAL_DATE = new Intl.DateTimeFormat(
  locale,
  dateFormatOptions,
);

export const HOUR = 1000 * 60 * 60;
export const DAY = HOUR * 24;
