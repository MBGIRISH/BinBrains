
'use server';
/**
 * @fileOverview An AI agent that gives waste management tips based on the real-time fill status of the smart dustbins.
 *
 * - runWasteManagementTipsFlow - A function that suggests waste management tips.
 * - WasteManagementTipsInput - The input type for the runWasteManagementTipsFlow function.
 * - WasteManagementTipsOutput - The return type for the runWasteManagementTipsFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WasteManagementTipsInputSchema = z.object({
  fillStatus: z
    .number()
    .describe('The fill status of the dustbin as a percentage (0-100).'),
  timeSinceLastEmptied: z
    .string()
    .describe(
      'The amount of time since the dustbin was last emptied (e.g., 2 days, 5 hours).'
    ),
});

const WasteManagementTipsOutputSchema = z.object({
  tips: z.string().describe('Actionable waste management tips.'),
});

export type WasteManagementTipsInput = z.infer<typeof WasteManagementTipsInputSchema>;
export type WasteManagementTipsOutput = z.infer<typeof WasteManagementTipsOutputSchema>;

const getWasteManagementTipsFlow = ai.defineFlow(
  {
    name: 'getWasteManagementTipsFlow', // Changed name to match variable for clarity
    inputSchema: WasteManagementTipsInputSchema,
    outputSchema: WasteManagementTipsOutputSchema,
  },
  async (input: WasteManagementTipsInput): Promise<WasteManagementTipsOutput> => {
    const prompt = `
      You are a helpful assistant specializing in waste management.
      Provide actionable tips for managing waste based on the following dustbin status:
      - Fill Status: ${input.fillStatus}%
      - Time Since Last Emptied: ${input.timeSinceLastEmptied}

      Consider the urgency based on fill level and time.
      Offer 2-3 practical suggestions. For example, if nearly full, suggest emptying soon or reducing waste generation.
      If recently emptied but filling fast, suggest checking for sources of high waste.
      Be concise and clear.
    `;

    const llmResponse = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.0-flash', // Ensure this model is available and appropriate
      config: {
        temperature: 0.5,
      },
    });

    // Ensure llmResponse.text is used correctly for Genkit v1.x
    return {
      tips: llmResponse.text || 'No tips could be generated at this time.',
    };
  }
);

// Helper function to be called from server components or server actions
export async function runWasteManagementTipsFlow(input: WasteManagementTipsInput): Promise<WasteManagementTipsOutput> {
  // 'use server'; // Removed from here, as it's at the top of the file
  try {
    const result = await getWasteManagementTipsFlow(input); // Call the flow directly
    return result;
  } catch (error) {
    console.error("Error running waste management tips flow:", error);
    // Provide a more specific error structure if needed by the client
    throw new Error("Failed to generate waste management tips due to a server error.");
  }
}
