import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { Chip } from "@/ui/Chip";
import { cn } from "@/lib/utils";
import {
  SeasonChip,
  SeasonWidgetProps,
} from "@/components/SeasonWidget/SeasonWidget.types";

const ChipColorMap: Record<SeasonChip, string> = {
  live: "bg-sky-800 border border-sky-300",
  over: "bg-amber-800 border border-transparent",
  now: "bg-sky-800 border border-transparent",
  next: "bg-emerald-800 border border-transparent",
};

const ChipColorText: Record<SeasonChip, string> = {
  live: "LIVE",
  over: "Over",
  now: "Now",
  next: "Next",
};

export const SeasonWidget = ({
  name,
  url,
  children,
  chip,
  ...divProps
}: SeasonWidgetProps) => {
  return (
    <div
      {...divProps}
      className={cn(divProps.className, "flex flex-1 flex-col gap-2")}
    >
      <div className="flex w-full flex-row items-center justify-between gap-2 text-xs">
        <Chip
          className={cn(
            ChipColorMap[chip],
            "mb-auto min-h-[1em] w-12 text-center",
          )}
        >
          {ChipColorText[chip]}
        </Chip>
        <h4 className="font-heading text-foreground flex-1 md:text-sm">
          <MaybeLinkWrapper
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {name}
          </MaybeLinkWrapper>
        </h4>
      </div>
      <div className="flex flex-1 flex-col gap-2">{children}</div>
    </div>
  );
};
