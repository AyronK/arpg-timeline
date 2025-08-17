import { capitalizeFirstChar } from "@/lib/capitalizeFirstChar";

import { formatDiscordDate } from "../../../lib/discord/formatDiscordDate";
import { DetectedChange, LiveStreamProjection, SeasonProjection } from "./sanity";

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

    const currentStartConfirmed = current.start?.confirmed && current.start?.startDate;
    const previousStartConfirmed = previous.start?.confirmed && previous.start?.startDate;
    const currentEndConfirmed = current.end?.confirmed && current.end?.endDate;
    const previousEndConfirmed = previous.end?.confirmed && previous.end?.endDate;

    if (
        currentStartConfirmed !== previousStartConfirmed ||
        (currentStartConfirmed &&
            previousStartConfirmed &&
            current.start?.startDate !== previous.start?.startDate)
    ) {
        changes.push({
            type: "date_changed",
            field: "start_date",
            oldValue: previousStartConfirmed ? previous.start?.startDate : null,
            newValue: currentStartConfirmed ? current.start?.startDate : null,
            discordMessage: currentStartConfirmed
                ? `Start date ${previousStartConfirmed ? "updated to" : "confirmed for"} ${formatDiscordDate(new Date(current.start!.startDate!), "f")}`
                : `Start date confirmation removed`,
        });
    }

    if (
        currentEndConfirmed !== previousEndConfirmed ||
        (currentEndConfirmed &&
            previousEndConfirmed &&
            current.end?.endDate !== previous.end?.endDate)
    ) {
        changes.push({
            type: "date_changed",
            field: "end_date",
            oldValue: previousEndConfirmed ? previous.end?.endDate : null,
            newValue: currentEndConfirmed ? current.end?.endDate : null,
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
