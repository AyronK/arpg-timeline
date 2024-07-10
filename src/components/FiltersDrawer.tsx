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

import { Eye, EyeOff, Filter, Lightbulb } from "lucide-react";
import { Button } from "./Button";
import { Switch } from "./Switch";
import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export const FiltersDrawer = ({
  filters,
  checked,
  onCheckedChange,
  onGroupCheckedChange,
}: {
  filters: { value: string; label: string; group?: string | undefined }[];
  checked: string[];
  onCheckedChange: (value: string, checked: boolean) => void;
  onGroupCheckedChange: (group: string, checked: boolean) => void;
}) => {
  const { isMd } = useBreakpoint("md");
  const groups = filters.reduce(
    (prev, curr) => {
      const group = prev[curr.group ?? ""] ?? [];
      group.push(curr);
      return { ...prev, [curr.group ?? ""]: group };
    },
    {} as Record<string, { value: string; label: string }[]>,
  );

  return (
    <Drawer direction={isMd ? "right" : "bottom"} handleOnly>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn("relative", {
            "animate-pulse":
              checked?.length === filters?.length && filters?.length > 0,
          })}
        >
          <Filter className="h-4 w-4 mr-2" /> Filter games
          {checked?.length !== filters?.length && filters?.length > 0 && (
            <span className="motion-reduce:hidden motion-safe:flex absolute h-6 w-6 -top-3 -right-3 scale-75">
              <span className="relative text-white grid place-content-center rounded-full h-6 w-6 bg-slate-500">
                {checked.length}
              </span>
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHandle />
        <DrawerHeader>
          <DrawerTitle>Which games would you like to see?</DrawerTitle>
          <DrawerDescription>
            <div className="border p-2 mt-2 rounded-md flex flex-row gap-2">
              <Lightbulb className="h-4 w-4 flex-shrink-0 mt-1" />
              <p className="md:max-w-80">
                You can add this website to your bookmarks so you'll always have
                the same setup!
              </p>
            </div>
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 flex flex-col gap-6 overflow-auto">
          {Object.keys(groups)
            .sort()
            .map((g) => {
              const anyChecked = !!groups[g].find((f) =>
                checked.includes(f.value),
              );
              return (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-2 items-center">
                    <h3 className="font-lg font-semibold">
                      {g !== "" ? g : "Uncategorized"}
                    </h3>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onGroupCheckedChange(g, !anyChecked)}
                    >
                      {anyChecked ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
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
                              "cursor-pointer transition-all ease-in-out duration-150",
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
        <DrawerFooter>
          <div className="md:mr-auto ml-auto md:ml-0">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
