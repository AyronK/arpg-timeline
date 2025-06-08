import React from "react";
import { Stack, Select } from "@sanity/ui";
import { timeZoneMappings } from "../timeZoneMappings";

export const TimezoneSelect: React.FC<{
    selectedAbbr: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ selectedAbbr, onChange }) => {
    return (
        <Stack space={3}>
            <Select value={selectedAbbr} onChange={onChange}>
                {timeZoneMappings.map(({ abbr, description }) => (
                    <option key={abbr + description} value={abbr}>
                        {abbr} – {description}
                    </option>
                ))}
            </Select>
        </Stack>
    );
};
