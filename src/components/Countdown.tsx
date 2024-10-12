import { useEffect, useState } from "react";
import { Time } from "@/components/Time";
import { cn } from "@/lib/utils";

const getTimeComponents = (distance: number) => {
  const weeks = Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
  const days = Math.floor(
    (distance % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24),
  );
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { weeks, days, hours, minutes, seconds };
};

export const Countdown = ({
  date,
  testProps,
}: {
  date: Date;
  testProps?: { timeLeft?: number };
}) => {
  const [timeComponents, setTimeComponents] = useState<{
    weeks: number;
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
          weeks: 0,
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
    <div className="flex select-none flex-row items-center justify-center gap-1 px-5 pt-0.5 font-heading text-lg font-bold text-foreground md:text-2xl">
      <Time
        className={cn({ "opacity-60": timeComponents.weeks <= 0 })}
        component={timeComponents.weeks}
        char="W"
      />
      <Time
        className={cn({ "opacity-60": timeComponents.days <= 0 })}
        component={timeComponents.days}
        char="D"
      />
      <Time
        className={cn({ "opacity-60": timeComponents.hours <= 0 })}
        component={timeComponents.hours}
        char="H"
      />
      <Time
        className={cn({ "opacity-60": timeComponents.minutes <= 0 })}
        component={timeComponents.minutes}
        char="M"
      />
      <Time
        className={cn({ "opacity-60": timeComponents.seconds <= 0 })}
        component={timeComponents.seconds}
        char="S"
      />
    </div>
  );
};
