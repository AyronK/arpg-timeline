export const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-bl-full rounded-tr-full">
      <div
        className="absolute bottom-0 right-0 top-0 bg-sky-200 opacity-60"
        style={{ left: `${progress - 5}%` }}
      />
      <div
        className="absolute inset-0 rounded-bl-full rounded-tr-full bg-sky-800"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
