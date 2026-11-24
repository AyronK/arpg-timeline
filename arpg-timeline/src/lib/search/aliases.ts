import { SearchCandidate } from "./match";
import { digitsToRoman, normalize, romanToDigits, squash } from "./normalize";
import { SearchGame } from "./types";

export const HARDCODED_ALIASES: Record<string, string[]> = {
    "path-of-exile": ["poe1"],
    "torchlite-infinite": ["tli"],
};

type AliasSource = Pick<SearchGame, "slug" | "name" | "shortName" | "group">;

const acronym = (normalizedName: string) => {
    const words = romanToDigits(normalizedName).split(" ");
    return words.length < 2
        ? null
        : words.map((word) => (/^\d+$/.test(word) ? word : word[0])).join("");
};

export const deriveGameAliases = ({ slug, name, shortName, group }: AliasSource): string[] => {
    const normalizedName = normalize(name);
    const candidates = [
        shortName,
        romanToDigits(normalizedName),
        digitsToRoman(normalizedName),
        acronym(normalizedName),
        ...(HARDCODED_ALIASES[slug] ?? []),
        group,
        slug,
    ];

    const seen = new Set([squash(normalizedName)]);
    return candidates.filter((alias): alias is string => {
        const key = alias ? squash(normalize(alias)) : "";
        if (!key || seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};

export const toGameCandidate = <T extends AliasSource>(game: T): SearchCandidate<T> => ({
    item: game,
    name: game.name,
    aliases: deriveGameAliases(game),
});
