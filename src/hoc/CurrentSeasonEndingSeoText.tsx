import { SeasonEnd } from "@/lib/cms/games.types";

export const CurrentSeasonEndingSeoText = ({
  gameName,
  seasonName,
  seasonKeyword,
  end,
}: {
  gameName: string | null;
  seasonName: string | null;
  seasonKeyword: string;
  end: SeasonEnd | null;
}) => {
  if (!gameName) return null;
  const seasonSegment = seasonName
    ? `${seasonKeyword} - ${seasonName} -`
    : seasonKeyword;
  return (
    <>
      <h4>
        When is the current {gameName} {seasonKeyword} ending?
      </h4>
      {end?.endDate && end?.confirmed ? (
        <p>{`The current ${gameName} ${seasonSegment} is ending ${new Date(end.endDate).toUTCString()}`}</p>
      ) : (
        <p>
          The official end date of the next {gameName} {seasonKeyword} has not
          been announced yet.{" "}
          {(end?.overrideText || end?.additionalText) && (
            <>It is is likely ending {end.overrideText || end.additionalText}</>
          )}
        </p>
      )}
    </>
  );
};
