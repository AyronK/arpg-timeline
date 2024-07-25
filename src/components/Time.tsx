export const Time = ({
  component,
  char,
}: {
  component: string | number;
  char: string;
}) => (
  <span>
    {component}
    <span className="text-emerald-700 dark:text-emerald-500">{char}</span>
  </span>
);
