import { ProgressBar } from "@/components/ProgressBar";
import { MaybeLinkWrapper } from "@/components/MaybeLinkWrapper";
import { Chip } from "@/ui/Chip";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CurrentSeasonChip = "over" | "now" | "live";

export type SeasonCardProps = {
  readonly chip: CurrentSeasonChip;
  readonly labelStart?: ReactNode | undefined;
  readonly labelEnd?: ReactNode | undefined;
  readonly progress: number;
  readonly url?: string | null;
  readonly name: string;
  readonly seasonKeyword: string | null;
  readonly gameName: string;
  readonly gameShortName: string;
};

const ChipColorMap: Record<CurrentSeasonChip, string> = {
  live: "bg-teal-800 ",
  over: "bg-slate-500",
  now: "bg-sky-700",
};

const ChipColorText: Record<CurrentSeasonChip, string> = {
  live: "LIVE!",
  over: "Over",
  now: "Now",
};

export const CurrentSeasonWidget = ({
  name,
  seasonKeyword,
  gameName,
  gameShortName,
  chip,
  url,
  progress,
  labelEnd,
  labelStart,
}: SeasonCardProps) => {
  return (
    <div
      aria-label={`Current ${seasonKeyword}`}
      className="flex flex-col gap-1"
    >
      <div className="flex gap-4 max-sm:items-end sm:flex-col sm:gap-1">
        <div className="flex flex-1 flex-row gap-2">
          <span className="sr-only">{`What is the current ${gameName} ${seasonKeyword}?`}</span>
          <div className="flex min-w-0 flex-col md:flex-row md:gap-2">
            <div className="flex justify-center">
              <Chip className={cn(ChipColorMap[chip], "m-auto")}>
                {ChipColorText[chip]}
              </Chip>
            </div>
            <h4
              className="flex-1 font-heading text-lg md:line-clamp-1"
              title={name}
            >
              <MaybeLinkWrapper
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {name}
              </MaybeLinkWrapper>
            </h4>
            {gameShortName && (
              <span className="sr-only">{`${gameShortName} ${name} ${seasonKeyword}`}</span>
            )}
          </div>
        </div>
        <div className="flex w-full items-center gap-1">
          <div className="flex-1">
            <ProgressBar progress={progress} />
          </div>
        </div>
        <div className="flex flex-row justify-end sm:justify-between">
          <div className="col-span-4 hidden flex-col gap-1 sm:flex">
            <span className="sr-only">{`When did the current ${gameName} ${seasonKeyword} start?`}</span>
            <div className="flex flex-row gap-2 text-sm">{labelStart}</div>
          </div>
          <div>
            <span className="sr-only">{`When is the current ${gameName} ${seasonKeyword} ending?`}</span>
            <div className="flex flex-row-reverse gap-2 text-sm max-sm:leading-6">
              {labelEnd}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
