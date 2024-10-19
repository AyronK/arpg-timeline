import { ProgressBar } from "@/components/ProgressBar";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { Chip } from "@/ui/Chip";
import { cn } from "@/lib/utils";
import {
  CurrentSeasonChip,
  CurrentSeasonWidgetProps,
} from "@/components/CurrentSeasonWidget/CurrentSeasonWidget.types";

const ChipColorMap: Record<CurrentSeasonChip, string> = {
  live: "bg-sky-800 ",
  over: "bg-amber-800",
  now: "bg-sky-800",
};

const ChipColorText: Record<CurrentSeasonChip, string> = {
  live: "LIVE!",
  over: "Over",
  now: "Now",
};

export const CurrentSeasonWidget = ({
  name,
  chip,
  url,
  progress,
  progressEnd,
  progressStart,
  srCurrentSeason,
  srSeasonStart,
  srSeasonEnd,
  srGameSeason,
  footer,
  ...divProps
}: CurrentSeasonWidgetProps) => {
  return (
    <div
      {...divProps}
      className={cn(divProps.className, "flex flex-col gap-1")}
    >
      <div className="flex flex-col items-stretch gap-1 md:gap-2">
        <div className="flex flex-1 flex-row items-center justify-between gap-2">
          <Chip
            className={cn(
              ChipColorMap[chip],
              "mb-auto w-14 text-center md:mt-1",
            )}
          >
            {ChipColorText[chip]}
          </Chip>
          <h4
            className="flex-1 text-balance text-left font-heading text-sm font-bold text-white md:line-clamp-2 md:text-left md:text-lg"
            title={name}
          >
            <span className="sr-only">{srCurrentSeason}</span>
            <MaybeLinkWrapper
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}
            </MaybeLinkWrapper>
            <span className="sr-only">{srGameSeason}</span>
          </h4>
        </div>
        <div className="flex-1">
          <ProgressBar progress={progress} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row justify-between">
            <div className="text-xs md:text-sm">
              <span className="sr-only">{srSeasonStart}</span>
              {progressStart}
            </div>
            <div className="text-xs md:text-sm">
              <span className="sr-only">{srSeasonEnd}</span>
              {progressEnd}
            </div>
          </div>
          {footer && <div className="mt-1 text-xs md:text-sm">{footer}</div>}
        </div>
      </div>
    </div>
  );
};
