import { useEffect, useState } from "react";

import { Time } from "@/components/Time";
import { cn } from "@/lib/utils";

const getTimeComponents = (distance: number) => {
    const totalDays = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { days: totalDays, hours, minutes, seconds };
};

export const Countdown = ({
    date,
    testProps,
}: {
    date: Date;
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
