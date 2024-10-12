export const Time = ({
  component,
  char,
  className,
}: {
  component: string | number;
  char: string;
  className?: string | undefined;
}) => (
  <div className={className}>
    {String(component).padStart(2, "0")}
    <span className="text-sm text-emerald-300 opacity-75 md:text-base">
      {char}
    </span>
  </div>
);
