import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { Chip } from "@/ui/Chip";
import { cn } from "@/lib/utils";
import { NextSeasonWidgetProps } from "@/components/NextSeasonWidget/NextSeasonWidget.types";

export const NextSeasonWidget = ({
  name,
  url,
  srNextSeason,
  srGameSeason,
  action,
  timer,
  startLabel,
  ...divProps
}: NextSeasonWidgetProps) => {
  return (
    <div
      {...divProps}
      className={cn(divProps.className, "flex flex-col gap-4 md:gap-2")}
    >
      <div className="flex flex-1 flex-row items-start gap-4">
        <span className="sr-only">{srNextSeason}</span>
        <div className="flex w-full min-w-0 flex-row-reverse items-start gap-2 font-heading text-lg md:mb-0 md:min-h-[40px] md:flex-row md:items-center">
          <div className="flex h-[1.5em] justify-center md:mb-0">
            <Chip className={"m-auto w-14 bg-emerald-700 text-center"}>
              Next
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
      <div className="flex flex-1 items-center md:min-h-[28px]">
        {timer ? (
          <div className="flex flex-1 flex-col-reverse gap-2">
            <div className="flex flex-row justify-between">
              {startLabel}
              {action}
            </div>
            <div className="flex-1">{timer}</div>
          </div>
        ) : (
          startLabel
        )}
      </div>
    </div>
  );
};
