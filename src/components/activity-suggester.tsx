
"use client";

import { suggestActivities } from '@/ai/flows/suggest-activities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { TripDetails } from '@/lib/types';
import { differenceInDays, parseISO } from 'date-fns';

interface ActivitySuggesterProps {
  tripDetails: TripDetails;
}

export function ActivitySuggester({ tripDetails }: ActivitySuggesterProps) {
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestActivities = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const durationDays = differenceInDays(parseISO(tripDetails.endDate), parseISO(tripDetails.startDate)) + 1;
      const result = await suggestActivities({
        destination: tripDetails.destination,
        durationDays: durationDays > 0 ? durationDays : 1,
      });
      setSuggestions(result.activities);
    } catch (err) {
      setError('Failed to get activity suggestions. Please try again.');
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-3 h-6 w-6 text-primary" />
          Activity Ideas for {tripDetails.destination}
        </CardTitle>
        <CardDescription>
          Let AI help you brainstorm activities for your trip!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Generating ideas...</p>
          </div>
        )}
        {error && <p className="text-destructive text-center p-4">{error}</p>}
        {suggestions && suggestions.length > 0 && (
          <ul className="space-y-3 list-disc list-inside bg-secondary/30 p-4 rounded-md">
            {suggestions.map((activity, index) => (
              <li key={index} className="text-foreground/90">
                {activity}
              </li>
            ))}
          </ul>
        )}
        {suggestions && suggestions.length === 0 && (
           <p className="text-muted-foreground text-center p-4">No specific suggestions found. Try broadening your search or check your destination spelling.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSuggestActivities} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          {suggestions ? 'Get New Suggestions' : 'Suggest Activities'}
        </Button>
      </CardFooter>
    </Card>
  );
}
