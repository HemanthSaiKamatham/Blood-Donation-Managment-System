'use server';
/**
 * @fileOverview Implements the Smart Notifications for Matching Requests flow.
 *
 * - smartNotificationsForMatchingRequests - A function that sends notifications to donors about matching blood requests.
 * - SmartNotificationsForMatchingRequestsInput - The input type for the smartNotificationsForMatchingRequests function.
 * - SmartNotificationsForMatchingRequestsOutput - The return type for the smartNotificationsForMatchingRequests function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartNotificationsForMatchingRequestsInputSchema = z.object({
  bloodType: z.string().describe('The blood type of the donor.'),
  urgency: z.string().describe('The urgency level of the blood request (e.g., high, medium, low).'),
  unitsRequired: z.number().describe('The number of blood units required.'),
  donorAvailability: z.boolean().describe('Whether the donor is currently available to donate.'),
});
export type SmartNotificationsForMatchingRequestsInput = z.infer<typeof SmartNotificationsForMatchingRequestsInputSchema>;

const SmartNotificationsForMatchingRequestsOutputSchema = z.object({
  notificationMessage: z.string().describe('The notification message to be sent to the donor.'),
});
export type SmartNotificationsForMatchingRequestsOutput = z.infer<typeof SmartNotificationsForMatchingRequestsOutputSchema>;

export async function smartNotificationsForMatchingRequests(input: SmartNotificationsForMatchingRequestsInput): Promise<SmartNotificationsForMatchingRequestsOutput> {
  return smartNotificationsForMatchingRequestsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartNotificationsForMatchingRequestsPrompt',
  input: {schema: SmartNotificationsForMatchingRequestsInputSchema},
  output: {schema: SmartNotificationsForMatchingRequestsOutputSchema},
  prompt: `You are an AI assistant designed to generate notification messages for blood donors based on matching blood requests.\n\nGiven the following information about a blood request:\n- Blood Type: {{{bloodType}}}\n- Urgency: {{{urgency}}}\n- Units Required: {{{unitsRequired}}}\n- Donor Availability: {{{donorAvailability}}}\n\nGenerate a concise and informative notification message for the donor. The message should clearly indicate the urgency and the blood type needed.\n\nExample:\n"Urgent blood request! Type {{{bloodType}}} blood needed.  Hospital requires {{{unitsRequired}}} units. Please respond if available."`,
});

const smartNotificationsForMatchingRequestsFlow = ai.defineFlow(
  {
    name: 'smartNotificationsForMatchingRequestsFlow',
    inputSchema: SmartNotificationsForMatchingRequestsInputSchema,
    outputSchema: SmartNotificationsForMatchingRequestsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
