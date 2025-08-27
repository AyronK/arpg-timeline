"use client";
import { useHasMounted } from "@react-hooks-library/core";
import { Eye, EyeOff, Filter } from "lucide-react";
import { SanityImageAssetDocument } from "next-sanity";
import { forwardRef } from "react";

import { SanityImage } from "@/components/SanityImage";
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

const title = "Which games would you like to see?";

export const FiltersDialog = ({
    filters,
    checked,
    onCheckedChange,
    onGroupCheckedChange,
    disabled = false,
}: FiltersDialogProps) => {
    const isMounted = useHasMounted();

    const showIndicator = filters.length !== checked.length;

    if (!isMounted) {
        return <Trigger showIndicator={showIndicator} />;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Trigger showIndicator={showIndicator} disabled={disabled} />
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
    React.ComponentPropsWithoutRef<typeof Button> & { showIndicator?: boolean; disabled?: boolean }
>(({ showIndicator, disabled = false, ...rest }, ref) => (
    <Button
        {...rest}
        ref={ref}
        variant="default"
        size={"sm"}
        disabled={disabled}
        onMouseDown={() => {
            sa_event("filters_opened");
        }}
        className="inline-flex h-9! min-w-0 flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap"
    >
        <div className="relative">
            <Filter className="h-4 w-4" />
            {showIndicator && (
                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-yellow-600"></div>
            )}
        </div>
        <span className="text-center leading-0 whitespace-nowrap">Filter</span>
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
        <div className="flex flex-col gap-6 overflow-auto pb-18">
            {Object.keys(groups)
                .sort((a, b) => groups[a][0].groupPriority - groups[b][0].groupPriority)
                .map((g) => {
                    const anyChecked = !!groups[g].find((f) => checked.includes(f.value));
                    return (
                        <div className="flex flex-col gap-4" key={g}>
                            <div className="flex flex-row items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    {g !== "" ? g : "Uncategorized"}
                                </h3>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onGroupCheckedChange(g, !anyChecked)}
                                    disabled={disabled}
                                    data-sa-click={`filter-group-${g === "" ? "uncategorized" : g}`}
                                    className="flex items-center gap-2"
                                >
                                    {anyChecked ? (
                                        <>
                                            <Eye className="h-4 w-4" />
                                            <span className="hidden sm:inline">Hide All</span>
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="h-4 w-4" />
                                            <span className="hidden sm:inline">Show All</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div className="grid auto-rows-fr grid-cols-2 items-stretch gap-3 sm:grid-cols-4 xl:grid-cols-8">
                                {groups[g].map((f) => {
                                    const isChecked = checked.includes(f.value);
                                    return (
                                        <button
                                            key={f.value}
                                            onClick={() => onCheckedChange(f.value, !isChecked)}
                                            disabled={disabled}
                                            className={cn(
                                                "group relative col-span-1 flex flex-col items-center gap-2 rounded-lg border-2 p-2 transition-all duration-200",
                                                {
                                                    "bg-card shadow-sm shadow-neutral-950/80 hover:scale-105 hover:shadow-md":
                                                        isChecked,
                                                    "scale-95 brightness-90 hover:scale-100":
                                                        !isChecked,
                                                    "cursor-not-allowed opacity-50": disabled,
                                                    "cursor-pointer": !disabled,
                                                },
                                            )}
                                        >
                                            <div className="absolute top-1 right-1 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                <div className="flex h-4 w-4 items-center justify-center rounded-full shadow-sm">
                                                    {isChecked ? (
                                                        <EyeOff className="text-destructive h-4 w-4" />
                                                    ) : (
                                                        <Eye className="text-foreground h-4 w-4" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <div className="h-14 w-14 overflow-hidden rounded-md">
                                                    {f.logo ? (
                                                        <SanityImage
                                                            src={f.logo}
                                                            alt={`${f.label} logo`}
                                                            width={56}
                                                            height={56}
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
                                                    "text-center text-xs leading-tight font-medium",
                                                    {
                                                        "text-primary font-semibold": isChecked,
                                                        "text-muted-foreground": !isChecked,
                                                    },
                                                )}
                                            >
                                                {f.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};
