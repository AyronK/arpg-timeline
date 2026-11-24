"use client";

import dynamic from "next/dynamic";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

const SearchPalette = dynamic(() => import("./SearchPalette"), { ssr: false });

export const preloadSearchPalette = () => {
    void import("./SearchPalette");
};

interface SearchContextType {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const isEditableTarget = (target: EventTarget | null) =>
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);

    const setOpen = useCallback((open: boolean) => {
        setIsOpen(open);
        if (open) {
            setHasOpened(true);
        }
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.defaultPrevented || e.isComposing || e.altKey) {
                return;
            }
            if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setIsOpen((open) => !open);
                setHasOpened(true);
                return;
            }
            if (e.key === "/" && !e.metaKey && !e.ctrlKey && !isEditableTarget(e.target)) {
                e.preventDefault();
                setOpen(true);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [setOpen]);

    return (
        <SearchContext.Provider value={{ isOpen, setOpen }}>
            {children}
            {hasOpened && <SearchPalette open={isOpen} onOpenChange={setOpen} />}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
};
