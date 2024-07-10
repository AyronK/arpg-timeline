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

import { Filter } from "lucide-react";
import { Button } from "./Button";
import { Switch } from "./Switch";

export const FiltersDrawer = ({
  filters,
  checked,
  onCheckedChange,
}: {
  filters: { value: string; label: string }[];
  checked: string[];
  onCheckedChange: (value: string, checked: boolean) => void;
}) => (
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
            You can add this website to your bookmarks so you'll always have the
            same setup!
          </p>
        </DrawerDescription>
      </DrawerHeader>
      <div className="py-2 px-6 flex flex-col gap-4 overflow-auto">
        {filters.map((f) => (
          <div key={f.value} className="flex flex-row gap-2">
            <div className="items-top flex space-x-2">
              <Switch
                id={`${f.value}-filter`}
                onCheckedChange={(v) => onCheckedChange(f.value, v)}
                checked={checked.includes(f.value)}
              />
              <label className="cursor-pointer" htmlFor={`${f.value}-filter`}>
                {f.label}
              </label>
            </div>
          </div>
        ))}
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
