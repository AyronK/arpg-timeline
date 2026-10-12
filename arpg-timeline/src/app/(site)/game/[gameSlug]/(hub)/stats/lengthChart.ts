const TICK_STEPS = [10, 20, 25, 50, 100, 200];
const MAX_TICKS = 4;

// Round day ticks from 0 up to the first one at or above the longest season
export const buildDayTicks = (maxDays: number): number[] => {
    const step =
        TICK_STEPS.find((s) => Math.ceil(maxDays / s) <= MAX_TICKS) ??
        TICK_STEPS[TICK_STEPS.length - 1];
    const top = Math.max(Math.ceil(maxDays / step), 1) * step;
    return Array.from({ length: top / step + 1 }, (_, i) => i * step);
};

// Index of the first season in each launch year, for x-axis labels
export const yearStarts = (startDates: string[]): { index: number; year: number }[] =>
    startDates.reduce<{ index: number; year: number }[]>((acc, date, index) => {
        const year = new Date(date).getUTCFullYear();
        if (acc[acc.length - 1]?.year !== year) acc.push({ index, year });
        return acc;
    }, []);

export interface YearLabel {
    index: number;
    year: number;
    // Label sits left of its tick (no room on the right)
    flip: boolean;
}

const LABEL_PAD_PX = 4;
const MIN_SPACE_PX = 8;

// Left to right, a year is kept only if its label (flipped at the right edge) clears the previous one
export const fitYearLabels = (
    years: { index: number; year: number }[],
    slotPx: number,
    widthPx: number,
    labelPx: number,
): YearLabel[] => {
    const kept: (YearLabel & { end: number })[] = [];
    for (const y of years) {
        const x = y.index * slotPx;
        const flip = x + LABEL_PAD_PX + labelPx > widthPx;
        const start = flip ? x - LABEL_PAD_PX - labelPx : x + LABEL_PAD_PX;
        const prev = kept[kept.length - 1];
        if (!prev || start - prev.end >= MIN_SPACE_PX) {
            kept.push({ ...y, flip, end: start + labelPx });
        }
    }
    return kept.map(({ index, year, flip }) => ({ index, year, flip }));
};

const quantile = (sorted: number[], q: number): number => {
    const pos = (sorted.length - 1) * q;
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
};

// Longest non-outlier length; bars past it are drawn clipped. Outliers are far out
// (Q3 + 3*IQR) and over twice the median, so short histories don't clip normal variation.
export const scaleCeiling = (values: number[]): number => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = quantile(sorted, 0.25);
    const q3 = quantile(sorted, 0.75);
    const fence = Math.max(q3 + 3 * (q3 - q1), 2 * quantile(sorted, 0.5));
    return Math.max(...sorted.filter((v) => v <= fence));
};
