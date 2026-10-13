"use client";

// PROTOTYPE: floating variant switcher, never rendered in production builds
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback, useEffect } from "react";

export const usePrototypeVariant = <T extends string>(variants: readonly T[]): T | null => {
    const searchParams = useSearchParams();
    if (process.env.NODE_ENV === "production") return null;
    const value = searchParams.get("variant") as T | null;
    return value && variants.includes(value) ? value : variants[0];
};

export const PrototypeSwitcher = ({
    variants,
    current,
    status,
}: {
    variants: { key: string; name: string }[];
    current: string;
    status?: ReactNode;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const go = useCallback(
        (step: number) => {
            const idx = variants.findIndex((v) => v.key === current);
            const next = variants[(idx + step + variants.length) % variants.length];
            const params = new URLSearchParams(searchParams.toString());
            params.set("variant", next.key);
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [variants, current, searchParams, router, pathname],
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const el = e.target as HTMLElement | null;
            if (el?.closest("input, textarea, [contenteditable]")) return;
            if (e.key === "ArrowLeft") go(-1);
            if (e.key === "ArrowRight") go(1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [go]);

    if (process.env.NODE_ENV === "production") return null;

    const active = variants.find((v) => v.key === current);

    return (
        <div className="fixed bottom-24 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-1 rounded-2xl bg-fuchsia-600 px-2 py-1.5 text-xs font-medium text-white shadow-xl lg:bottom-4">
            <div className="flex items-center gap-2">
                <button onClick={() => go(-1)} className="rounded-full p-1 hover:bg-white/20">
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="whitespace-nowrap">
                    {current} ({active?.name})
                </span>
                <button onClick={() => go(1)} className="rounded-full p-1 hover:bg-white/20">
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
            {status && <div className="px-2 pb-0.5 text-[10px] opacity-80">{status}</div>}
        </div>
    );
};
