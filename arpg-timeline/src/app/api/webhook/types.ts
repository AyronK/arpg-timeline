import { SanityImageAssetDocument } from "next-sanity";

import { SeasonEndDateInfo, SeasonStartDateInfo } from "@/lib/cms/queries/indexQuery";

export type SeasonProjection = {
    _id: string;
    _rev: string;
    _type: string;
    name: string;
    game: string;
    gameUrl: string;
    seasonUrl?: string | null;
    patchNotesUrl?: string | null;
    seasonKeyword: string;
    thumbnail: SanityImageAssetDocument;
    start?: SeasonStartDateInfo;
    end?: SeasonEndDateInfo;
    color: string;
};

export type LiveStreamProjection = {
    _id: string;
    _rev: string;
    _type: string;
    name: string;
    date: string;
    game: string;
    gameUrl: string;
    color: string;
    thumbnail: SanityImageAssetDocument;
    twitchUrl: string;
};

export type WebhookProjection = SeasonProjection | LiveStreamProjection;

export type ChangeType = "added" | "date_changed" | "patch_notes_changed" | "name_changed";

export type DetectedChange<T = unknown> = {
    type: ChangeType;
    field?: string;
    oldValue?: T;
    newValue?: T;
    discordMessage: string;
};

