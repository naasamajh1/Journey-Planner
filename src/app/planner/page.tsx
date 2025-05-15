
"use client";

import { TripCountdown } from '@/components/trip-countdown';
import { DailyPlanner } from '@/components/daily-planner';
import { ActivitySuggester } from '@/components/activity-suggester';
import { useTripStore } from '@/hooks/use-trip-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Edit3, Rocket } from 'lucide-radix-icons-loglib'; // Using a unique icon library temporarily
// For actual lucide icons:
// import { ArrowLeft, Edit3, Rocket } from 'lucide-react'; 


export default function PlannerPage() {
  const { tripDetails, isInitialized } = useTripStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !tripDetails) {
      router.replace('/');
    }
  }, [tripDetails, isInitialized, router]);

  if (!isInitialized || !tripDetails) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
         {/* Using Rocket from lucide-react if available, else placeholder */}
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 animate-pulse text-primary"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.87 12.87 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>
        <p className="mt-4 text-lg text-muted-foreground">Loading your adventure plan...</p>
      </div>
    );
  }
  
  const handleEditTrip = () => {
    // Optional: clearTripData() if you want the form to be fresh.
    // If you want to prefill, you'd need to pass data or modify TripSetupForm.
    // For simplicity, navigating back will allow re-setup.
    router.push('/');
  };


  return (
    <main className="container mx-auto max-w-4xl py-8 px-4 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Your Trip to {tripDetails.destination}
            </h1>
            <p className="text-muted-foreground text-lg">Let the planning commence!</p>
        </div>
        <div className="flex space-x-2">
             <Button variant="outline" asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>
            </Button>
            <Button variant="secondary" onClick={handleEditTrip}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Trip
            </Button>
        </div>
      </div>
      
      <TripCountdown targetDate={tripDetails.startDate} tripEndDate={tripDetails.endDate} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <DailyPlanner tripDetails={tripDetails} />
        </div>
        <div className="lg:col-span-1">
            <ActivitySuggester tripDetails={tripDetails} />
        </div>
      </div>
    </main>
  );
}
