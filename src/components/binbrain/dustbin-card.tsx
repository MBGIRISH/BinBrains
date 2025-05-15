"use client";

import type { Dustbin } from '@/types/dustbin';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DustbinCardProps {
  dustbin: Dustbin;
  onFillLevelChange: (id: string, newFillLevel: number) => void;
  onEmptyBin: (id: string) => void;
  alertThreshold: number;
}

export function DustbinCard({ dustbin, onFillLevelChange, onEmptyBin, alertThreshold }: DustbinCardProps) {
  const { id, name, fillLevel } = dustbin;

  const handleSliderChange = (value: number[]) => {
    onFillLevelChange(id, value[0]);
  };

  const handleEmptyBin = () => {
    onEmptyBin(id);
  };

  let statusColorClass = 'bg-[hsl(var(--status-ok-bg))]';
  let statusTextColorClass = 'text-[hsl(var(--status-ok-bg))]';
  let statusIcon = <CheckCircle2 className="w-5 h-5 mr-2 text-[hsl(var(--status-ok-bg))]" />;
  let statusText = "Optimal";

  if (fillLevel >= alertThreshold && fillLevel < 100) {
    statusColorClass = 'bg-[hsl(var(--status-warning-bg))]';
    statusTextColorClass = 'text-[hsl(var(--status-warning-bg))]';
    statusIcon = <AlertTriangle className="w-5 h-5 mr-2 text-[hsl(var(--status-warning-bg))]" />;
    statusText = "Needs Attention";
  } else if (fillLevel >= 100 && fillLevel <= 110) { // Cap overfilled visual slightly for progress bar
    statusColorClass = 'bg-[hsl(var(--status-error-bg))]';
    statusTextColorClass = 'text-[hsl(var(--status-error-bg))]';
    statusIcon = <AlertTriangle className="w-5 h-5 mr-2 text-[hsl(var(--status-error-bg))]" />;
    statusText = "Full";
  } else if (fillLevel > 110) {
    statusColorClass = 'bg-[hsl(var(--status-overfilled-bg))]';
    statusTextColorClass = 'text-[hsl(var(--status-overfilled-bg))]';
    statusIcon = <AlertTriangle className="w-5 h-5 mr-2 text-[hsl(var(--status-overfilled-bg))]" />;
    statusText = "Overfilled";
  }
  
  const displayFillLevel = Math.min(fillLevel, 110); // Cap visual for progress bar display logic


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{name}</span>
          <span className={cn("text-sm font-semibold flex items-center", statusTextColorClass)}>
            {statusIcon}
            {statusText}
          </span>
        </CardTitle>
        <CardDescription>Fill Level: {fillLevel}%</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={displayFillLevel} className={cn("h-6 [&>div]:transition-all [&>div]:duration-500", statusColorClass)} indicatorClassName={statusColorClass} />
          {fillLevel > 100 && (
             <p className="text-xs text-center mt-1 font-semibold text-[hsl(var(--status-overfilled-bg))]">
               OVERFILLED! Actual: {fillLevel}%
             </p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor={`slider-${id}`} className="text-sm font-medium text-muted-foreground">
            Simulate Fill Level
          </label>
          <Slider
            id={`slider-${id}`}
            min={0}
            max={120} // Allow simulating overfill up to 120%
            step={5}
            value={[fillLevel]}
            onValueChange={handleSliderChange}
            className="my-2"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleEmptyBin} className="w-full">
          <Trash2 className="mr-2 h-4 w-4" /> Empty Bin
        </Button>
      </CardFooter>
    </Card>
  );
}
