const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hourCycle: "h24",
  hour: "numeric",
  minute: "numeric",
};

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
};

const locale = "en-US";

export const INTL_LOCAL_DATETIME = new Intl.DateTimeFormat(
  locale,
  dateTimeFormatOptions,
);

export const INTL_LOCAL_DATE = new Intl.DateTimeFormat(
  locale,
  dateFormatOptions,
);
