'use server';

/**
 * @fileOverview Provides activity suggestions for a given destination.
 *
 * - suggestActivities - A function that suggests activities for a destination.
 * - SuggestActivitiesInput - The input type for the suggestActivities function.
 * - SuggestActivitiesOutput - The return type for the suggestActivities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestActivitiesInputSchema = z.object({
  destination: z.string().describe('The destination for the trip.'),
  durationDays: z.number().describe('The number of days of the trip.'),
});
export type SuggestActivitiesInput = z.infer<typeof SuggestActivitiesInputSchema>;

const SuggestActivitiesOutputSchema = z.object({
  activities: z
    .array(z.string())
    .describe('An array of suggested activities for the destination.'),
});
export type SuggestActivitiesOutput = z.infer<typeof SuggestActivitiesOutputSchema>;

export async function suggestActivities(input: SuggestActivitiesInput): Promise<SuggestActivitiesOutput> {
  return suggestActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActivitiesPrompt',
  input: {schema: SuggestActivitiesInputSchema},
  output: {schema: SuggestActivitiesOutputSchema},
  prompt: `Suggest activities for a trip to {{destination}} lasting {{durationDays}} days. Provide a list of activities to do there.  Do not suggest any specific dates or times, just a list of suggestions.  Format the output as a JSON array of strings.`,
});

const suggestActivitiesFlow = ai.defineFlow(
  {
    name: 'suggestActivitiesFlow',
    inputSchema: SuggestActivitiesInputSchema,
    outputSchema: SuggestActivitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
