import React, { useState, useEffect } from "react";
import { formatDate } from "../time";
import { TimezoneInfo } from "./TimezoneInfo";
import { TimezoneSelect } from "./TimezoneSelect";
import { DateTimeInputProps, FormSetPatch, set } from "sanity";
import { Box, Flex, Stack, Grid } from "@sanity/ui";
import { DateTime } from "luxon";
import { getAbbrFromIana } from "../timeZoneMappings";

export const TimezoneDateControl: React.FC<DateTimeInputProps> = ({
    value,
    onChange,
    renderDefault,
    ...rest
}) => {
    const [selectedIana, setSelectedIana] = useState("Etc/UTC");
    const [localDate, setLocalDate] = useState("");

    useEffect(() => {
        if (value) {
            const dt = DateTime.fromISO(value, { zone: "utc" });
            if (dt.isValid) {
                setLocalDate(dt.setZone(selectedIana).toFormat("yyyy-LL-dd'T'HH:mm"));
            } else {
                setLocalDate("");
            }
        } else {
            setLocalDate("");
        }
    }, [value, selectedIana]);

    const handleLocalDateChange = (newLocalDate: string) => {
        setLocalDate(newLocalDate);

        const dt = DateTime.fromFormat(newLocalDate, "yyyy-LL-dd'T'HH:mm", { zone: selectedIana });

        console.log(dt, dt.toUTC().toISO());

        if (dt.isValid) {
            const utcIso = dt.toUTC().toISO();
            onChange(set(utcIso ?? "", []));
        }
    };

    const handleSelectTimezone = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const iana = e.target.value;
        setSelectedIana(iana);

        if (value) {
            const dt = DateTime.fromISO(value, { zone: "utc" });
            if (dt.isValid) {
                setLocalDate(dt.setZone(iana).toFormat("yyyy-LL-dd'T'HH:mm"));
            } else {
                setLocalDate("");
            }
        }
    };

    const previewLocalTime = value ? formatDate(new Date(value), undefined) : "";
    const formattedUtcValue = value ? formatDate(new Date(value), "UTC") : "";
    const formattedLocalTime = value
        ? DateTime.fromISO(value, { zone: "utc" })
              .setZone(selectedIana)
              .toFormat("yyyy-LL-dd HH:mm")
        : "";

    return (
        <Stack space={2}>
            <Grid columns={3} gap={2}>
                <TimezoneInfo label="UTC time" value={formattedUtcValue} />
                <TimezoneInfo label="Local time" value={previewLocalTime} />
                <TimezoneInfo
                    label={`${getAbbrFromIana(selectedIana)} time`}
                    value={formattedLocalTime}
                />
            </Grid>
            <Flex direction="column" gap={2}>
                <Box flex={1}>
                    <TimezoneSelect selectedIana={selectedIana} onChange={handleSelectTimezone} />
                </Box>
                <Box>
                    {renderDefault({
                        ...rest,
                        renderDefault,
                        value: localDate,
                        onChange: (e) => {
                            const utcIso = (e as FormSetPatch)?.value?.toString();

                            if (!utcIso) return;

                            const localDt = DateTime.fromISO(utcIso, {
                                zone: "local",
                            }).toFormat("yyyy-LL-dd'T'HH:mm");

                            handleLocalDateChange(localDt);
                        },
                    })}
                </Box>
            </Flex>
        </Stack>
    );
};
