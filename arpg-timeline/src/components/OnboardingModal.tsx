"use client";

import { useHasMounted } from "@react-hooks-library/core";
import { ChevronLeft, LayoutGrid, SlidersHorizontal, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Filters } from "@/components/FiltersDialog";
import { useGameFilterContext } from "@/contexts/GameFilterContext";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { sa_event } from "@/lib/sa_event";
import {
    getOnboardingSeen,
    getVisitCount,
    incrementVisitCount,
    ONBOARDING_VISIT_THRESHOLD,
    setFilterHintDismissed,
    setFilterPingSeen,
    setOnboardingSeen,
} from "@/lib/storage/filterOnboardingStorage";
import { getStoredFilters } from "@/lib/storage/gameFiltersStorage";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/ui/Dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerPortal,
    DrawerTitle,
} from "@/ui/Drawer";

type Step = "choice" | "customize";

export const OnboardingModal = () => {
    const isMounted = useHasMounted();
    const { isMd } = useBreakpoint("md");
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<Step>("choice");
    const [localChecked, setLocalChecked] = useState<string[]>([]);
    const didIncrementRef = useRef(false);

    const { gameFilters, activeFilters, updateFilters, totalGames, shownGames, category } =
        useGameFilterContext();

    useEffect(() => {
        if (didIncrementRef.current) return;
        didIncrementRef.current = true;
        if (getStoredFilters() !== null) return;
        if (getOnboardingSeen()) return;
        incrementVisitCount();
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        if (category !== "featured") return;
        if (getStoredFilters() !== null) return;
        if (getOnboardingSeen()) return;
        if (getVisitCount() < ONBOARDING_VISIT_THRESHOLD) return;

        const timer = setTimeout(() => {
            setOpen(true);
            sa_event("onboarding_shown");
        }, 150);
        return () => clearTimeout(timer);
    }, [isMounted, category]);

    const dismissHints = () => {
        setFilterHintDismissed();
        setFilterPingSeen();
    };

    const handleAllGames = () => {
        updateFilters([]);
        dismissHints();
        setOnboardingSeen();
        setOpen(false);
        sa_event("onboarding_all_games");
    };

    const handleFeatured = () => {
        dismissHints();
        setOnboardingSeen();
        setOpen(false);
        sa_event("onboarding_featured");
    };

    const handleCustomizeOpen = () => {
        setLocalChecked(activeFilters);
        setStep("customize");
        sa_event("onboarding_customize_opened");
    };

    const handleCustomizeApply = () => {
        const allSlugs = gameFilters.map((f) => f.value);
        const newExcluded = allSlugs.filter((s) => !localChecked.includes(s));
        updateFilters(newExcluded);
        dismissHints();
        setOnboardingSeen();
        setOpen(false);
        sa_event("onboarding_customize_applied");
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setOnboardingSeen();
            setStep("choice");
            sa_event("onboarding_dismissed");
        }
        setOpen(isOpen);
    };

    const handleLocalToggle = (slug: string, checked: boolean) => {
        setLocalChecked((prev) => (checked ? [...prev, slug] : prev.filter((s) => s !== slug)));
    };

    const handleLocalGroupToggle = (group: string, checked: boolean) => {
        const groupSlugs = gameFilters.filter((f) => f.group === group).map((f) => f.value);
        setLocalChecked((prev) =>
            checked
                ? [...new Set([...prev, ...groupSlugs])]
                : prev.filter((s) => !groupSlugs.includes(s)),
        );
    };

    if (!isMounted) return null;

    const cards = (
        <div className="flex flex-col gap-4 pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <OptionCard
                    icon={<Star className="h-5 w-5" />}
                    title="Featured"
                    sublabel="Default view"
                    description="Most relevant aRPGs. Community and non-seasonal games are hidden."
                    detail={`${shownGames} games`}
                    onClick={handleFeatured}
                />
                <OptionCard
                    icon={<SlidersHorizontal className="h-5 w-5" />}
                    title="Customize"
                    description="Tailored to the games you actually play."
                    detail="You decide"
                    recommended
                    onClick={handleCustomizeOpen}
                />
                <OptionCard
                    icon={<LayoutGrid className="h-5 w-5" />}
                    title="All Games"
                    sublabel="Full view"
                    description="Every game including community servers and non-seasonal titles."
                    detail={`${totalGames} games`}
                    onClick={handleAllGames}
                />
            </div>
            <p className="text-muted-foreground text-center text-xs">
                You can always change using the{" "}
                <span className="text-foreground/70 font-medium">Filters</span> button.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Button
                    variant="outline"
                    size="sm"
                    className="col-span-full sm:col-span-1 sm:col-start-2"
                    onClick={() => handleOpenChange(false)}
                >
                    <X className="mr-2 h-4 w-4" />
                    I&apos;ll decide later
                </Button>
            </div>
        </div>
    );

    const customizeBody = (
        <div className="max-h-[60vh] overflow-y-auto pr-4">
            <Filters
                filters={gameFilters}
                checked={localChecked}
                onCheckedChange={handleLocalToggle}
                onGroupCheckedChange={handleLocalGroupToggle}
            />
        </div>
    );

    const customizeFooter = (
        <div className="flex shrink-0 justify-end border-t pt-4">
            <Button onClick={handleCustomizeApply}>
                Apply - {localChecked.length} of {gameFilters.length} games shown
            </Button>
        </div>
    );

    const backButton = (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep("choice")}
            className="-ml-1 h-8 gap-1 px-2"
        >
            <ChevronLeft className="h-4 w-4" />
            Back
        </Button>
    );

    if (!isMd) {
        return (
            <Drawer open={open} onOpenChange={handleOpenChange}>
                <DrawerPortal>
                    <DrawerContent
                        onInteractOutside={(e) => e.preventDefault()}
                        className={cn(
                            "top-auto! flex flex-col px-4 pb-28",
                            step === "customize" && "max-h-[90vh]",
                        )}
                    >
                        <DrawerDescription className="sr-only">
                            Choose which games to show
                        </DrawerDescription>
                        {step === "choice" ? (
                            <>
                                <DrawerHeader className="px-0 text-center">
                                    <DrawerTitle className="text-xl">
                                        Customize your experience
                                    </DrawerTitle>
                                    <DrawerDescription>
                                        Choose which games to show
                                    </DrawerDescription>
                                </DrawerHeader>
                                {cards}
                            </>
                        ) : (
                            <>
                                <DrawerHeader className="px-0">
                                    <div className="flex items-center gap-2">
                                        {backButton}
                                        <DrawerTitle>Choose your games</DrawerTitle>
                                    </div>
                                </DrawerHeader>
                                {customizeBody}
                                {customizeFooter}
                            </>
                        )}
                    </DrawerContent>
                </DrawerPortal>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                hideClose
                onInteractOutside={(e) => e.preventDefault()}
                className={cn(
                    "transition-[max-width] duration-200",
                    step === "customize" ? "max-h-[80vh] w-full max-w-7xl!" : "max-w-2xl!",
                )}
            >
                <DialogDescription className="sr-only">
                    Choose which games to show
                </DialogDescription>
                {step === "choice" ? (
                    <>
                        <DialogHeader className="text-center">
                            <DialogTitle className="text-xl">Customize your experience</DialogTitle>
                            <p className="text-muted-foreground text-sm text-balance">
                                Choose which games to show
                            </p>
                        </DialogHeader>
                        {cards}
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-2">
                                {backButton}
                                <DialogTitle>Choose your games</DialogTitle>
                            </div>
                        </DialogHeader>
                        {customizeBody}
                        {customizeFooter}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

const OptionCard = ({
    icon,
    title,
    sublabel,
    description,
    detail,
    recommended,
    onClick,
}: {
    icon: React.ReactNode;
    title: string;
    sublabel?: string;
    description: string;
    detail?: string;
    recommended?: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={cn(
            "group relative flex h-full cursor-pointer flex-col gap-4 rounded-lg border p-6 text-left transition-colors",
            recommended
                ? "border-primary/50 bg-primary/5 hover:bg-primary/10"
                : "border-muted-foreground/25 bg-muted/15 hover:border-foreground/40 hover:bg-muted/50",
        )}
    >
        {recommended && (
            <span className="bg-primary text-primary-foreground absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide whitespace-nowrap uppercase">
                Recommended
            </span>
        )}
        {sublabel && (
            <span className="bg-background text-muted-foreground absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide whitespace-nowrap uppercase">
                {sublabel}
            </span>
        )}
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
                {icon}
                <span className="font-semibold">{title}</span>
            </div>
            <span className="text-muted-foreground text-xs leading-relaxed">{description}</span>
        </div>
        {detail && (
            <span
                className={cn(
                    "text-foreground mt-auto text-xs font-medium",
                    recommended && "text-primary",
                )}
            >
                {detail}
            </span>
        )}
    </button>
);
