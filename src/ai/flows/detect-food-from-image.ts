'use server';
/**
 * @fileOverview This file defines a Genkit flow for detecting food items from an image and providing ingredient and nutritional information.
 *
 * - detectFoodFromImage - An asynchronous function that takes an image data URI as input and returns information about the detected food.
 * - DetectFoodFromImageInput - The input type for the detectFoodFromImage function, which includes the image data URI.
 * - DetectFoodFromImageOutput - The output type for the detectFoodFromImage function, which includes the food name, ingredients, and nutrition.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectFoodFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of food, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'    ),
});
export type DetectFoodFromImageInput = z.infer<typeof DetectFoodFromImageInputSchema>;

const DetectFoodFromImageOutputSchema = z.object({
  foodName: z.string().describe('The name of the detected food item.'),
  ingredients: z.string().describe('A list of ingredients typically found in the detected food item.'),
  nutrition: z.string().describe('A detailed nutritional breakdown of the detected food item and its ingredients.'),
});
export type DetectFoodFromImageOutput = z.infer<typeof DetectFoodFromImageOutputSchema>;

export async function detectFoodFromImage(input: DetectFoodFromImageInput): Promise<DetectFoodFromImageOutput> {
  return detectFoodFromImageFlow(input);
}

const detectFoodFromImagePrompt = ai.definePrompt({
  name: 'detectFoodFromImagePrompt',
  input: {schema: DetectFoodFromImageInputSchema},
  output: {schema: DetectFoodFromImageOutputSchema},
  prompt: `You are a food recognition and nutrition expert.  Based on the image, identify the food item, list its ingredients, and provide a detailed nutritional breakdown.\n\nImage: {{media url=photoDataUri}}`,
});

const detectFoodFromImageFlow = ai.defineFlow(
  {
    name: 'detectFoodFromImageFlow',
    inputSchema: DetectFoodFromImageInputSchema,
    outputSchema: DetectFoodFromImageOutputSchema,
  },
  async input => {
    const {output} = await detectFoodFromImagePrompt(input);
    return output!;
  }
);
