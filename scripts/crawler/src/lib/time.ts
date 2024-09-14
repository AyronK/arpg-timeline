export const isAtMost12HoursAgo = (date: Date): boolean => {
  const today = new Date();
  const _12hoursInMillis = 12 * 60 * 60 * 1000;
  return today.getTime() - date.getTime() <= _12hoursInMillis;
};

