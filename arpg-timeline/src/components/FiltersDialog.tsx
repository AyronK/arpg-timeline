"use client";
import { useHasMounted } from "@react-hooks-library/core";
import { Eye, EyeOff, Filter, Lightbulb } from "lucide-react";
import { forwardRef } from "react";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { GameFilter } from "@/lib/cms/games.types";
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
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/ui/Drawer";
import { Switch } from "@/ui/Switch";

export type FiltersDialogProps = {
    filters: GameFilter[];
    checked: string[];
    onCheckedChange: (value: string, checked: boolean) => void;
    onGroupCheckedChange: (group: string, checked: boolean) => void;
};

const title = "Which games would you like to see?";

export const FiltersDialog = ({
    filters,
    checked,
    onCheckedChange,
    onGroupCheckedChange,
}: FiltersDialogProps) => {
    const { isMd } = useBreakpoint("md");
    const { is4xl } = useBreakpoint("4xl");
    const isMounted = useHasMounted();

    if (!isMounted) {
        return null;
    }

    if (is4xl) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Trigger checked={checked} />
                </DialogTrigger>
                <DialogContent>
                    <DialogDescription className="sr-only">Filters dialog</DialogDescription>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription asChild>
                            <Description />
                        </DialogDescription>
                    </DialogHeader>
                    <Filters
                        checked={checked}
                        filters={filters}
                        onCheckedChange={onCheckedChange}
                        onGroupCheckedChange={onGroupCheckedChange}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer direction={isMd ? "right" : "bottom"}>
            <DrawerTrigger asChild>
                <Trigger checked={checked} />
            </DrawerTrigger>
            <DrawerContent className={!isMd ? "left-0" : undefined}>
                <DrawerDescription className="sr-only">Filters dialog</DrawerDescription>
                <DrawerHeader>
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription asChild>
                        <Description />
                    </DrawerDescription>
                </DrawerHeader>
                <Filters
                    checked={checked}
                    filters={filters}
                    onCheckedChange={onCheckedChange}
                    onGroupCheckedChange={onGroupCheckedChange}
                />
                <DrawerFooter className="absolute right-0 bottom-0 md:relative">
                    <div className="ml-auto md:mr-auto md:ml-0">
                        <DrawerClose asChild>
                            <Button
                                className="shadow-md shadow-black md:shadow-none"
                                variant="outline"
                            >
                                Close
                            </Button>
                        </DrawerClose>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

const Description = () => (
    <div className="bg-muted mt-2 flex flex-row gap-2 rounded-md border p-4">
        <Lightbulb className="mt-1 h-4 w-4 shrink-0" />
        <span className="md:max-w-80">Bookmark this site to keep your setup!</span>
    </div>
);

const Trigger = forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof Button> & Pick<FiltersDialogProps, "checked">
>(({ checked, ...rest }, ref) => (
    <Button
        {...rest}
        ref={ref}
        variant="default"
        size={"lg"}
        onMouseDown={() => {
            sa_event("filters_opened");
        }}
        className={
            "group relative z-0 h-12 rounded-full px-4 shadow-md shadow-black transition-all ease-in-out"
        }
    >
        <Filter className="h-4 w-4" />
        <span className="max-w-0 overflow-hidden transition-all ease-in-out group-hover:ml-2 group-hover:max-w-20">
            Filter games
        </span>
        <span className="absolute -top-2 -right-2 h-6 w-6 scale-75 motion-safe:flex motion-reduce:hidden">
            <span className="bg-secondary font-ui text-primary-foreground relative grid h-6 w-6 place-content-center rounded-full font-semibold shadow-xs shadow-black">
                {checked.length}
            </span>
        </span>
    </Button>
));

Trigger.displayName = "Trigger";

const Filters = ({
    filters,
    checked,
    onGroupCheckedChange,
    onCheckedChange,
}: FiltersDialogProps) => {
    const groups = filters.reduce(
        (prev, curr) => {
            const group = prev[curr.group ?? ""] ?? [];
            group.push(curr);
            return { ...prev, [curr.group ?? ""]: group };
        },
        {} as Record<string, { value: string; label: string }[]>,
    );

    return (
        <div className="flex flex-col gap-6 overflow-auto px-6 pb-6">
            {Object.keys(groups)
                .sort()
                .map((g) => {
                    const anyChecked = !!groups[g].find((f) => checked.includes(f.value));
                    return (
                        <div className="flex flex-col gap-3" key={g}>
                            <div className="flex flex-row items-center gap-2">
                                <h3 className="font-lg font-semibold">
                                    {g !== "" ? g : "Uncategorized"}
                                </h3>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onGroupCheckedChange(g, !anyChecked)}
                                >
                                    {anyChecked ? (
                                        <Eye className="h-4 w-4" />
                                    ) : (
                                        <EyeOff className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {groups[g].map((f) => (
                                    <div key={f.value} className="flex flex-row gap-2">
                                        <div className="items-top flex space-x-2">
                                            <Switch
                                                id={`${f.value}-filter`}
                                                onCheckedChange={(v) => onCheckedChange(f.value, v)}
                                                checked={checked.includes(f.value)}
                                            />
                                            <label
                                                className={cn(
                                                    "cursor-pointer transition-all duration-150 ease-in-out",
                                                    {
                                                        "opacity-50": !checked.includes(f.value),
                                                    },
                                                )}
                                                htmlFor={`${f.value}-filter`}
                                            >
                                                {f.label}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};
