import React from "react";
import { Stack, Select } from "@sanity/ui";
import { timeZoneMappings } from "../timeZoneMappings";

function hasGmtInDescription(abbr: string) {
    const lower = abbr.toLowerCase();
    return lower.includes("gmt");
}

export const TimezoneSelect: React.FC<{
    selectedIana: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ selectedIana, onChange }) => {
    const gmtZones = timeZoneMappings.filter(({ abbr }) => hasGmtInDescription(abbr));
    const nonGmtZones = timeZoneMappings.filter(({ abbr }) => !hasGmtInDescription(abbr));

    const renderOption = ({ iana, abbr, description }: (typeof timeZoneMappings)[0]) => (
        <option key={iana} value={iana}>
            {description.startsWith(abbr) ? description : `${abbr} – ${description}`}
        </option>
    );

    return (
        <Stack space={3}>
            <Select value={selectedIana} onChange={onChange}>
                <optgroup label="Non-GMT Timezones">{nonGmtZones.map(renderOption)}</optgroup>
                <optgroup label="GMT Timezones">{gmtZones.map(renderOption)}</optgroup>
            </Select>
        </Stack>
    );
};
