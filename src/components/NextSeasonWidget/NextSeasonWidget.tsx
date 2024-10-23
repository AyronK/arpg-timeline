import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { Chip } from "@/ui/Chip";
import { cn } from "@/lib/utils";
import { NextSeasonWidgetProps } from "@/components/NextSeasonWidget/NextSeasonWidget.types";

export const NextSeasonWidget = ({
  name,
  url,
  srNextSeason,
  srGameSeason,
  children,
  ...divProps
}: NextSeasonWidgetProps) => {
  return (
    <div
      {...divProps}
      className={cn(divProps.className, "flex flex-col gap-2 md:gap-1")}
    >
      <div className="flex flex-1 flex-row items-start gap-4">
        <span className="sr-only">{srNextSeason}</span>
        <div className="flex w-full min-w-0 flex-row items-center justify-between gap-1 md:mb-0 md:items-center md:gap-2">
          <Chip className={"mb-auto w-12 bg-emerald-800 text-center md:mt-1"}>
            Next
          </Chip>
          <h4
            className="flex-1 font-heading text-sm text-foreground md:line-clamp-2 md:text-left md:text-base"
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
      {children}
    </div>
  );
};
