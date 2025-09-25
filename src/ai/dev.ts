import { config } from 'dotenv';
config();

import '@/ai/flows/detect-food-from-image.ts';
import '@/ai/flows/provide-nutritional-breakdown.ts';
import '@/ai/flows/list-ingredients-for-detected-food.ts';