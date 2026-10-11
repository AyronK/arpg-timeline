import { describe, expect, it } from "vitest";

import { buildSeasonTerms } from "@/lib/seasonTerms";

import { buildStatsDescription, buildStatsTitle } from "./metadata";

const terms = buildSeasonTerms("league");

describe("stats metadata", () => {
    it("builds a title within the length limit", () => {
        expect(buildStatsTitle("Path of Exile", terms)).toBe(
            "Path of Exile League Statistics: Length & Schedule | aRPG Timeline",
        );
        const long = buildStatsTitle("Torchlight: Infinite Extended Edition", terms);
        expect(long).toBe(
            "Torchlight: Infinite Extended Edition League Statistics | aRPG Timeline",
        );
    });

    it("describes the key numbers", () => {
        expect(
            buildStatsDescription("Path of Exile", terms, {
                averageDurationDays: 108,
                perYear: "3-4",
                count: 47,
            }),
        ).toBe(
            "How long Path of Exile leagues last and how often they launch: 108 days on average, 3-4 new leagues a year. Based on 47 leagues, plus usual launch day and time.",
        );
    });

    it("falls back without numbers", () => {
        expect(
            buildStatsDescription("Path of Exile", terms, {
                averageDurationDays: null,
                perYear: null,
                count: 0,
            }),
        ).toBe(
            "How long Path of Exile leagues last and how often they launch, based on every tracked league.",
        );
    });
});
