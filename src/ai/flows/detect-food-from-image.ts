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
      'A photo of food, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type DetectFoodFromImageInput = z.infer<typeof DetectFoodFromImageInputSchema>;

const DetectFoodFromImageOutputSchema = z.object({
  foodName: z.string().describe('Nama makanan yang terdeteksi.'),
  description: z.string().describe('Deskripsi singkat tentang makanan yang terdeteksi.'),
  ingredients: z.array(z.string()).describe('Daftar bahan-bahan yang biasanya ditemukan dalam makanan yang terdeteksi.'),
  nutritionPerServing: z.string().describe('Rincian nutrisi terperinci per porsi dari makanan yang terdeteksi.'),
});
export type DetectFoodFromImageOutput = z.infer<typeof DetectFoodFromImageOutputSchema>;

export async function detectFoodFromImage(input: DetectFoodFromImageInput): Promise<DetectFoodFromImageOutput> {
  return detectFoodFromImageFlow(input);
}

const detectFoodFromImagePrompt = ai.definePrompt({
  name: 'detectFoodFromImagePrompt',
  input: {schema: DetectFoodFromImageInputSchema},
  output: {schema: DetectFoodFromImageOutputSchema},
  prompt: `Anda adalah seorang ahli gizi dan pakar makanan dari Indonesia. Berdasarkan gambar yang diberikan, berikan respons dalam Bahasa Indonesia.

Tugas Anda adalah:
1.  Identifikasi nama makanan dalam gambar.
2.  Berikan deskripsi singkat dan menarik tentang makanan tersebut.
3.  Sediakan daftar bahan-bahan utama untuk membuat makanan ini.
4.  Berikan rincian nutrisi yang lengkap untuk satu porsi sajian. Sertakan informasi seperti kalori, protein, karbohidrat, lemak, vitamin, dan mineral utama. Pastikan formatnya jelas dan mudah dibaca.

Gambar: {{media url=photoDataUri}}`,
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
