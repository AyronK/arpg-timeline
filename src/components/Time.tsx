export const Time = ({
  component,
  char,
}: {
  component: string | number;
  char: string;
}) => (
  <span>
    {component}
    <span className="text-sm text-emerald-300 opacity-75 md:text-base">
      {char}
    </span>
  </span>
);
