export type MinifiedId = string;

// Defines how new games should be handled until user explicitly defines if the game should be hidden or shown
export enum NewGameStrategy {
    // Always show new games until explicitly shown or hidden
    Show = 0,

    // Always hide new games until explicitly shown or hidden
    Hide = 1,

    // Hide new games until a confirmed event happens, then show temporarily until explicitly shown or hidden
    ShowOnEvent = 2,
}

export enum CalendarApp {
    Gmail = 1,
    Google = 2,
    Outlook = 3,
    iCal = 4,
    TickTick = 5,
    Apple = 6,
}

export enum StreamingPlatform {
    Twitch = 1,
    YouTube = 2,
}

export enum SeasonProgressType {
    // [_______###] Shows how much time is left in the season
    TimeLeft = 0,

    // [#######___] Shows how much time has passed so far towards the end of season
    TimePassed = 1,
}

type _Games = {
    visible: MinifiedId[];
    hidden: MinifiedId[];
};

type Games = Partial<_Games>;

type _Preferences = {
    newGamesStrategy: NewGameStrategy;
    calendarApp: CalendarApp | null;
    streamingPlatform: StreamingPlatform | null;
    seasonProgressType: SeasonProgressType | null;
};

type Preferences = Partial<_Preferences>;

type _WidgetsConfig = {
    timeline: null | {
        visible: boolean;
        expanded: boolean;
        zoom: number;
    };
};

type WidgetsConfig = Partial<_WidgetsConfig>;

type _DashboardConfig = {
    games: Games;
    preferences: Preferences;
    widgets: WidgetsConfig;
};

export type DashboardConfig = Partial<_DashboardConfig> & {
    id: string;
    alias: string;
    version: number;
};
