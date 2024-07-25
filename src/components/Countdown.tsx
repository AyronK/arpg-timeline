import { useEffect, useState } from "react";
import { Time } from "@/components/Time";

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
  }>({
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
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
    <div className="flex flex-row gap-1 font-mono text-lg font-bold text-emerald-500 dark:text-emerald-300">
      {timeComponents.weeks > 0 && (
        <Time component={timeComponents.weeks} char="W" />
      )}
      {(timeComponents.days > 0 || timeComponents.weeks > 0) && (
        <Time component={timeComponents.days} char="D" />
      )}
      {(timeComponents.hours > 0 ||
        timeComponents.days > 0 ||
        timeComponents.weeks > 0) && (
        <Time
          component={String(timeComponents.hours).padStart(2, "0")}
          char="H"
        />
      )}
      {(timeComponents.minutes > 0 ||
        timeComponents.hours > 0 ||
        timeComponents.days > 0 ||
        timeComponents.weeks > 0) && (
        <Time
          component={String(timeComponents.minutes).padStart(2, "0")}
          char="M"
        />
      )}
      {(timeComponents.seconds > 0 ||
        timeComponents.minutes > 0 ||
        timeComponents.hours > 0 ||
        timeComponents.days > 0 ||
        timeComponents.weeks > 0) && (
        <Time
          component={String(timeComponents.seconds).padStart(2, "0")}
          char="S"
        />
      )}
    </div>
  );
};
