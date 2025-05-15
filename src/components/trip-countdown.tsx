
"use client";

import { useState, useEffect } from 'react';
import { differenceInSeconds, intervalToDuration, isPast, isFuture } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface TripCountdownProps {
  targetDate: string; // ISO date string
  tripEndDate: string; // ISO date string
}

export function TripCountdown({ targetDate, tripEndDate }: TripCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<Duration | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const startDate = new Date(targetDate);
    const endDate = new Date(tripEndDate);

    if (!isFuture(startDate) && !isFuture(endDate)) {
      setMessage('Your amazing trip has concluded!');
      setTimeRemaining(null);
      return;
    }
    
    if (!isFuture(startDate) && isFuture(endDate)) {
      setMessage('Your adventure is underway!');
      setTimeRemaining(null); // Or countdown to end date
      return;
    }
    
    setMessage('Countdown to your next adventure!');

    const calculateTimeRemaining = () => {
      const now = new Date();
      const secondsLeft = differenceInSeconds(startDate, now);

      if (secondsLeft <= 0) {
        if (isFuture(endDate)) {
          setMessage('Your adventure is underway!');
        } else {
          setMessage('Your amazing trip has concluded!');
        }
        setTimeRemaining(null);
        if (intervalId) clearInterval(intervalId);
        return;
      }
      setTimeRemaining(intervalToDuration({ start: now, end: startDate }));
    };

    calculateTimeRemaining();
    const intervalId = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate, tripEndDate]);

  const formatUnit = (value?: number) => (value || 0).toString().padStart(2, '0');

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl flex items-center">
          <Clock className="mr-3 h-7 w-7 text-primary" />
          {message}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timeRemaining ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-4xl font-bold text-primary">{formatUnit(timeRemaining.days)}</div>
              <div className="text-sm text-muted-foreground">Days</div>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-4xl font-bold text-primary">{formatUnit(timeRemaining.hours)}</div>
              <div className="text-sm text-muted-foreground">Hours</div>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-4xl font-bold text-primary">{formatUnit(timeRemaining.minutes)}</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-4xl font-bold text-primary">{formatUnit(timeRemaining.seconds)}</div>
              <div className="text-sm text-muted-foreground">Seconds</div>
            </div>
          </div>
        ) : (
          <p className="text-lg text-center py-4">{/* Message is already shown in title */}</p>
        )}
      </CardContent>
    </Card>
  );
}
