import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/ui/DropdownMenu";
import { Calendar, CalendarPlus } from "lucide-react";

import {
  downloadICSFile,
  addToGoogleCalendar,
  addToICloudCalendar,
  addToOutlookCalendar,
  addToTickTick,
} from "@/lib/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

export const CalendarMenu = ({
  title,
  startDate,
}: {
  title: string;
  startDate: string;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant={"link"}
        className="!h-[32px] !w-[32px] flex-1 md:!h-[40px] md:!w-[40px]"
        size={"icon"}
        title="Add to calendar"
      >
        <CalendarPlus className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem
        onClick={() => addToGoogleCalendar(title, new Date(startDate))}
        aria-label="Add to Google calendar"
      >
        <img
          className="mr-2 h-4 w-4"
          width="24"
          height="24"
          src="/assets/google-calendar-logo.png"
          aria-hidden
        />
        <span>Gmail</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => addToICloudCalendar(title, new Date(startDate))}
        aria-label="Add to iCloud calendar"
      >
        <img
          className="mr-2 h-4 w-4"
          width="24"
          height="24"
          src="/assets/apple-logo.svg"
          aria-hidden
        />
        <span>iCloud</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => addToOutlookCalendar(title, new Date(startDate))}
        aria-label="Add to Outlook"
      >
        <img
          className="mr-2 h-4 w-4"
          width="24"
          height="24"
          src="/assets/outlook-logo.png"
          aria-hidden
        />
        <span>Outlook</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        className={cn({
          hidden: typeof window === "undefined" || !navigator?.clipboard,
        })}
        onClick={() => addToTickTick(title, new Date(startDate))}
        aria-label="Add to TickTick Calendar"
      >
        <img
          className="mr-2 h-4 w-4"
          width="24"
          height="24"
          src="/assets/tick-tick-logo.png"
          aria-hidden
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
