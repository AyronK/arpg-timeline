/* eslint-disable @typescript-eslint/no-explicit-any */
import { DashboardConfig } from "./DashboardConfig";

export class DashboardConfigCompressor {
    async compress(config: DashboardConfig): Promise<string> {
        const compressor = await import("lz-string");
        const json = JSON.stringify(serializeWithNumericKeys(config).transformed, (_, value) => {
            if (value === true) return 1;
            if (value === false) return 0;
            return value;
        });

        return compressor.compressToEncodedURIComponent(json).toString();
    }

    async decompress(compressed: string): Promise<DashboardConfig> {
        const compressor = await import("lz-string");
        const json = compressor.decompressFromEncodedURIComponent(compressed);
        const config = deserializeWithNumericKeys({
            transformed: JSON.parse(json),
            keyMap: [
                "id",
                "alias",
                "preferences",
                "newGamesStrategy",
                "seasonProgressType",
                "widgets",
                "timeline",
                "expanded",
                "visible",
                "zoom",
                "games",
                "hidden",
            ],
        }) as DashboardConfig;

        if (!config.id) {
            throw new Error("Configuration could not be read.");
        }

        return config;
    }
}

function serializeWithNumericKeys(data: any): { transformed: any; keyMap: string[] } {
    const keyMap: string[] = [];

    function transform(obj: any): any {
        if (obj && typeof obj === "object" && !Array.isArray(obj)) {
            const newObj: Record<number, any> = {};
            Object.entries(obj).forEach(([key, value]) => {
                let keyIndex = keyMap.indexOf(key);
                if (keyIndex === -1) {
                    keyMap.push(key);
                    keyIndex = keyMap.length - 1;
                }
                newObj[keyIndex] = transform(value);
            });
            return newObj;
        } else if (Array.isArray(obj)) {
            return obj.map(transform);
        } else {
            return obj;
        }
    }

    const transformed = transform(data);
    return { transformed, keyMap };
}

function deserializeWithNumericKeys({
    transformed,
    keyMap,
}: {
    transformed: any;
    keyMap: string[];
}): any {
    function restore(obj: any): any {
        if (obj && typeof obj === "object" && !Array.isArray(obj)) {
            const restoredObj: Record<string, any> = {};
            Object.entries(obj).forEach(([key, value]) => {
                const originalKey = keyMap[Number(key)];
                restoredObj[originalKey] = restore(value);
            });
            return restoredObj;
        } else if (Array.isArray(obj)) {
            return obj.map(restore);
        } else {
            return obj;
        }
    }

    return restore(transformed);
}
