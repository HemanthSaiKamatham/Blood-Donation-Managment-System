'use server';

/**
 * @fileOverview An AI-powered request fulfillment flow for matching blood requests to donors.
 *
 * - aiPoweredRequestFulfillment - A function that handles the blood request fulfillment process.
 * - AIPoweredRequestFulfillmentInput - The input type for the aiPoweredRequestFulfillment function.
 * - AIPoweredRequestFulfillmentOutput - The return type for the aiPoweredRequestFulfillment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPoweredRequestFulfillmentInputSchema = z.object({
  bloodType: z.string().describe('The blood type requested (e.g., A+, O-).'),
  unitsRequired: z.number().describe('The number of blood units required.'),
  urgency: z.string().describe('The urgency of the request (e.g., high, medium, low).'),
  donorAvailability: z.string().describe('Donor availability information.'),
  requestDetails: z.string().describe('Additional details about the blood request.'),
});
export type AIPoweredRequestFulfillmentInput = z.infer<
  typeof AIPoweredRequestFulfillmentInputSchema
>;

const AIPoweredRequestFulfillmentOutputSchema = z.object({
  matchedDonors: z
    .string()
    .describe(
      'A list of potential donors matched to the request, including their names and contact information.'
    ),
  fulfillmentSummary:
    z.string().describe('A summary of how the request can be fulfilled.'),
});
export type AIPoweredRequestFulfillmentOutput = z.infer<
  typeof AIPoweredRequestFulfillmentOutputSchema
>;

export async function aiPoweredRequestFulfillment(
  input: AIPoweredRequestFulfillmentInput
): Promise<AIPoweredRequestFulfillmentOutput> {
  return aiPoweredRequestFulfillmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredRequestFulfillmentPrompt',
  input: {schema: AIPoweredRequestFulfillmentInputSchema},
  output: {schema: AIPoweredRequestFulfillmentOutputSchema},
  prompt: `You are an AI assistant that matches blood requests from hospitals to suitable donors.

  Given the following blood request details, identify potential donors based on blood group compatibility, urgency, and donor availability.

  Blood Type: {{{bloodType}}}
  Units Required: {{{unitsRequired}}}
  Urgency: {{{urgency}}}
  Donor Availability: {{{donorAvailability}}}
  Request Details: {{{requestDetails}}}

  Provide a list of matched donors and a summary of how the request can be fulfilled. Make sure to include enough detail so the hospital can proceed with contacting the donor.

  Output the matchedDonors and fulfillmentSummary fields.
`,
});

const aiPoweredRequestFulfillmentFlow = ai.defineFlow(
  {
    name: 'aiPoweredRequestFulfillmentFlow',
    inputSchema: AIPoweredRequestFulfillmentInputSchema,
    outputSchema: AIPoweredRequestFulfillmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
