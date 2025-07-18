"use client";

import { Selector } from "./types";

export type Selector = "current" | "next";
export const SelectorLabels: Record<Selector, string> = {
    current: "Current",
    next: "The next",
};
