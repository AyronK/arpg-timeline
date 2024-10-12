import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { Chip } from "@/ui/Chip";
import { cn } from "@/lib/utils";
import { NextSeasonWidgetProps } from "@/components/NextSeasonWidget/NextSeasonWidget.types";

export const NextSeasonWidget = ({
  name,
  url,
  srNextSeason,
  srGameSeason,
  srSeasonStart,
  action,
  timer,
  startLabel,
  footer,
  ...divProps
}: NextSeasonWidgetProps) => {
  return (
    <div
      {...divProps}
      className={cn(divProps.className, "flex flex-col gap-1")}
    >
      <div className="flex flex-1 flex-row items-start gap-4">
        <span className="sr-only">{srNextSeason}</span>
        <div className="flex w-full min-w-0 flex-row items-start justify-between gap-1 md:mb-0 md:items-center md:gap-2">
          <h4
            className="flex-1 text-balance font-heading font-bold text-white md:line-clamp-2 md:text-left md:text-lg"
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
          <Chip className={"mb-auto mt-1 w-14 bg-emerald-800 text-center"}>
            Next
          </Chip>
        </div>
      </div>
      <div className="flex flex-1 items-center md:min-h-[28px]">
        {timer ? (
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="sr-only">{srSeasonStart}</span>
                <div className="text-xs md:text-sm">{startLabel}</div>
                {footer && <div className="text-xs md:text-sm">{footer}</div>}
              </div>
            </div>
            <div className="relative mt-2 flex flex-row overflow-hidden rounded-md before:absolute before:inset-0 before:rounded-md before:border before:border-emerald-600">
              <div className="flex-1">{timer}</div>
              {action}
            </div>
          </div>
        ) : (
          <div>
            <span className="sr-only">{srSeasonStart}</span>
            <div className="text-xs md:text-sm">{startLabel}</div>
            {footer && <div className="text-xs md:text-sm">{footer}</div>}
          </div>
        )}
      </div>
    </div>
  );
};
