import React, { useEffect, useState } from "react";

const getText = (distance: number) => {
  const weeks = Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
  const days = Math.floor(
    (distance % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24),
  );
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const timeComponents = [];
  if (weeks > 0) timeComponents.push(`${weeks}W`);
  if (days > 0 || weeks > 0) timeComponents.push(`${days}D`);
  if (hours > 0 || days > 0 || weeks > 0)
    timeComponents.push(String(hours).padStart(2, "0") + "H");
  if (minutes > 0 || hours > 0 || days > 0 || weeks > 0)
    timeComponents.push(String(minutes).padStart(2, "0") + "M");
  if (seconds > 0 || minutes > 0 || hours > 0 || days > 0 || weeks > 0)
    timeComponents.push(String(seconds).padStart(2, "0") + "S");

  return timeComponents.join(" ");
};

export const Countdown = ({
  date,
  testProps,
}: {
  date: Date;
  testProps?: { timeLeft?: number };
}) => {
  const [text, setText] = useState<string | "live">(" ");
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const targetDate = new Date(date).getTime();
      const distance = testProps?.timeLeft ?? targetDate - now;

      if (distance < 0) {
        clearInterval(timerInterval);
        setText("Live!");
        return;
      }

      setText(getText(distance));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [date]);

  return (
    <div className="font-mono text-lg font-bold text-emerald-500">{text}</div>
  );
};
