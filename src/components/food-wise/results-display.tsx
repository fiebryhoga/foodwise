import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { DetectFoodFromImageOutput } from "@/ai/flows/detect-food-from-image";
import { ArrowLeft, RefreshCw, Flame, Beef, Wheat, Droplets, Leaf, Info, Utensils } from "lucide-react";
import Image from "next/image";
import NutritionCard from "./nutrition-card";

interface ResultsDisplayProps {
  result: DetectFoodFromImageOutput | null;
  imagePreview: string;
  isLoading: boolean;
  onReset: () => void;
}

const parseNutrition = (nutritionText: string) => {
    const lines = nutritionText.split('\n').filter(line => line.trim() !== '');
    const nutritionData = [];
    
    for (const line of lines) {
        if (!line.includes(':')) continue;
        const parts = line.split(':');
        const key = parts[0].replace(/[-\*]/g, '').trim().toLowerCase();
        const value = parts.slice(1).join(':').trim();
        let icon = Info;

        if (key.includes('kalori')) icon = Flame;
        else if (key.includes('protein')) icon = Beef;
        else if (key.includes('karbohidrat')) icon = Wheat;
        else if (key.includes('lemak')) icon = Droplets;
        else if (key.includes('vitamin') || key.includes('mineral')) icon = Leaf;

        nutritionData.push({ label: parts[0].replace(/[-\*]/g, '').trim(), value, icon });
    }
    return nutritionData;
}

export default function ResultsDisplay({ result, imagePreview, isLoading, onReset }: ResultsDisplayProps) {
  const nutrition = result ? parseNutrition(result.nutritionPerServing) : [];

  return (
    <Card className="w-full shadow-lg border-border/50">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <Button variant="ghost" size="sm" onClick={onReset} className="mb-2 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-64 rounded-md" />
                <Skeleton className="h-4 w-full max-w-sm mt-3 rounded-md" />
              </>
            ) : (
              <>
                <CardTitle className="font-headline text-4xl">{result?.foodName}</CardTitle>
                <CardDescription className="text-lg mt-2 font-body max-w-prose">{result?.description}</CardDescription>
              </>
            )}
          </div>
          <Button variant="outline" size="icon" onClick={onReset} aria-label="Analisis gambar lain">
              <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex flex-col gap-8">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border shadow-inner bg-muted/20">
              <Image src={imagePreview} alt={result?.foodName || 'Uploaded food'} fill className="object-contain" />
            </div>
            
            <div>
              <h3 className="font-headline text-2xl mb-4 flex items-center gap-2"><Utensils className="h-6 w-6 text-primary" /> Bahan-bahan</h3>
              {isLoading ? (
                <div className="flex flex-wrap gap-2">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}
                </div>
              ) : result?.ingredients && result.ingredients.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.ingredients.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-md px-3 py-1 bg-primary/10 text-primary-foreground border-primary/20">
                      {item}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Informasi bahan tidak tersedia.</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-headline text-2xl mb-4">Informasi Gizi (per porsi)</h3>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center p-4 border rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full mr-4"/>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20"/>
                      <Skeleton className="h-6 w-16"/>
                    </div>
                  </div>
                ))}
              </div>
            ) : nutrition.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nutrition.map((item, index) => (
                  <NutritionCard key={index} label={item.label} value={item.value} Icon={item.icon} />
                ))}
              </div>
            ) : result?.nutritionPerServing ? (
                <p className="text-sm text-foreground whitespace-pre-wrap font-body bg-muted/30 p-4 rounded-md border">{result.nutritionPerServing}</p>
            ) : (
                <p className="text-muted-foreground">Informasi gizi tidak tersedia.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
