
"use client";

import { TripSetupForm } from '@/components/trip-setup-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTripStore } from '@/hooks/use-trip-store';
import { Plane, Rocket } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { tripDetails, clearTripData, isInitialized } = useTripStore();
  const router = useRouter();

  const handlePlanNewTrip = () => {
    clearTripData();
    // Force re-render or ensure state is reset for form
    router.refresh(); // Or a more sophisticated state reset if needed
  };

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <Rocket className="h-12 w-12 animate-pulse text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your journeys...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="inline-block mx-auto p-3 bg-primary/10 rounded-full mb-4">
            <Rocket className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary-foreground text-transparent bg-clip-text">
            Journey Journal
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Plan your adventures, one day at a time.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {tripDetails ? (
            <div className="space-y-6 text-center">
              <p className="text-xl">
                Welcome back! You have a trip planned to <strong className="text-primary">{tripDetails.destination}</strong>.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                <Button asChild size="lg" className="flex-1">
                  <Link href="/planner">
                    <Plane className="mr-2 h-5 w-5" /> View My Trip Plan
                  </Link>
                </Button>
                <Button variant="outline" size="lg" onClick={handlePlanNewTrip} className="flex-1">
                  Plan a New Trip
                </Button>
              </div>
            </div>
          ) : (
            <TripSetupForm />
          )}
        </CardContent>
      </Card>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Journey Journal. Your adventure starts here.</p>
      </footer>
    </main>
  );
}
