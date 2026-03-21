"use client";
import { useEffect, useState } from "react";

import { Time } from "@/components/Time";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/Tooltip";

const getTimeComponents = (distance: number) => {
    const totalDays = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000));

    return { days: totalDays, hours, minutes, seconds };
};

export const Countdown = ({
    date,
    variant = "full",
    testProps,
}: {
    date: Date;
    variant?: "full" | "days";
    testProps?: { timeLeft?: number };
}) => {
    const [timeComponents, setTimeComponents] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }>(() => {
        const now = new Date().getTime();
        const targetDate = new Date(date).getTime();
        const distance = testProps?.timeLeft ?? targetDate - now;
        return getTimeComponents(distance);
    });

    useEffect(() => {
        if (variant === "days") {
            return;
        }

        const timerInterval = setInterval(() => {
            const now = new Date().getTime();
            const targetDate = new Date(date).getTime();
            const distance = testProps?.timeLeft ?? targetDate - now;

            if (distance < 0) {
                clearInterval(timerInterval);
                setTimeComponents({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                });
                return;
            }

            setTimeComponents(getTimeComponents(distance));
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [date, testProps?.timeLeft]);

    if (variant === "days") {
        return (
            <Tooltip>
                <TooltipTrigger className="w-full" asChild>
                    <div className="font-heading flex cursor-help flex-row items-center justify-center gap-1 pt-0.5 text-lg font-bold text-emerald-100 select-none md:text-xl">
                        {timeComponents.days < 1 ? (
                            <span suppressHydrationWarning>Today</span>
                        ) : (
                            <>
                                <span className="text-sm text-emerald-600 md:text-base">~</span>
                                <span suppressHydrationWarning>{timeComponents.days}</span>
                                <span className="text-sm text-emerald-600 md:text-base">
                                    {timeComponents.days === 1 ? "day" : "days"}
                                </span>
                            </>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={4}>
                    Exact time is unknown and may vary by timezone or platform.
                </TooltipContent>
            </Tooltip>
        );
    }

    return (
        <>
            <div className="font-heading flex flex-row items-center justify-center gap-1 pt-0.5 text-lg font-bold text-emerald-100 select-none md:text-xl">
                <Time
                    className={cn({
                        "opacity-60": timeComponents.days <= 0,
                    })}
                    component={timeComponents.days}
                    char="D"
                />
                <Time
                    className={cn({
                        "opacity-60": timeComponents.hours <= 0 && timeComponents.days <= 0,
                    })}
                    component={timeComponents.hours}
                    char="H"
                />
                <Time
                    className={cn({
                        "opacity-60":
                            timeComponents.minutes <= 0 &&
                            timeComponents.hours <= 0 &&
                            timeComponents.days <= 0,
                    })}
                    component={timeComponents.minutes}
                    char="M"
                />
                <Time
                    className={cn({
                        "opacity-60":
                            timeComponents.seconds <= 0 &&
                            timeComponents.minutes <= 0 &&
                            timeComponents.hours <= 0 &&
                            timeComponents.days <= 0,
                    })}
                    component={timeComponents.seconds}
                    char="S"
                />
            </div>
        </>
    );
};
