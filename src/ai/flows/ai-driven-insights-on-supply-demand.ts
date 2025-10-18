'use server';
/**
 * @fileOverview AI-driven insights on blood supply versus demand trends and donor engagement.
 *
 * - generateSupplyDemandInsights - A function that generates insights on blood supply and demand.
 * - SupplyDemandInput - The input type for the generateSupplyDemandInsights function.
 * - SupplyDemandOutput - The return type for the generateSupplyDemandInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupplyDemandInputSchema = z.object({
  donorData: z.string().describe('Aggregated data about donors, including blood types, donation history, and engagement metrics.'),
  requestData: z.string().describe('Aggregated data about blood requests, including blood types, urgency, and fulfillment status.'),
  regionalData: z.string().describe('Aggregated data about blood supply and demand trends in different regions.'),
});
export type SupplyDemandInput = z.infer<typeof SupplyDemandInputSchema>;

const SupplyDemandOutputSchema = z.object({
  supplyDemandAnalysis: z.string().describe('An analysis of blood supply versus demand trends.'),
  regionalShortages: z.string().describe('Information about regional blood shortages.'),
  donorEngagementInsights: z.string().describe('Insights into donor engagement and potential strategies for improvement.'),
});
export type SupplyDemandOutput = z.infer<typeof SupplyDemandOutputSchema>;

export async function generateSupplyDemandInsights(input: SupplyDemandInput): Promise<SupplyDemandOutput> {
  return supplyDemandInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supplyDemandInsightsPrompt',
  input: {schema: SupplyDemandInputSchema},
  output: {schema: SupplyDemandOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing blood supply and demand data to provide actionable insights.

  Analyze the provided data to identify trends, shortages, and opportunities for improved donor engagement.

  Donor Data: {{{donorData}}}
  Request Data: {{{requestData}}}
  Regional Data: {{{regionalData}}}

  Provide the following:
  - A detailed analysis of blood supply versus demand trends.
  - Identification of any regional blood shortages and their potential causes.
  - Actionable insights into donor engagement, including strategies for improvement.

  Format your response in a clear and concise manner.
  `,
});

const supplyDemandInsightsFlow = ai.defineFlow(
  {
    name: 'supplyDemandInsightsFlow',
    inputSchema: SupplyDemandInputSchema,
    outputSchema: SupplyDemandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
