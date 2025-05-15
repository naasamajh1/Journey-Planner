
"use client";

import type { TripDetails } from '@/lib/types';
import { useTripStore } from '@/hooks/use-trip-store';
import { eachDayOfInterval, format, formatISO, parseISO } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CalendarDays, NotebookText, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';

interface DailyPlannerProps {
  tripDetails: TripDetails;
}

interface DayNote {
  date: string; // YYYY-MM-DD
  note: string;
}

export function DailyPlanner({ tripDetails }: DailyPlannerProps) {
  const { dailyNotes, setDailyNote, getDailyNote } = useTripStore();
  const [currentNotes, setCurrentNotes] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Initialize currentNotes from dailyNotes store when component mounts or tripDetails change
    const initialNotes: Record<string, string> = {};
    if (tripDetails) {
      const days = eachDayOfInterval({
        start: parseISO(tripDetails.startDate),
        end: parseISO(tripDetails.endDate),
      });
      days.forEach(day => {
        const dateStr = formatISO(day, { representation: 'date' });
        initialNotes[dateStr] = getDailyNote(dateStr);
      });
    }
    setCurrentNotes(initialNotes);
  }, [tripDetails, dailyNotes, getDailyNote]);


  if (!tripDetails) {
    return <p>Loading trip details...</p>;
  }

  const days = eachDayOfInterval({
    start: parseISO(tripDetails.startDate),
    end: parseISO(tripDetails.endDate),
  });

  const handleNoteChange = (date: string, value: string) => {
    setCurrentNotes(prev => ({ ...prev, [date]: value }));
  };

  const handleSaveNote = (date: string) => {
    setDailyNote(date, currentNotes[date] || '');
    toast({
      title: "Note Saved!",
      description: `Your notes for ${format(parseISO(date), 'MMMM d, yyyy')} have been saved.`,
      duration: 3000,
    });
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
            <CalendarDays className="mr-3 h-7 w-7 text-primary"/>
            Daily Itinerary
        </CardTitle>
        <CardDescription>
            Plan your activities and keep notes for each day of your trip to {tripDetails.destination}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {days.length === 0 && <p className="text-muted-foreground p-4 text-center">No days to plan. Check your trip dates.</p>}
        <Accordion type="single" collapsible className="w-full space-y-2" defaultValue={`day-0`}>
          {days.map((day, index) => {
            const dateStr = formatISO(day, { representation: 'date' });
            const dayNumber = index + 1;
            return (
              <AccordionItem value={`day-${index}`} key={dateStr} className="bg-background rounded-lg border">
                <AccordionTrigger className="px-4 py-3 text-lg hover:no-underline [&[data-state=open]>svg]:text-primary">
                  <div className="flex items-center">
                    <span className="text-primary font-semibold mr-2">Day {dayNumber}:</span> 
                    {format(day, 'EEEE, MMMM d, yyyy')}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-3">
                  <div className="flex items-start space-x-2">
                     <NotebookText className="h-5 w-5 mt-2 text-primary flex-shrink-0" />
                    <Textarea
                      placeholder={`Notes for Day ${dayNumber}... What adventures await?`}
                      value={currentNotes[dateStr] || ''}
                      onChange={(e) => handleNoteChange(dateStr, e.target.value)}
                      className="min-h-[120px] focus:ring-primary focus:border-primary"
                      rows={5}
                    />
                  </div>
                  <Button onClick={() => handleSaveNote(dateStr)} size="sm" className="float-right">
                    <Save className="mr-2 h-4 w-4" /> Save Note
                  </Button>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
