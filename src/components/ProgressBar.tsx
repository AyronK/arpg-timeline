export const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div
      className="relative h-3 overflow-hidden rounded-bl-full rounded-tr-full bg-slate-700 subpixel-antialiased"
      style={{ width: "100%" }}
    >
      <div
        className="h-full rounded-bl-full rounded-tr-full bg-slate-300 subpixel-antialiased"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
