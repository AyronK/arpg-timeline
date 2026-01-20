"use client";

interface GameCountDisplayProps {
    shownGames: number;
    totalGames: number;
}

export const GameCountDisplay = ({ shownGames, totalGames }: GameCountDisplayProps) => {
    return (
        <div className="text-muted-foreground text-right text-sm">
            <span>
                <span className="text-foreground inline-block origin-bottom-right font-medium transition-all duration-300 ease-in-out">
                    {shownGames}
                </span>
                &nbsp;
                <span className="text-muted-foreground">
                    of <span className="text-foreground font-medium">{totalGames}</span> games shown
                </span>
            </span>
        </div>
    );
};
