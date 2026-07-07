"use client";

import { useCallback, useMemo, useState } from "react";

import { customEventToGame } from "@/lib/customEvents/toGame";
import {
    addCustomEvent as addStoredCustomEvent,
    getCustomEvents,
    removeCustomEvent as removeStoredCustomEvent,
} from "@/lib/storage/customEventsStorage";
import { CustomEvent } from "@/types/customEvent";

export const useCustomEvents = () => {
    const [customEvents, setCustomEvents] = useState<CustomEvent[]>(() => getCustomEvents());

    const addCustomEvent = useCallback((event: CustomEvent) => {
        setCustomEvents(addStoredCustomEvent(event));
    }, []);

    const removeCustomEvent = useCallback((id: string) => {
        setCustomEvents(removeStoredCustomEvent(id));
    }, []);

    const customGames = useMemo(() => customEvents.map(customEventToGame), [customEvents]);

    return { customEvents, customGames, addCustomEvent, removeCustomEvent };
};
