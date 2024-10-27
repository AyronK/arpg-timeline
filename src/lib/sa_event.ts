/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    sa_event?: {
      (...args: any[]): void;
      q?: any[];
    };
  }
}

export const sa_event = (...args: any[]) => {
  if (typeof window !== "undefined") {
    window.sa_event =
      window.sa_event ||
      ((...eventArgs: any[]) => {
        if (window.sa_event?.q) {
          window.sa_event.q.push(eventArgs);
        } else {
          window.sa_event!.q = [eventArgs];
        }
      });

    window.sa_event?.(...args);
  }
};
