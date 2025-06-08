import React from "react";
import { Card, Stack, Text } from "@sanity/ui";

export const TimezoneInfo: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <Card padding={4} radius={2} shadow={1} tone="transparent" border>
        <Stack space={2}>
            <Text size={1} weight="medium" muted>
                {label}
            </Text>
            <Text size={2}>{value}</Text>
        </Stack>
    </Card>
);
