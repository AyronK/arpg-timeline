export const supportersQuery = `{
  "hallOfFame": *[_type == "supporter" && status == "hallOfFame"] | order(joinedAt asc) {
    name,
    tier,
    hallOfFameTitle,
    hallOfFameNote,
    url
  },
  "active": *[_type == "supporter" && status == "active"] | order(joinedAt asc) {
    name,
    tier,
    url
  },
  "past": *[_type == "supporter" && status == "past"] | order(joinedAt asc) {
    name
  }
}`;

export type SupporterTier = "magic" | "rare" | "exalted" | "unique";

export interface HallOfFameEntry {
    name: string;
    tier?: SupporterTier;
    hallOfFameTitle: string;
    hallOfFameNote?: string;
    url?: string;
}

export interface ActiveSupporter {
    name: string;
    tier: SupporterTier;
    url?: string;
}

export interface PastSupporter {
    name: string;
}

export interface SupportersQueryResult {
    hallOfFame: HallOfFameEntry[];
    active: ActiveSupporter[];
    past: PastSupporter[];
}
