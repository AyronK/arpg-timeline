import { Game } from "@/lib/cms/games.types";
import { DAY } from "@/lib/date";

const GRACE_PERIOD = DAY * 2;

export const inGracePeriod = (startDate: string) => {
  return new Date().getTime() - new Date(startDate).getTime() < GRACE_PERIOD;
};

export const sortBySeasons = (a: Game, b: Game) => {
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
