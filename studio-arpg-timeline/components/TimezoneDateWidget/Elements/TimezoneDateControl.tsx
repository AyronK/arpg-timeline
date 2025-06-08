import React, { useState, useEffect } from "react";
import { calculateLocalDate, convertFromTimeZoneToUtc, formatDate } from "../time";
import { TimezoneInfo } from "./TimezoneInfo";
import { TimezoneSelect } from "./TimezoneSelect";
import { DateTimeInputProps, FormSetPatch, set } from "sanity";
import { Box, Flex, Stack, Grid } from "@sanity/ui";

export const TimezoneDateControl: React.FC<DateTimeInputProps> = ({
    value,
    onChange,
    renderDefault,
    ...rest
}) => {
    const [localDate, setLocalDate] = useState("");
    const [selectedAbbr, setSelectedAbbr] = useState("UTC");
    const [utcValue, setUtcValue] = useState<string>(value ?? "");

    useEffect(() => {
        if (value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                setUtcValue(date.toISOString());
                setLocalDate(calculateLocalDate(date, selectedAbbr));
            } else {
                setUtcValue("");
            }
        }
    }, [value, selectedAbbr]);

    const handleDateChange = (v: string) => {
        const utcIso = convertFromTimeZoneToUtc(v, selectedAbbr);

        setUtcValue(utcIso);
        onChange(set(utcIso, []));
    };

    const handleSelectTimezone = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const abbr = e.target.value;
        setSelectedAbbr(abbr);
        if (utcValue) {
            const date = new Date(utcValue);
            setLocalDate(calculateLocalDate(date, abbr));
        }
    };

    const previewLocalTime = utcValue ? formatDate(new Date(utcValue), undefined) : "";
    const formattedUtcValue = utcValue ? formatDate(new Date(utcValue), "UTC") : "";
    const formattedLocalTime = formatDate(new Date(utcValue), selectedAbbr) || "";

    return (
        <Stack space={2}>
            <Grid columns={3} gap={4}>
                <TimezoneInfo label="UTC time" value={formattedUtcValue} />
                <TimezoneInfo label="Local time" value={previewLocalTime} />
                <TimezoneInfo label={`${selectedAbbr} time`} value={formattedLocalTime} />
            </Grid>
            <Flex direction="row" gap={2}>
                <Box>
                    {renderDefault({
                        ...rest,
                        value: localDate,
                        renderDefault,
                        onChange: (e) => {
                            handleDateChange((e as FormSetPatch)?.value?.toString());
                        },
                    })}
                </Box>
                <Box flex={1}>
                    <TimezoneSelect selectedAbbr={selectedAbbr} onChange={handleSelectTimezone} />
                </Box>
            </Flex>
        </Stack>
    );
};
