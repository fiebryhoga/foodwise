'use server';
/**
 * @fileOverview An AI agent for providing a detailed nutritional breakdown of a detected food item and its ingredients.
 *
 * - provideNutritionalBreakdown - A function that handles the process of providing a nutritional breakdown.
 * - ProvideNutritionalBreakdownInput - The input type for the provideNutritionalBreakdown function.
 * - ProvideNutritionalBreakdownOutput - The return type for the provideNutritionalBreakdown function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideNutritionalBreakdownInputSchema = z.object({
  foodName: z.string().describe('The name of the detected food item.'),
  ingredients: z.array(z.string()).describe('A list of ingredients in the food item.'),
});
export type ProvideNutritionalBreakdownInput = z.infer<typeof ProvideNutritionalBreakdownInputSchema>;

const ProvideNutritionalBreakdownOutputSchema = z.object({
  nutritionalInformation: z.string().describe('A detailed nutritional breakdown of the food item and its ingredients.'),
});
export type ProvideNutritionalBreakdownOutput = z.infer<typeof ProvideNutritionalBreakdownOutputSchema>;

export async function provideNutritionalBreakdown(input: ProvideNutritionalBreakdownInput): Promise<ProvideNutritionalBreakdownOutput> {
  return provideNutritionalBreakdownFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideNutritionalBreakdownPrompt',
  input: {schema: ProvideNutritionalBreakdownInputSchema},
  output: {schema: ProvideNutritionalBreakdownOutputSchema},
  prompt: `Provide a detailed nutritional breakdown of the following food item and its ingredients:

Food Item: {{{foodName}}}
Ingredients: {{#each ingredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Please include information on calories, protein, carbohydrates, fats, vitamins, and minerals. Use the tool to check if the ingredients are valid. Format the output in a clear and easy-to-understand manner.
`,
});

const provideNutritionalBreakdownFlow = ai.defineFlow(
  {
    name: 'provideNutritionalBreakdownFlow',
    inputSchema: ProvideNutritionalBreakdownInputSchema,
    outputSchema: ProvideNutritionalBreakdownOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
