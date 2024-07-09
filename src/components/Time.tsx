import React from "react";

export const Time = ({
  component,
  char,
}: {
  component: string | number;
  char: string;
}) => (
  <span>
    {component}
    <span className="text-emerald-500">{char}</span>
  </span>
);
