import { FC } from "react";

import { EventBar } from "./EventBar";
import { GameRowProps } from "./Timeline.types";

export const GameRow: FC<GameRowProps> = ({ group, getPositionPercent, getEventWidth }) => (
    <div className="relative h-8 transition-all hover:bg-slate-800/70">
        <div className="absolute top-0 right-0 left-0 flex h-full items-center">
            <div className="font-heading text-foreground text-shadow-card absolute top-1/3 left-1 z-40 -translate-y-1/2 text-xs text-nowrap text-shadow-xs">
                {group.game}
            </div>
            {group.events.map((event, index) => (
                <EventBar
                    key={`${event.game}-${event.name}-${index}`}
                    event={event}
                    index={index}
                    allEvents={group.events}
                    startPos={getPositionPercent(event.startDate)}
                    width={getEventWidth(event)}
                />
            ))}
        </div>
    </div>
);
