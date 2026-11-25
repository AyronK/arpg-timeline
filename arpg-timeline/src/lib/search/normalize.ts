const DIACRITICS = /[̀-ͯ]/g;
const ROMAN_NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];

const foldChar = (char: string) => char.normalize("NFD").replace(DIACRITICS, "").toLowerCase();

export const normalize = (text: string) =>
    foldChar(text)
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

export const squash = (normalized: string) => normalized.replace(/ /g, "");

const mapWords = (normalized: string, fn: (word: string) => string) =>
    normalized.split(" ").map(fn).join(" ");

export const romanToDigits = (normalized: string) =>
    mapWords(normalized, (word) => {
        const index = ROMAN_NUMERALS.indexOf(word);
        return index === -1 ? word : String(index + 1);
    });

export const digitsToRoman = (normalized: string) =>
    mapWords(normalized, (word) =>
        /^\d+$/.test(word) ? (ROMAN_NUMERALS[+word - 1] ?? word) : word,
    );

export const normalizeWithMap = (text: string) => {
    let normalized = "";
    const map: number[] = [];
    for (let i = 0; i < text.length; i++) {
        for (const char of foldChar(text[i]!)) {
            if (/[a-z0-9]/.test(char)) {
                normalized += char;
                map.push(i);
            } else if (normalized && !normalized.endsWith(" ")) {
                normalized += " ";
                map.push(i);
            }
        }
    }
    if (normalized.endsWith(" ")) {
        normalized = normalized.slice(0, -1);
        map.pop();
    }
    return { normalized, map };
};
