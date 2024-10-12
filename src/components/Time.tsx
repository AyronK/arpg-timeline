export const Time = ({
  component,
  char,
}: {
  component: string | number;
  char: string;
}) => (
  <span>
    {component}
    <span className="text-sm opacity-85">{char}</span>
  </span>
);
