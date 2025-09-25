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
  nutritionPerServing: z.string().describe('Rincian nutrisi terperinci per porsi dari makanan yang terdeteksi, termasuk kalori, protein, karbohidrat, lemak total (lemak jenuh, lemak tak jenuh tunggal, lemak tak jenuh ganda), kolesterol, natrium, serat, gula, serta vitamin dan mineral penting.'),
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
1. Identifikasi nama makanan dalam gambar.
2. Berikan deskripsi singkat dan menarik tentang makanan tersebut.
3. Sediakan daftar bahan-bahan utama untuk membuat makanan ini.
4. Sediakan rincian nutrisi yang sangat lengkap untuk satu porsi sajian. Format harus jelas dan mudah dibaca. Wajib sertakan detail berikut:
    - Kalori (kcal)
    - Protein (gram)
    - Karbohidrat (gram)
    - Lemak Total (gram), dengan rincian:
        - Lemak Jenuh (gram)
        - Lemak Tak Jenuh Tunggal (gram)
        - Lemak Tak Jenuh Ganda (gram)
    - Kolesterol (mg)
    - Serat (gram)
    - Gula (gram)
    - Natrium (mg)
    - Vitamin-vitamin utama (misal: Vitamin A, Vitamin C, Vitamin D, dll.)
    - Mineral-mineral utama (misal: Kalsium, Zat Besi, Kalium, dll.)

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
