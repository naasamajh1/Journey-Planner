
export interface TripDetails {
  destination: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

export type DailyNotes = Record<string, string>; // Key is ISO date string (YYYY-MM-DD)
