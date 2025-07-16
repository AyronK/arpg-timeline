"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { Description } from "@radix-ui/react-toast";
import { Link, Twitch } from "lucide-react";
import moment from "moment";
import { createContext, useContext, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";

import { GameToSeasonWidget } from "@/hoc/GameToSeasonWidget";
import { Game } from "@/lib/cms/games.types";
import { Event, mapGamesToCalendarEvents } from "@/lib/games/mapGamesToCalendarEvents";
import { inGracePeriod } from "@/lib/games/sortBySeasons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/ui/Dialog";

import ErrorBoundary from "../ErrorBoundary";
import { FramedAction } from "../FramedAction/FramedAction";
import { GameCard } from "../GameCard/GameCard";
import { MaybeLinkWrapper } from "../MaybeLinkWrapper";
import { SanityImage } from "../SanityImage";
import { WidgetDiedFallback } from "../WidgetDiedFallback";
import styles from "./SeasonCalendar.module.css";

type CalendarContextValue = {
    game: Game | null;
    setGame: (game: Game | null) => void;
};

const CalendarContext = createContext<CalendarContextValue>({ game: null, setGame: () => {} });

function EventComponent({ event }: { event: Event }) {
    const { setGame } = useContext(CalendarContext);
    return (
        <div className="relative flex flex-col">
            <button
                type="button"
                className="absolute inset-0 z-10 cursor-pointer border-0 bg-transparent"
                onClick={() => setGame(event.game)}
            />
            <div className="relative flex min-h-[24px] flex-1 md:min-h-[72px]">
                <SanityImage
                    loading="lazy"
                    src={event.game!.logo!}
                    alt={`${event.game!.name} logo`}
                    className="my-auto md:p-2"
                    fill
                    objectFit="contain"
                />
            </div>
            <span className="sr-only">{event.title}</span>
        </div>
    );
}

export const SeasonCalendar = ({ games }: { games: Game[] }) => {
    const [game, setGame] = useState<Game | null>(null);
    const events = mapGamesToCalendarEvents(games);
    const localizer = momentLocalizer(moment);
    return (
        <CalendarContext.Provider value={{ game, setGame }}>
            <div className={cn(styles.calendar, "h-full")}>
                <Calendar
                    localizer={localizer}
                    components={{ event: EventComponent }}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={{ month: true }}
                    defaultView="month"
                />
                <Dialog
                    open={!!game}
                    onOpenChange={(open) => {
                        if (!open) {
                            setGame(null);
                        }
                    }}
                >
                    {game && (
                        <DialogContent>
                            <DialogDescription className="sr-only">Game widget</DialogDescription>
                            <DialogHeader>
                                <DialogTitle>Game details</DialogTitle>
                                <DialogDescription asChild>
                                    <Description />
                                </DialogDescription>
                            </DialogHeader>
                            <ErrorBoundary fallback={<WidgetDiedFallback />}>
                                <GameCard
                                    name={game.name}
                                    logo={
                                        <SanityImage
                                            loading="lazy"
                                            src={game.logo!}
                                            alt={`${game.name} logo`}
                                            className="my-auto"
                                            width={160}
                                            height={140}
                                            objectFit="contain"
                                        />
                                    }
                                    slug={game.slug}
                                    shortName={game.shortName!}
                                    url={game.url!}
                                    official={game.official}
                                >
                                    <GameToSeasonWidget game={game} selector="current" />
                                    {inGracePeriod(game.currentSeason?.start?.startDate) ? (
                                        <div className="mt-auto flex flex-col gap-2">
                                            {game.currentSeason?.patchNotesUrl && (
                                                <MaybeLinkWrapper
                                                    href={game.currentSeason.patchNotesUrl}
                                                    target="_blank"
                                                    className="ml-auto text-sm text-nowrap hover:underline"
                                                    data-sm-click={`${game.currentSeason.name}-patch-notes`}
                                                >
                                                    Patch notes
                                                </MaybeLinkWrapper>
                                            )}
                                            <FramedAction
                                                appendClassName="!bg-[#6441a5]"
                                                append={
                                                    game.twitchCategory && (
                                                        <Button
                                                            asChild
                                                            size="icon"
                                                            className="mt-auto ml-auto !rounded-l-none !bg-[#6441a5]"
                                                            variant="destructive"
                                                        >
                                                            <Link
                                                                target="_blank"
                                                                rel="noopener"
                                                                data-sa-click={`${game.slug}-twitch`}
                                                                href={`https://www.twitch.tv/directory/category/${game.twitchCategory}`}
                                                            >
                                                                <Twitch className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    )
                                                }
                                            >
                                                {game.twitchCategory
                                                    ? "Play and watch now!"
                                                    : "Play now!"}
                                            </FramedAction>
                                        </div>
                                    ) : (
                                        <GameToSeasonWidget game={game} selector="next" />
                                    )}
                                </GameCard>
                            </ErrorBoundary>
                        </DialogContent>
                    )}
                </Dialog>
            </div>
        </CalendarContext.Provider>
    );
};
