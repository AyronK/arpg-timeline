"use client";

import { useEffect, useRef, useState } from "react";

interface GameCountDisplayProps {
    shownGames: number;
    totalGames: number;
    dashboard: string;
}

export const GameCountDisplay = ({ shownGames, totalGames, dashboard }: GameCountDisplayProps) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [displayedNumber, setDisplayedNumber] = useState(shownGames);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (displayedNumber !== shownGames) {
            setIsAnimating(true);
            setDisplayedNumber(shownGames);

            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 750);

            return () => clearTimeout(timer);
        }
    }, [shownGames, displayedNumber]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 750);

        return () => clearTimeout(timer);
    }, [dashboard]);

    return (
        <div className="text-muted-foreground text-right text-sm">
            <span>
                <span
                    className={`inline-block origin-bottom-right font-medium transition-all duration-300 ease-in-out ${
                        isAnimating ? "text-warning scale-150" : "text-foreground"
                    }`}
                >
                    {displayedNumber}
                </span>
                &nbsp;
                <span className="text-muted-foreground">
                    of <span className="text-foreground font-medium">{totalGames}</span> games shown
                </span>
            </span>
        </div>
    );
};
