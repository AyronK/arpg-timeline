import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";

import { Eye, EyeOff, Filter, Lightbulb } from "lucide-react";
import { Button } from "./Button";
import { Switch } from "./Switch";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export type FiltersDialogProps = {
  filters: { value: string; label: string; group?: string | undefined }[];
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
  const { is3xl } = useBreakpoint("3xl");

  if (is3xl) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Trigger checked={checked} filters={filters} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
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
    <Drawer direction={isMd ? "right" : "bottom"} handleOnly>
      <DrawerTrigger asChild>
        <Trigger checked={checked} filters={filters} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHandle />
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>
            <Description />
          </DrawerDescription>
        </DrawerHeader>
        <Filters
          checked={checked}
          filters={filters}
          onCheckedChange={onCheckedChange}
          onGroupCheckedChange={onGroupCheckedChange}
        />
        <DrawerFooter>
          <div className="ml-auto md:ml-0 md:mr-auto">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const Description = () => (
  <div className="mt-2 flex flex-row gap-2 rounded-md border p-2">
    <Lightbulb className="mt-1 h-4 w-4 flex-shrink-0" />
    <p className="md:max-w-80">
      You can add this website to your bookmarks so you'll always have the same
      setup!
    </p>
  </div>
);

const Trigger = ({
  filters,
  checked,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Button> &
  Pick<FiltersDialogProps, "checked" | "filters">) => (
  <Button
    {...rest}
    variant="outline"
    className={cn("relative", {
      "animate-pulse":
        checked?.length === filters?.length && filters?.length > 0,
    })}
  >
    <Filter className="mr-2 h-4 w-4" /> Filter games
    {checked?.length !== filters?.length && filters?.length > 0 && (
      <span className="absolute -right-3 -top-3 h-6 w-6 scale-75 motion-safe:flex motion-reduce:hidden">
        <span className="relative grid h-6 w-6 place-content-center rounded-full bg-slate-500 text-white">
          {checked.length}
        </span>
      </span>
    )}
  </Button>
);

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
    <div className="flex flex-col gap-6 overflow-auto px-6">
      {Object.keys(groups)
        .sort()
        .map((g) => {
          const anyChecked = !!groups[g].find((f) => checked.includes(f.value));
          return (
            <div className="flex flex-col gap-3">
              <div className="flex flex-row items-center">
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
