'use server';
/**
 * @fileOverview Lists the typical ingredients found in a detected food item using AI.
 *
 * - listIngredientsForDetectedFood - A function that lists the ingredients for a detected food item.
 * - ListIngredientsForDetectedFoodInput - The input type for the listIngredientsForDetectedFood function.
 * - ListIngredientsForDetectedFoodOutput - The return type for the listIngredientsForDetectedFood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ListIngredientsForDetectedFoodInputSchema = z.object({
  foodName: z.string().describe('The name of the detected food item.'),
});
export type ListIngredientsForDetectedFoodInput = z.infer<typeof ListIngredientsForDetectedFoodInputSchema>;

const ListIngredientsForDetectedFoodOutputSchema = z.object({
  ingredients: z.array(z.string()).describe('A list of typical ingredients found in the detected food item.'),
});
export type ListIngredientsForDetectedFoodOutput = z.infer<typeof ListIngredientsForDetectedFoodOutputSchema>;

export async function listIngredientsForDetectedFood(input: ListIngredientsForDetectedFoodInput): Promise<ListIngredientsForDetectedFoodOutput> {
  return listIngredientsForDetectedFoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'listIngredientsForDetectedFoodPrompt',
  input: {schema: ListIngredientsForDetectedFoodInputSchema},
  output: {schema: ListIngredientsForDetectedFoodOutputSchema},
  prompt: `List the typical ingredients found in {{foodName}}.\n\nIngredients: `,
});

const listIngredientsForDetectedFoodFlow = ai.defineFlow(
  {
    name: 'listIngredientsForDetectedFoodFlow',
    inputSchema: ListIngredientsForDetectedFoodInputSchema,
    outputSchema: ListIngredientsForDetectedFoodOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
