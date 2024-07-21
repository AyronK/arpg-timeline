declare class Gantt {
  constructor(
    wrapper: string | HTMLElement | SVGElement,
    tasks: Gantt.Task[],
    options?: Gantt.Options,
  );

  change_view_mode(mode: Gantt.viewMode): void;
  refresh(tasks: Gantt.Task[]): void;
}

declare namespace Gantt {
  interface Task {
    id: string;
    name: string;
    start: string;
    end: string;
    progress: number;
    dependencies: string;
    custom_class?: string | undefined;
  }

  interface EnrichedTask extends Task {
    _start: Date;
    _end: Date;
    _index: number;
    invalid?: boolean | undefined;
  }

  interface Options {
    readonly?: boolean | undefined;
    header_height?: number | undefined;
    column_width?: number | undefined;
    step?: number | undefined;
    view_modes?: viewMode[] | undefined;
    bar_height?: number | undefined;
    bar_corner_radius?: number | undefined;
    arrow_curve?: number | undefined;
    padding?: number | undefined;
    view_mode?: viewMode | undefined;
    date_format?: string | undefined;
    custom_popup_html?: string | ((task: EnrichedTask) => string) | undefined;
    language?: string | undefined;
    on_click?: ((task: EnrichedTask) => void) | undefined;
    on_date_change?:
      | ((task: EnrichedTask, start: Date, end: Date) => void)
      | undefined;
    on_progress_change?:
      | ((task: EnrichedTask, progress: number) => void)
      | undefined;
    on_view_change?: ((mode: viewMode) => void) | undefined;
  }

  type viewMode =
    | "Quarter Day"
    | "Half Day"
    | "Day"
    | "Week"
    | "Month"
    | "Year";

  type viewModeKey =
    | "QUARTER_DAY"
    | "HALF_DAY"
    | "DAY"
    | "WEEK"
    | "MONTH"
    | "YEAR";

  const VIEW_MODE: Record<viewModeKey, viewMode>;
}

declare module "frappe-gantt" {
  export = Gantt;
}
