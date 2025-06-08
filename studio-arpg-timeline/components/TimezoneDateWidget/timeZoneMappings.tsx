import { DateTime, IANAZone } from "luxon";

export type TimeZoneMapping = {
    abbr: string;
    iana: string;
    description: string;
    offset: number;
};

const YEAR = 2024;
const WINTER_MONTH = 1;
const SUMMER_MONTH = 7;

const rawZones = Intl.supportedValuesOf("timeZone").filter(IANAZone.isValidZone);

const customZones: TimeZoneMapping[] = [
    { abbr: "UTC", iana: "Etc/UTC", description: "Coordinated Universal Time", offset: 0 },
    {
        abbr: "EST",
        iana: "America/New_York",
        description: "Eastern Standard Time (North America)",
        offset: 0,
    },
    {
        abbr: "CST",
        iana: "America/Chicago",
        description: "Central Standard Time (North America)",
        offset: 0,
    },
    {
        abbr: "PST / PDT",
        iana: "America/Los_Angeles",
        description: "Pacific Standard Time (North America)",
        offset: 0,
    },
    { abbr: "JST", iana: "Asia/Tokyo", description: "Japan Standard Time", offset: 0 },
    { abbr: "CET / CEST", iana: "Europe/Paris", description: "Central European Time", offset: 0 },
    { abbr: "CST", iana: "Asia/Shanghai", description: "China Standard Time", offset: 0 },
];

function getOffset(iana: string): number {
    return DateTime.fromObject({ year: YEAR, month: SUMMER_MONTH, day: 1 }, { zone: iana }).offset;
}

function formatOffset(offsetMinutes: number): string {
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const absMinutes = Math.abs(offsetMinutes);
    const hours = String(Math.floor(absMinutes / 60)).padStart(2, "0");
    const minutes = String(absMinutes % 60).padStart(2, "0");
    return `GMT${sign}${hours}:${minutes}`;
}

function getAbbrWithDst(iana: string): string {
    const winter = DateTime.fromObject({ year: YEAR, month: WINTER_MONTH, day: 1 }, { zone: iana });
    const summer = DateTime.fromObject({ year: YEAR, month: SUMMER_MONTH, day: 1 }, { zone: iana });

    const winterAbbr = winter.offsetNameShort;
    const summerAbbr = summer.offsetNameShort;

    return winterAbbr !== summerAbbr ? `${winterAbbr}/${summerAbbr}` : winterAbbr;
}

customZones.forEach((cz) => {
    cz.offset = getOffset(cz.iana);
});

const customIanas = new Set(customZones.map((cz) => cz.iana));

const generatedZones: TimeZoneMapping[] = rawZones
    .filter((iana) => !customIanas.has(iana))
    .map((iana) => {
        const offset = getOffset(iana);
        const abbr = getAbbrWithDst(iana);
        return {
            iana,
            abbr,
            description: abbr,
            offset,
        };
    });

const customAbbrs = new Set(customZones.map((cz) => cz.abbr));
const seenAbbrs = new Set<string>(customAbbrs);

const filteredGeneratedZones = generatedZones.filter((zone) => {
    if (seenAbbrs.has(zone.abbr)) return false;
    seenAbbrs.add(zone.abbr);
    return true;
});

[...customZones, ...filteredGeneratedZones].forEach((zone) => {
    const descLower = zone.description.toLowerCase();
    if (!descLower.includes("gmt") && !descLower.includes("utc")) {
        zone.description += ` (${formatOffset(zone.offset)})`;
    }
});

function hasGmtInAbbr(abbr: string): boolean {
    const lower = abbr.toLowerCase();
    return lower.includes("gmt") || lower.includes("utc");
}

export const timeZoneMappings = [...customZones, ...filteredGeneratedZones].sort((a, b) => {
    const aIsCustom = customIanas.has(a.iana);
    const bIsCustom = customIanas.has(b.iana);

    const aHasGmt = hasGmtInAbbr(a.abbr);
    const bHasGmt = hasGmtInAbbr(b.abbr);

    const aGroup1 = aIsCustom || !aHasGmt;
    const bGroup1 = bIsCustom || !bHasGmt;

    if (aGroup1 !== bGroup1) {
        return aGroup1 ? -1 : 1;
    }

    return a.offset - b.offset;
});

export function getAbbrFromIana(iana: string): string | undefined {
    const zone = timeZoneMappings.find((z) => z.iana === iana);
    return zone?.abbr;
}
