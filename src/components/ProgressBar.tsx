import React from "react";

export const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div
      className="h-4 mt-2 bg-gray-500 rounded-full overflow-hidden relative"
      style={{ width: "100%" }}
    >
      <div 
        className="h-full bg-emerald-200 rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
