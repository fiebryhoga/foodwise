'use server';

import { detectFoodFromImage, type DetectFoodFromImageInput, type DetectFoodFromImageOutput } from '@/ai/flows/detect-food-from-image';

export async function analyzeImageAction(
  input: DetectFoodFromImageInput
): Promise<DetectFoodFromImageOutput> {
  try {
    const result = await detectFoodFromImage(input);
    return result;
  } catch (error) {
    console.error('Error in analyzeImageAction:', error);
    throw new Error('Gagal menganalisis makanan dari gambar.');
  }
}
