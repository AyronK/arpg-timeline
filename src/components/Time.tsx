import { cn } from "@/lib/utils";

export const Time = ({
  component,
  char,
  className,
}: {
  component: string | number;
  char: string;
  className?: string | undefined;
}) => (
  <div className={cn(className, "flex flex-row items-end gap-1")}>
    <div className="ml-auto w-[30px] min-w-[30px] max-w-[30px] text-center tabular-nums tracking-wider">
      {String(component).padStart(2, "0")}
    </div>
    <span className="text-sm text-emerald-500 md:text-base">{char}</span>
  </div>
);
