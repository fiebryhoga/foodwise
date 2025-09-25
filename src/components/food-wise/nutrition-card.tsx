import { Card } from "@/components/ui/card";
import { type LucideProps, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NutritionCardProps {
  Icon: LucideIcon | React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  label: string;
  value: string;
  className?: string;
}

export default function NutritionCard({ Icon, label, value, className }: NutritionCardProps) {
  return (
    <Card className={cn("bg-transparent flex items-center p-4 border-border/80 shadow-sm", className)}>
        <div className="p-3 rounded-full bg-accent/20 mr-4">
            <Icon className="h-6 w-6 text-accent" />
        </div>
        <div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-lg font-bold text-foreground">{value}</p>
        </div>
    </Card>
  );
}
