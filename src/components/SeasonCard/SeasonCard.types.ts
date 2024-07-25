import { Game } from "@/lib/cms/games.types";

export type SeasonCardTestProps = TestProps<{
  now?: Date;
  timeLeft?: number;
}>;

export type SeasonCardProps = SeasonCardTestProps & Game;
