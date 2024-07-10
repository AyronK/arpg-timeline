import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./Drawer";

import { Eye, EyeOff, Filter } from "lucide-react";
import { Button } from "./Button";
import { Switch } from "./Switch";
import { cn } from "@/lib/utils";

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
  const groups = filters.reduce(
    (prev, curr) => {
      const group = prev[curr.group ?? ""] ?? [];
      group.push(curr);
      return { ...prev, [curr.group ?? ""]: group };
    },
    {} as Record<string, { value: string; label: string }[]>,
  );

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" /> Filter games
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Which games would you like to see?</DrawerTitle>
          <DrawerDescription>
            <p className="md:max-w-80 text-balance">
              You can add this website to your bookmarks so you'll always have
              the same setup!
            </p>
          </DrawerDescription>
        </DrawerHeader>
        <div className="py-2 px-6 flex flex-col gap-6 overflow-auto">
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
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
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
          <div className="mr-auto ml-auto md:ml-0">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
