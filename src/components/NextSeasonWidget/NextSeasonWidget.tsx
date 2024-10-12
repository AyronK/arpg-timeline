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
        <div className="flex w-full min-w-0 flex-row items-start justify-between gap-2 font-heading text-lg md:mb-0 md:items-center">
          <h4
            className="flex-1 text-balance font-heading text-lg text-white md:line-clamp-1 md:text-left"
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
          <Chip className={"mb-auto mt-1 w-14 bg-emerald-700 text-center"}>
            Next
          </Chip>
        </div>
      </div>
      <div className="flex flex-1 items-center md:min-h-[28px]">
        {timer ? (
          <div className="flex flex-1 flex-col-reverse gap-1">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="sr-only">{srSeasonStart}</span>
                <div className="text-sm">{startLabel}</div>
                {footer && <div className="text-sm">{footer}</div>}
              </div>
              {action}
            </div>
            <div className="mb-1 mb-2 mt-2 flex-1 md:mt-4">{timer}</div>
          </div>
        ) : (
          <div>
            <span className="sr-only">{srSeasonStart}</span>
            <div className="text-sm">{startLabel}</div>
            {footer && <div className="text-sm">{footer}</div>}
          </div>
        )}
      </div>
    </div>
  );
};
