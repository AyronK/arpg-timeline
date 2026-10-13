"use client";
import { useHasMounted } from "@react-hooks-library/core";
import { Filter } from "lucide-react";
import { SanityImageAssetDocument } from "next-sanity";
import { forwardRef } from "react";

import { SanityImage } from "@/components/SanityImage";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import {
    getPresetControlLabel,
    HiddenGamesSummary,
    PresetControlLabel,
} from "@/lib/filters/filterState";
import { sa_event } from "@/lib/sa_event";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/ui/Dialog";
import { Switch } from "@/ui/Switch";

export type FiltersDialogProps = {
    filters: {
        value: string;
        label: string;
        group?: string | undefined;
        groupPriority?: number;
        logo?: SanityImageAssetDocument;
    }[];
    checked: string[];
    onCheckedChange: (value: string, checked: boolean) => void;
    onGroupCheckedChange: (group: string, checked: boolean) => void;
    disabled?: boolean;
};

const title = "Choose your games";

export const FiltersDialog = ({
    filters,
    checked,
    onCheckedChange,
    onGroupCheckedChange,
    disabled = false,
    hiddenGamesSummary,
    open,
    onOpenChange,
}: FiltersDialogProps & {
    hiddenGamesSummary: HiddenGamesSummary | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    const isMounted = useHasMounted();
    const { isLg } = useBreakpoint("lg");

    if (!isMounted) {
        return <Trigger label={null} />;
    }

    const label =
        hiddenGamesSummary && !disabled ? getPresetControlLabel(hiddenGamesSummary) : null;

    return (
        <Dialog open={open && isLg} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Trigger
                    label={label}
                    disabled={disabled}
                    onClick={() => {
                        if (hiddenGamesSummary) {
                            sa_event("preset_chip_clicked", { state: hiddenGamesSummary.state });
                        }
                    }}
                />
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] w-full max-w-7xl!">
                <DialogDescription className="sr-only">Filters dialog</DialogDescription>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <Filters
                    checked={checked}
                    filters={filters}
                    onCheckedChange={onCheckedChange}
                    onGroupCheckedChange={onGroupCheckedChange}
                    disabled={disabled}
                />
            </DialogContent>
        </Dialog>
    );
};

const Trigger = forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof Button> & {
        label: PresetControlLabel | null;
        disabled?: boolean;
    }
>(({ label, disabled = false, ...rest }, ref) => (
    <Button
        {...rest}
        ref={ref}
        variant="default"
        size={"sm"}
        disabled={disabled}
        onMouseDown={() => {
            sa_event("filters_opened");
        }}
        className="relative inline-flex h-9! min-w-0 flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap"
    >
        <Filter className="h-4 w-4" />
        <span className="text-center leading-0 font-medium whitespace-nowrap">
            {label ? (
                <>
                    <span className="xl:hidden">{label.short}</span>
                    <span className="hidden xl:inline">{label.full}</span>
                </>
            ) : (
                "Filters"
            )}
        </span>
    </Button>
));

Trigger.displayName = "Trigger";

export const Filters = ({
    filters,
    checked,
    onGroupCheckedChange,
    onCheckedChange,
    disabled,
}: FiltersDialogProps) => {
    const groups = filters.reduce(
        (prev, curr) => {
            const group = prev[curr.group ?? ""] ?? [];
            group.push({ ...curr, groupPriority: curr.groupPriority ?? Number.MAX_SAFE_INTEGER });
            return { ...prev, [curr.group ?? ""]: group };
        },
        {} as Record<
            string,
            {
                value: string;
                label: string;
                logo?: SanityImageAssetDocument;
                groupPriority: number;
            }[]
        >,
    );

    return (
        <div className="flex flex-col gap-6 overflow-x-visible px-6 pb-18 lg:px-0">
            {Object.keys(groups)
                .sort((a, b) => groups[a][0].groupPriority - groups[b][0].groupPriority)
                .map((g) => {
                    const anyChecked = !!groups[g].find((f) => checked.includes(f.value));
                    const checkedCount = groups[g].filter((f) => checked.includes(f.value)).length;
                    const totalCount = groups[g].length;
                    return (
                        <div className="flex flex-col gap-4" key={g}>
                            <label className="flex cursor-pointer flex-col items-start">
                                <div className="flex flex-row items-center gap-2">
                                    <Switch
                                        className="z-10!"
                                        checked={anyChecked}
                                        onCheckedChange={() => onGroupCheckedChange(g, !anyChecked)}
                                        disabled={disabled}
                                        aria-label={`Toggle all ${g !== "" ? g : "uncategorized"} games`}
                                    />
                                    <h3 className="text-lg font-semibold">
                                        {g !== "" ? g : "Uncategorized"}
                                    </h3>
                                    <div className="text-muted-foreground text-sm font-normal">
                                        | {checkedCount} of {totalCount} shown
                                    </div>
                                </div>
                            </label>
                            <div className="grid auto-rows-fr grid-cols-2 items-stretch gap-3 sm:grid-cols-4 xl:grid-cols-8">
                                {groups[g].map((f) => {
                                    const isChecked = checked.includes(f.value);
                                    return (
                                        <label
                                            key={f.value}
                                            className={cn(
                                                "group relative col-span-1 flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-2 transition-all duration-200 select-none md:h-36",
                                                {
                                                    "bg-card shadow-sm shadow-neutral-950/80":
                                                        isChecked,
                                                    "hover:border-foreground/10": !isChecked,
                                                    "cursor-not-allowed opacity-50": disabled,
                                                },
                                            )}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() =>
                                                    onCheckedChange(f.value, !isChecked)
                                                }
                                                disabled={disabled}
                                                className="sr-only"
                                            />
                                            <div className="absolute top-1 right-1 z-10">
                                                <Switch
                                                    checked={isChecked}
                                                    className="data-[state=checked]:bg-muted-foreground pointer-events-none z-10! origin-top-right scale-50"
                                                    aria-label={`Toggle ${f.label} visibility`}
                                                />
                                            </div>
                                            <div className="relative">
                                                <div className="h-14 w-14 overflow-hidden rounded-md lg:h-20 lg:w-20">
                                                    {f.logo ? (
                                                        <SanityImage
                                                            loading="lazy"
                                                            src={f.logo}
                                                            alt={`${f.label} logo`}
                                                            width={256}
                                                            height={256}
                                                            objectFit="contain"
                                                            className="h-full w-full"
                                                        />
                                                    ) : (
                                                        <div className="text-muted-foreground flex h-full w-full items-center justify-center text-xs">
                                                            {f.label.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span
                                                className={cn(
                                                    "text-center text-xs leading-tight font-medium transition-all duration-200",
                                                    {
                                                        "text-primary": isChecked,
                                                        "text-muted-foreground": !isChecked,
                                                    },
                                                )}
                                            >
                                                {f.label}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};
