import React from "react";

export const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div
      className="relative h-3 overflow-hidden rounded-bl-full rounded-tr-full bg-gray-500 subpixel-antialiased"
      style={{ width: "100%" }}
    >
      <div
        className="h-full rounded-bl-full rounded-tr-full bg-gray-200 subpixel-antialiased"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
