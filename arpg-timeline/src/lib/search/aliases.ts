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

const deriveNameVariants = (normalizedName: string) => [
    romanToDigits(normalizedName),
    digitsToRoman(normalizedName),
];

const uniqueAliases = (aliases: (string | null)[], seen: Set<string>) =>
    aliases.filter((alias): alias is string => {
        const key = alias ? squash(normalize(alias)) : "";
        if (!key || seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });

const deriveGameCandidate = ({ slug, name, shortName, group }: AliasSource) => {
    const normalizedName = normalize(name);
    const seen = new Set([squash(normalizedName)]);
    const nameVariants = uniqueAliases(deriveNameVariants(normalizedName), seen);
    const aliases = uniqueAliases(
        [shortName, acronym(normalizedName), ...(HARDCODED_ALIASES[slug] ?? []), group, slug],
        seen,
    );
    return { nameVariants, aliases };
};

export const deriveGameAliases = (game: AliasSource): string[] => deriveGameCandidate(game).aliases;

export const toGameCandidate = <T extends AliasSource>(game: T): SearchCandidate<T> => ({
    item: game,
    name: game.name,
    ...deriveGameCandidate(game),
});
