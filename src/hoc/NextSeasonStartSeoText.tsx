import { SeasonStart } from "@/lib/cms/games.types";

export const NextSeasonStartSeoText = ({
  gameName,
  seasonName,
  seasonKeyword,
  start,
}: {
  gameName: string | null;
  seasonName: string | null;
  seasonKeyword: string;
  start: SeasonStart | null;
}) => {
  if (!gameName) return null;
  const seasonSegment = seasonName
    ? `${seasonKeyword} - ${seasonName} -`
    : seasonKeyword;
  return (
    <>
      <h4>
        When does the next {gameName} {seasonKeyword} start?
      </h4>
      {start?.startDate && start?.confirmed ? (
        <p>{`The next ${gameName} ${seasonSegment} starts ${new Date(start.startDate).toUTCString()}`}</p>
      ) : (
        <p>
          The official launch date of the next {gameName} {seasonKeyword} has
          not been announced yet.{" "}
          {(start?.overrideText || start?.additionalText) && (
            <>
              It is likely starting {start.overrideText || start.additionalText}
            </>
          )}
        </p>
      )}
    </>
  );
};
