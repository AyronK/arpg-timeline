"use client";

import { useEffect, useRef, useState } from "react";

import { fitYearLabels } from "./lengthChart";

// Width of a "2024" label at text-xs
const LABEL_WIDTH_PX = 32;
// Server render and first paint assume a desktop-width chart
const DEFAULT_WIDTH_PX = 800;

export const YearAxis = ({
    years,
    barCount,
}: {
    years: { index: number; year: number }[];
    barCount: number;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(DEFAULT_WIDTH_PX);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const slotPx = width / barCount;
    const labels = fitYearLabels(years, slotPx, width, LABEL_WIDTH_PX);

    return (
        <div ref={ref} className="text-muted-foreground relative mt-0.5 h-5 text-xs tabular-nums">
            {labels.map(({ index, year, flip }) => {
                const left = (index / barCount) * 100;
                return (
                    <span key={year}>
                        <span
                            aria-hidden
                            className="bg-foreground/25 absolute top-0 h-1.5 w-px"
                            style={{ left: `${left}%` }}
                        />
                        <span
                            className="absolute top-1.5 leading-none"
                            style={
                                flip
                                    ? { right: `${100 - left}%`, paddingRight: 4 }
                                    : { left: `${left}%`, paddingLeft: 4 }
                            }
                        >
                            {year}
                        </span>
                    </span>
                );
            })}
        </div>
    );
};
