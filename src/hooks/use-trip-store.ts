
"use client";

import type { TripDetails, DailyNotes } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';

const TRIP_DETAILS_KEY = 'journeyJournal_tripDetails';
const DAILY_NOTES_KEY = 'journeyJournal_dailyNotes';

export function useTripStore() {
  const [tripDetails, setTripDetailsState] = useState<TripDetails | null>(null);
  const [dailyNotes, setDailyNotesState] = useState<DailyNotes>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedTripDetails = localStorage.getItem(TRIP_DETAILS_KEY);
        if (storedTripDetails) {
          setTripDetailsState(JSON.parse(storedTripDetails));
        }
        const storedDailyNotes = localStorage.getItem(DAILY_NOTES_KEY);
        if (storedDailyNotes) {
          setDailyNotesState(JSON.parse(storedDailyNotes));
        }
      } catch (error) {
        console.error("Failed to load data from localStorage", error);
      }
      setIsInitialized(true);
    }
  }, []);

  const setTripDetails = useCallback((details: TripDetails | null) => {
    setTripDetailsState(details);
    if (typeof window !== 'undefined') {
      if (details) {
        localStorage.setItem(TRIP_DETAILS_KEY, JSON.stringify(details));
      } else {
        localStorage.removeItem(TRIP_DETAILS_KEY);
      }
    }
  }, []);

  const setDailyNote = useCallback((date: string, note: string) => {
    const newNotes = { ...dailyNotes, [date]: note };
    setDailyNotesState(newNotes);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DAILY_NOTES_KEY, JSON.stringify(newNotes));
    }
  }, [dailyNotes]);
  
  const getDailyNote = useCallback((date: string): string => {
    return dailyNotes[date] || "";
  }, [dailyNotes]);

  const clearTripData = useCallback(() => {
    setTripDetails(null);
    setDailyNotesState({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TRIP_DETAILS_KEY);
      localStorage.removeItem(DAILY_NOTES_KEY);
    }
  }, [setTripDetails]);

  return {
    tripDetails,
    setTripDetails,
    dailyNotes,
    setDailyNote,
    getDailyNote,
    clearTripData,
    isInitialized,
  };
}
