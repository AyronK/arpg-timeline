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
    <div className="ml-auto w-[11px] min-w-[11px] max-w-[11px] text-right">
      {String(component).padStart(2, "0")[0]}
    </div>
    <div className="mr-auto w-[11px] min-w-[11px] max-w-[11px] text-left">
      {String(component).padStart(2, "0")[1]}
    </div>
    <span className="text-sm text-emerald-500 md:text-base">{char}</span>
  </div>
);
