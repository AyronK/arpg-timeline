"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const STORAGE_KEY = "arpg-timeline-hidden-partners";

export const PARTNER_IDS = ["proton"] as const;
export type PartnerId = (typeof PARTNER_IDS)[number];

interface PartnerPromosContextType {
    hiddenPartners: Set<PartnerId>;
    setPartnerHidden: (partnerId: PartnerId, hidden: boolean) => void;
    isPartnerHidden: (partnerId: PartnerId) => boolean;
    drawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
}

const PartnerPromosContext = createContext<PartnerPromosContextType | undefined>(undefined);

function loadHiddenPartners(): Set<PartnerId> {
    if (typeof window === "undefined") return new Set();
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return new Set();
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return new Set();
        return new Set(parsed.filter((id): id is PartnerId => PARTNER_IDS.includes(id)));
    } catch {
        return new Set();
    }
}

function saveHiddenPartners(set: Set<PartnerId>) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    } catch {
        // ignore
    }
}

export function PartnerPromosProvider({ children }: { children: ReactNode }) {
    const [hiddenPartners, setHiddenPartners] = useState<Set<PartnerId>>(new Set());
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        setHiddenPartners(loadHiddenPartners());
    }, []);

    const setPartnerHidden = useCallback((partnerId: PartnerId, hidden: boolean) => {
        setHiddenPartners((prev) => {
            const next = new Set(prev);
            if (hidden) next.add(partnerId);
            else next.delete(partnerId);
            saveHiddenPartners(next);
            return next;
        });
    }, []);

    const isPartnerHidden = useCallback(
        (partnerId: PartnerId) => hiddenPartners.has(partnerId),
        [hiddenPartners],
    );

    const value = useMemo(
        () => ({
            hiddenPartners,
            setPartnerHidden,
            isPartnerHidden,
            drawerOpen,
            setDrawerOpen,
        }),
        [hiddenPartners, setPartnerHidden, isPartnerHidden, drawerOpen],
    );

    return (
        <PartnerPromosContext.Provider value={value}>{children}</PartnerPromosContext.Provider>
    );
}

export function usePartnerPromos() {
    const ctx = useContext(PartnerPromosContext);
    if (ctx === undefined) throw new Error("usePartnerPromos must be used within PartnerPromosProvider");
    return ctx;
}
