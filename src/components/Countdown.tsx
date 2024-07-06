import React, { useEffect, useState } from "react";

export const Countdown = ({ date }: { date: Date }) => {
  const [text, setText] = useState<string>("");
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const targetDate = new Date(date).getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timerInterval);
        setText("Live!");
        return;
      }

      const weeks = Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
      const days = Math.floor(
        (distance % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24),
      );
      const hours = String(
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      ).padStart(2, "0");
      const minutes = String(
        Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      ).padStart(2, "0");
      const seconds = String(
        Math.floor((distance % (1000 * 60)) / 1000),
      ).padStart(2, "0");

      setText(`${weeks}W ${days}D ${hours}H ${minutes}M ${seconds}S`);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [date]);

  return (
    <div className="mt-2 font-mono text-2xl font-bold text-orange-300 ml-auto">
      {text}
    </div>
  );
};
