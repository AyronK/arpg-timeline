export const ProgressBar = ({
  progress,
  clamp,
}: {
  progress: number;
  clamp?: boolean | undefined;
}) => (
  <div className="relative h-2 w-full overflow-hidden rounded-tl-full rounded-br-full bg-sky-200/15">
    <div
      className="absolute top-0 right-0 bottom-0 rounded-tl-full bg-sky-800"
      style={{
        left:
          progress >= 100
            ? "100%"
            : clamp
              ? `${Math.min(Math.max(progress, 3), 95)}%`
              : `${progress}%`,
      }}
    />
  </div>
);
