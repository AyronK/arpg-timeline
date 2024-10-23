export const ProgressBar = ({
  progress,
  clamp,
}: {
  progress: number;
  clamp?: boolean | undefined;
}) => (
  <div className="relative h-2 w-full overflow-hidden rounded-br-full rounded-tl-full bg-sky-200 bg-opacity-15">
    <div
      className="absolute bottom-0 right-0 top-0 rounded-tl-full bg-sky-800"
      style={{
        left: clamp
          ? `${Math.min(Math.max(progress, 3), 95)}%`
          : `${progress}%`,
      }}
    />
  </div>
);
