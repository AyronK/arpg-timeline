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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/Dialog";

import { Eye, EyeOff, Filter, Lightbulb } from "lucide-react";
import { Button } from "@/ui/Button";
import { Switch } from "@/ui/Switch";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { forwardRef } from "react";
import { sa_event } from "@/lib/sa_event";

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
        <Trigger checked={checked} filters={filters} />
      </DrawerTrigger>
      <DrawerContent className={!isMd ? "left-0" : undefined}>
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
    <span className="md:max-w-80">
      You can add this website to your bookmarks so you&apos;ll always have the
      same setup!
    </span>
  </div>
);

const Trigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> &
    Pick<FiltersDialogProps, "checked" | "filters">
>(({ checked, ...rest }, ref) => (
  <Button
    {...rest}
    ref={ref}
    variant="default"
    onMouseDown={() => {
      sa_event("filters_opened");
    }}
    className={"relative z-10"}
  >
    <Filter className="mr-2 h-4 w-4" /> Filter games
    <span className="absolute -right-2 -top-2 h-6 w-6 scale-75 motion-safe:flex motion-reduce:hidden">
      <span className="relative grid h-6 w-6 place-content-center rounded-lg bg-secondary font-ui font-semibold text-primary-foreground shadow-sm">
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
    <div className="flex flex-col gap-6 overflow-auto px-6">
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
