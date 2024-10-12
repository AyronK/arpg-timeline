import { ProgressBar } from "@/components/ProgressBar";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { Chip } from "@/ui/Chip";
import { cn } from "@/lib/utils";
import {
  CurrentSeasonChip,
  CurrentSeasonWidgetProps,
} from "@/components/CurrentSeasonWidget/CurrentSeasonWidget.types";

const ChipColorMap: Record<CurrentSeasonChip, string> = {
  live: "bg-teal-700 ",
  over: "bg-slate-700",
  now: "bg-sky-700",
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
  ...divProps
}: CurrentSeasonWidgetProps) => {
  return (
    <div
      {...divProps}
      className={cn(divProps.className, "flex flex-col gap-1")}
    >
      <div className="flex flex-col items-stretch md:gap-2">
        <div className="order-1 flex flex-1 flex-row gap-2">
          <span className="sr-only">{srCurrentSeason}</span>
          <div className="mb-2 flex min-w-0 flex-row-reverse gap-2 font-heading text-lg md:mb-0 md:flex-row">
            <div className="flex h-[1.5em] justify-center md:mb-0">
              <Chip
                className={cn(ChipColorMap[chip], "m-auto w-14 text-center")}
              >
                {ChipColorText[chip]}
              </Chip>
            </div>
            <h4
              className="flex-1 font-heading text-lg text-white md:line-clamp-1"
              title={name}
            >
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
        </div>
        <div className="order-2 mb-1 flex flex-row justify-between md:order-3">
          <div className="text-sm">
            <span className="sr-only">{srSeasonStart}</span>
            {progressStart}
          </div>
          <div className="text-sm">
            <span className="sr-only">{srSeasonEnd}</span>
            {progressEnd}
          </div>
        </div>
        <div className="order-3 flex w-full items-center gap-3 md:order-2">
          <div className="flex-1">
            <ProgressBar progress={progress} />
          </div>
        </div>
      </div>
    </div>
  );
};