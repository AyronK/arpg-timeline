import { capitalizeFirstChar } from "@/lib/capitalizeFirstChar";

import { formatDiscordDate } from "../../../lib/discord/formatDiscordDate";
import { DetectedChange, LiveStreamProjection, SeasonProjection } from "./types";

export function detectLiveStreamChanges(
    current: LiveStreamProjection,
    previous: LiveStreamProjection | null,
): DetectedChange[] {
    const changes: DetectedChange[] = [];

    if (!previous) {
        changes.push({
            type: "added",
            discordMessage: `New stream scheduled`,
        });
        return changes;
    }

    if (current.date !== previous.date) {
        changes.push({
            type: "date_changed",
            field: "date",
            oldValue: previous.date,
            newValue: current.date,
            discordMessage: `Stream date changed to ${formatDiscordDate(new Date(current.date), "f")}`,
        });
    }

    return changes;
}

export function detectSeasonChanges(
    current: SeasonProjection,
    previous: SeasonProjection | null,
): DetectedChange[] {
    const changes: DetectedChange[] = [];

    if (!previous) {
        changes.push({
            type: "added",
            discordMessage: `New ${current.seasonKeyword} added.`,
        });
        return changes;
    }

    if (current.name !== previous.name) {
        changes.push({
            type: "name_changed",
            field: "name",
            oldValue: previous.name,
            newValue: current.name,
            discordMessage: `${capitalizeFirstChar(current.seasonKeyword)} name changed to "${current.name}"`,
        });
    }

    const currentStartConfirmed = !!(current.start?.confirmed && current.start?.startDate);
    const previousStartConfirmed = !!(previous.start?.confirmed && previous.start?.startDate);
    const currentEndConfirmed = !!(current.end?.confirmed && current.end?.endDate);
    const previousEndConfirmed = !!(previous.end?.confirmed && previous.end?.endDate);

    const normalizeDate = (date: string | undefined | null): string | null => {
        if (!date) return null;
        return new Date(date).toISOString();
    };

    const currentStartDate = normalizeDate(current.start?.startDate);
    const previousStartDate = normalizeDate(previous.start?.startDate);
    const currentEndDate = normalizeDate(current.end?.endDate);
    const previousEndDate = normalizeDate(previous.end?.endDate);

    if (
        currentStartConfirmed !== previousStartConfirmed ||
        (currentStartConfirmed && previousStartConfirmed && currentStartDate !== previousStartDate)
    ) {
        changes.push({
            type: "date_changed",
            field: "start_date",
            oldValue: previousStartDate,
            newValue: currentStartDate,
            discordMessage: currentStartConfirmed
                ? `Start date ${previousStartConfirmed ? "updated to" : "confirmed for"} ${formatDiscordDate(new Date(current.start!.startDate!), "f")}`
                : `Start date confirmation removed`,
        });
    }

    if (
        currentEndConfirmed !== previousEndConfirmed ||
        (currentEndConfirmed && previousEndConfirmed && currentEndDate !== previousEndDate)
    ) {
        changes.push({
            type: "date_changed",
            field: "end_date",
            oldValue: previousEndDate,
            newValue: currentEndDate,
            discordMessage: currentEndConfirmed
                ? `End date ${previousEndConfirmed ? "updated to" : "confirmed for"} ${formatDiscordDate(new Date(current.end!.endDate!), "f")}`
                : `End date confirmation removed`,
        });
    }

    if (current.patchNotesUrl !== previous.patchNotesUrl) {
        changes.push({
            type: "patch_notes_changed",
            field: "patchNotesUrl",
            oldValue: previous.patchNotesUrl,
            newValue: current.patchNotesUrl,
            discordMessage: current.patchNotesUrl
                ? previous.patchNotesUrl
                    ? "Patch notes link updated"
                    : "Patch notes link added"
                : "Patch notes link removed",
        });
    }

    if (current.seasonUrl !== previous.seasonUrl) {
        changes.push({
            type: "patch_notes_changed",
            field: "seasonUrl",
            oldValue: previous.seasonUrl,
            newValue: current.seasonUrl,
            discordMessage: current.seasonUrl
                ? previous.seasonUrl
                    ? "Season link updated"
                    : "Season link added"
                : "Season link removed",
        });
    }

    return changes;
}
