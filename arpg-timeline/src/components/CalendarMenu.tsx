import { Calendar, CalendarPlus } from "lucide-react";
import Image from "next/image";

import {
    addToGoogleCalendar,
    addToICloudCalendar,
    addToTickTick,
    downloadICSFile,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/ui/DropdownMenu";

export const CalendarMenu = ({ title, startDate }: { title: string; startDate: string }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant={"link"}
                className="h-[32px]! w-[32px]! flex-1 md:h-[40px]! md:w-[40px]!"
                size={"icon"}
                aria-label="Add to calendar"
                data-sa-click="calendar-menu"
            >
                <CalendarPlus className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem
                onClick={() => addToGoogleCalendar(title, new Date(startDate))}
                aria-label="Add to Google calendar"
            >
                <Image
                    className="mr-2 h-4 w-4"
                    width="24"
                    height="24"
                    src="/assets/google-calendar-logo.png"
                    aria-hidden
                    alt="Gmail logo"
                />
                <span>Gmail</span>
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => addToICloudCalendar(title, new Date(startDate))}
                aria-label="Add to iCloud calendar"
            >
                <Image
                    className="mr-2 h-4 w-4"
                    width="24"
                    height="24"
                    src="/assets/apple-logo.svg"
                    aria-hidden
                    alt="iCloud logo"
                />
                <span>iCloud</span>
            </DropdownMenuItem>
            <DropdownMenuItem
                className={cn({
                    hidden: typeof window === "undefined" || !navigator?.clipboard,
                })}
                onClick={() => addToTickTick(title, new Date(startDate))}
                aria-label="Add to TickTick Calendar"
            >
                <Image
                    className="mr-2 h-4 w-4"
                    width="24"
                    height="24"
                    src="/assets/tick-tick-logo.png"
                    aria-hidden
                    alt="TickTick logo"
                />
                <span>TickTick</span>
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => downloadICSFile(title, new Date(startDate))}
                aria-label="Download iCal file"
            >
                <Calendar className="mr-2 h-4 w-4" />
                <span>iCal file</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);
