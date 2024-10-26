import { Game } from "@/lib/cms/games.types";
import { DAY } from "@/lib/date";

const GRACE_PERIOD = DAY * 2;

export const inGracePeriod = (startDate: string | null | undefined) => {
  if (!startDate) {
    return false;
  }
  return new Date().getTime() - new Date(startDate).getTime() < GRACE_PERIOD;
};

export const isOver = (endDate: string | null | undefined) => {
  if (!endDate) {
    return false;
  }
  return new Date().getTime() - new Date(endDate).getTime() > 0;
};

export const sortBySeasons = (a: Game, b: Game) => {
  const aIsCurrentSeasonOver =
    a.nextSeason?.start?.startDate === a.nextSeason?.end?.endDate &&
    a.currentSeason?.end?.endDate &&
    isOver(a.currentSeason.end?.endDate);
  const bIsCurrentSeasonOver =
    b.nextSeason?.start?.startDate === b.nextSeason?.end?.endDate &&
    b.currentSeason?.end?.endDate &&
    isOver(b.currentSeason.end?.endDate);

  if (!aIsCurrentSeasonOver && bIsCurrentSeasonOver) {
    return -1;
  }
  if (aIsCurrentSeasonOver && !bIsCurrentSeasonOver) {
    return 1;
  }
  if (
    a.currentSeason?.start?.startDate &&
    inGracePeriod(a.currentSeason.start?.startDate)
  ) {
    return -1;
  }

  if (
    b.currentSeason?.start?.startDate &&
    inGracePeriod(b.currentSeason.start?.startDate)
  ) {
    return 1;
  }

  const aNextSeasonStart = a.nextSeason?.start?.startDate;
  const bNextSeasonStart = b.nextSeason?.start?.startDate;
  const aCurrentSeasonEnd = a.currentSeason?.end?.endDate;
  const bCurrentSeasonEnd = b.currentSeason?.end?.endDate;

  if (aNextSeasonStart && bNextSeasonStart) {
    return (
      new Date(aNextSeasonStart).getTime() -
      new Date(bNextSeasonStart).getTime()
    );
  }
  if (aNextSeasonStart) {
    return -1;
  }
  if (bNextSeasonStart) {
    return 1;
  }
  if (aCurrentSeasonEnd && bCurrentSeasonEnd) {
    return (
      new Date(aCurrentSeasonEnd).getTime() -
      new Date(bCurrentSeasonEnd).getTime()
    );
  }
  if (aCurrentSeasonEnd) {
    return -1;
  }
  if (bCurrentSeasonEnd) {
    return 1;
  }
  return 0;
};
