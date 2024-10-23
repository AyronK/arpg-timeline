import { PropsWithChildren, ReactNode } from "react";

export type Game = {
  readonly name: string;
  readonly shortName: string | null;
  readonly official: boolean;
  readonly url: string | null;
  readonly logo: ReactNode;
};

export type GameCardTestProps = TestProps<{
  now?: Date;
  timeLeft?: number;
}>;

export type GameCardProps = PropsWithChildren & GameCardTestProps & Game;
