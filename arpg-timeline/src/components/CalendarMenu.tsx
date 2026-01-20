"use client";

import { Calendar, CalendarPlus, Rss } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { addToGoogleCalendar, addToICloudCalendar, downloadICSFile } from "@/lib/calendar";
import { sa_event } from "@/lib/sa_event";
import { Button } from "@/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/ui/DropdownMenu";

import { CalendarSubscribeDialog } from "./CalendarSubscribeDialog";

interface CalendarMenuProps {
    title: string;
    startDate: string;
    gameSlug?: string;
    gameName?: string;
}

export const CalendarMenu = ({ title, startDate, gameSlug, gameName }: CalendarMenuProps) => {
    const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);

    return (
        <>
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
                    {gameSlug && (
                        <>
                            <DropdownMenuItem
                                onClick={() => {
                                    sa_event("calendar_subscribe_opened", { game: gameSlug });
                                    setSubscribeDialogOpen(true);
                                }}
                                aria-label="Subscribe to calendar"
                            >
                                <Rss className="mr-2 h-4 w-4" />
                                <span>Subscribe</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    <DropdownMenuItem
                        onClick={() => addToGoogleCalendar(title, new Date(startDate))}
                        aria-label="Add to Google calendar"
                    >
                        <Image
                            loading="lazy"
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
                            loading="lazy"
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
                        onClick={() => downloadICSFile(title, new Date(startDate))}
                        aria-label="Download iCal file"
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>iCal file</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <CalendarSubscribeDialog
                open={subscribeDialogOpen}
                onOpenChange={setSubscribeDialogOpen}
                gameSlug={gameSlug}
                gameName={gameName}
            />
        </>
    );
};
