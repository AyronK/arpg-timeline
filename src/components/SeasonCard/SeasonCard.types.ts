import { Game, Season } from "@/lib/cms/games.types";

export type CurrentSeason = Season & {
  justStarted?: boolean;
};

export type SeasonCardTestProps = TestProps<{
  now?: Date;
  timeLeft?: number;
}>;

export type SeasonCardProps = SeasonCardTestProps &
  Replace<Game, "currentSeason", CurrentSeason>;
