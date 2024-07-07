import React, { useEffect, useState } from "react";

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
    <div className="font-mono text-lg font-bold text-emerald-500 flex flex-row gap-1">
      {timeComponents.weeks > 0 && <span>{timeComponents.weeks}W</span>}
      {(timeComponents.days > 0 || timeComponents.weeks > 0) && (
        <span>{timeComponents.days}D</span>
      )}
      {(timeComponents.hours > 0 ||
        timeComponents.days > 0 ||
        timeComponents.weeks > 0) && (
        <span>{String(timeComponents.hours).padStart(2, "0")}H</span>
      )}
      {(timeComponents.minutes > 0 ||
        timeComponents.hours > 0 ||
        timeComponents.days > 0 ||
        timeComponents.weeks > 0) && (
        <span>{String(timeComponents.minutes).padStart(2, "0")}M</span>
      )}
      {(timeComponents.seconds > 0 ||
        timeComponents.minutes > 0 ||
        timeComponents.hours > 0 ||
        timeComponents.days > 0 ||
        timeComponents.weeks > 0) && (
        <span>{String(timeComponents.seconds).padStart(2, "0")}S</span>
      )}
    </div>
  );
};
