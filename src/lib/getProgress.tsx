export const getProgress = (
  startDate: string | undefined,
  endDate: string | undefined,
  currentTime?: Date | undefined,
) => {
  if (!startDate || !endDate) {
    return 0;
  }

  const now = currentTime?.getTime() ?? Date.now();
  const startTimeMs = new Date(startDate).getTime();
  const endTimeMs = new Date(endDate).getTime();

  const totalDuration = endTimeMs - startTimeMs;
  const elapsedTime = now - startTimeMs;

  const progressPercentage = (elapsedTime / totalDuration) * 100;

  return progressPercentage;
};
