"use client";

import { useState, useTransition } from 'react';
import type { DetectFoodFromImageOutput } from '@/ai/flows/detect-food-from-image';
import { analyzeImageAction } from '@/app/actions';
import ImageUploader from './image-uploader';
import ResultsDisplay from './results-display';
import { useToast } from '@/hooks/use-toast';
import { Utensils } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function FoodWiseApp() {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<DetectFoodFromImageOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleImageAnalysis = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const photoDataUri = reader.result as string;
      setImagePreview(photoDataUri);
      setStatus('loading');
      setError(null);
      setResult(null);
      
      startTransition(async () => {
        try {
          const analysisResult = await analyzeImageAction({ photoDataUri });
          if (!analysisResult || !analysisResult.foodName) {
              throw new Error('Could not analyze the image. Please try a different one.');
          }
          setResult(analysisResult);
          setStatus('success');
        } catch (e: any) {
          const errorMessage = e.message || 'An unexpected error occurred.';
          setError(errorMessage);
          setStatus('error');
          toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: errorMessage,
          });
        }
      });
    };
    reader.onerror = () => {
        const errorMessage = 'Failed to read the image file.';
        setError(errorMessage);
        setStatus('error');
        toast({
            variant: 'destructive',
            title: 'File Error',
            description: errorMessage,
        });
    };
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setImagePreview(null);
    setError(null);
  };

  const isLoading = status === 'loading' || isPending;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary flex items-center justify-center gap-4">
          <Utensils className="w-10 h-10 md:w-12 md:h-12" />
          FoodWise
        </h1>
        <p className="text-muted-foreground text-lg mt-2 font-body">
          Your AI-powered nutrition guide.
        </p>
      </header>
      
      {status === 'idle' || status === 'error' ? (
        <div className="animate-in fade-in-50 duration-500">
          <ImageUploader onAnalyze={handleImageAnalysis} status={isLoading ? 'loading' : status} />
        </div>
      ) : (
        <div className="animate-in fade-in-50 duration-500">
          <ResultsDisplay
            result={result}
            imagePreview={imagePreview!}
            isLoading={isLoading}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
}
