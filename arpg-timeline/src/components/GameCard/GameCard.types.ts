import { PropsWithChildren, ReactNode } from "react";

export type Game = {
    readonly slug: string;
    readonly name: string;
    readonly shortName: string | null;
    readonly official: boolean;
    readonly url?: string | null;
    readonly gameLogo: ReactNode;
};

export type GameCardTestProps = TestProps<{
    now?: Date;
    timeLeft?: number;
}>;

export type GameCardProps = PropsWithChildren & GameCardTestProps & Game;
