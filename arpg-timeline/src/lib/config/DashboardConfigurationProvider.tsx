"use client";

import { useHasMounted } from "@react-hooks-library/core";
import { createContext, PropsWithChildren, useCallback, useContext, useRef, useState } from "react";

import { DocumentStorage } from "../storage/DocumentStorage";
import { LocalDocumentStorage } from "../storage/LocalDocumentStorage";
import type { DashboardConfig } from "./DashboardConfig";

export type DashboardConfigurationContextValue = {
    value: DashboardConfig;
    getList: () => { id: string; alias: string }[];
    addCopy: () => void;
    update: (value: DashboardConfig) => void;
    setConfig: (id: string) => void;
};

const DashboardConfigurationContext = createContext<DashboardConfigurationContextValue | null>(
    null,
);

export const useDashboardConfiguration = (): [
    DashboardConfig,
    (value: DashboardConfig) => void,
] => {
    const context = useContext(DashboardConfigurationContext);

    if (!context) {
        return [
            null!,
            () => {
                throw new Error(
                    "useDashboardConfiguration must be used within DashboardConfigurationProvider.",
                );
            },
        ];
    }

    return [context.value ?? {}, context.update];
};

export const useDashboardConfigurationSwitch = () => {
    const context = useContext(DashboardConfigurationContext);

    if (!context) {
        throw new Error(
            "useDashboardConfigurationSwitch must be used within DashboardConfigurationProvider.",
        );
    }

    return { setConfig: context.setConfig, getList: context.getList };
};

const STORAGE_KEYS = {
    CURRENT: "dashboard.currentConfig",
    ALL: "dashboard.configs",
};

// TODO write a hook that will help update picked properties of config

// TODO write old search params to config migrator, notify user

// TODO add content in sanity to display a modal about new config feature

// TODO write config import/export

export const MAX_ALIAS_LENGTH = 10;

export const DashboardConfigurationProvider = ({ children }: PropsWithChildren) => {
    const hasMounted = useHasMounted();
    return hasMounted ? (
        <DashboardConfigurationProvider2>{children}</DashboardConfigurationProvider2>
    ) : (
        children
    );
};

const DashboardConfigurationProvider2 = ({ children }: PropsWithChildren) => {
    const storage = useRef<DocumentStorage>(new LocalDocumentStorage());

    const [config, setConfig] = useState<DashboardConfig>(() => {
        let id = storage.current.get<string>(STORAGE_KEYS.CURRENT);
        const all = storage.current.get<DashboardConfig[]>(STORAGE_KEYS.ALL) ?? [];
        let value = all.find((c) => c.id === id);

        if (!value) {
            value = all[0] ?? null;
        }

        if (!value) {
            id = crypto.randomUUID();
            value = { id, alias: "Default" };
            all.push(value);
            storage.current.set(STORAGE_KEYS.CURRENT, id);
            storage.current.set(STORAGE_KEYS.ALL, all);
        }

        return value;
    });

    const handleUpdate = useCallback((value: DashboardConfig) => {
        if (!value.alias) {
            throw new Error("Alias is required");
        }

        if (value.alias.length > MAX_ALIAS_LENGTH) {
            throw new Error(`Alias cannot must be ${MAX_ALIAS_LENGTH} or less characters.`);
        }

        const all = storage.current.get<DashboardConfig[]>(STORAGE_KEYS.ALL) ?? [];
        const currentIndex = all.findIndex((c) => c.id === value.id);
        if (currentIndex >= 0) {
            all[currentIndex] = value;
        } else {
            all.push(value);
        }

        if (all.filter((c) => c.alias === value.alias).length > 1) {
            throw new Error(`Alias ${value.alias} is already in use.`);
        }

        storage.current.set(STORAGE_KEYS.CURRENT, value);
        storage.current.set(STORAGE_KEYS.ALL, all);
        setConfig(value);
    }, []);

    const handleSetConfig = useCallback((id: string) => {
        const all = storage.current.get<DashboardConfig[]>(STORAGE_KEYS.ALL) ?? [];
        const found = all.find((c) => c.id === id);
        if (!found) {
            throw new Error(
                `Configuration with id ${id} was not found, keeping current configuration.`,
            );
        }
        storage.current.set(STORAGE_KEYS.CURRENT, found);
        setConfig(found);
    }, []);

    const handleGetList = () => {
        const configs = storage.current.get<DashboardConfig[]>(STORAGE_KEYS.ALL);
        return configs?.map((c) => ({ id: c.id, alias: c.alias })) ?? [];
    };

    const handleAddCopy = () => {
        const all = storage.current.get<DashboardConfig[]>(STORAGE_KEYS.ALL) ?? [];
        const copy = { ...config, id: crypto.randomUUID(), alias: config.alias + " - Copy" };
        all.push(copy);

        storage.current.set(STORAGE_KEYS.ALL, all);
        storage.current.set(STORAGE_KEYS.CURRENT, copy);
        setConfig(copy);
    };

    return (
        <DashboardConfigurationContext.Provider
            value={{
                value: config,
                update: handleUpdate,
                setConfig: handleSetConfig,
                getList: handleGetList,
                addCopy: handleAddCopy,
            }}
        >
            {children}
        </DashboardConfigurationContext.Provider>
    );
};
