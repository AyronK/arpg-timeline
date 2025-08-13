export interface TimelineEvent {
    name: string;
    game: string;
    startDate: Date;
    startDateConfirmed: boolean;
    startDateNotice?: string | null;
    endDate: Date;
    endDateConfirmed: boolean;
    endDateNotice?: string | null;
}

export type MonthMarkerProps = {
    marker: {
        date: Date;
        position: number;
        label: string;
    };
    index: number;
    totalMarkers: number;
};

export type EventBarProps = {
    event: TimelineEvent;
    index: number;
    allEvents: TimelineEvent[];
    startPos: number;
    width: number;
};

export interface GameRowProps {
    group: {
        game: string;
        events: TimelineEvent[];
    };
    getPositionPercent: (date: Date) => number;
    getEventWidth: (event: TimelineEvent) => number;
}
