import { Game } from "@/lib/cms/games.types";
import { HARDCODED_ALIASES } from "@/lib/search/aliases";
import { normalize, romanToDigits, squash } from "@/lib/search/normalize";

type NameSource = Pick<Game, "slug" | "name" | "shortName">;

// "Diablo II: Resurrected" -> "Diablo 2 Resurrected"; a lone "I" is a word, not a numeral
const withDigitNumerals = (name: string) => {
    let changed = false;
    const words = name.split(" ").map((word) => {
        const bare = word.replace(/[:,]$/, "");
        if (bare === "I" || !/^[IVX]+$/.test(bare)) return word;
        const digits = romanToDigits(bare.toLowerCase());
        if (digits === bare.toLowerCase()) return word;
        changed = true;
        return digits;
    });
    return changed ? words.join(" ").replace(/:/g, "") : null;
};

export const getGameAlternateNames = ({ slug, name, shortName }: NameSource): string[] => {
    const seen = new Set([squash(normalize(name))]);
    const candidates = [
        shortName,
        withDigitNumerals(name),
        ...(HARDCODED_ALIASES[slug] ?? []).map((alias) => alias.toUpperCase()),
    ];
    return candidates.filter((candidate): candidate is string => {
        const key = candidate ? squash(normalize(candidate)) : "";
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

export const getGameNickname = ({ name, shortName }: NameSource): string | null =>
    shortName && squash(normalize(shortName)) !== squash(normalize(name)) ? shortName : null;
