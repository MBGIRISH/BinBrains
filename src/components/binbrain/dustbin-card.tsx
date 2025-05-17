"use client";

import type { Dustbin } from '@/types/dustbin';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Trash2, AlertTriangle, CheckCircle2, Gauge } from 'lucide-react';

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
  } else if (fillLevel >= 100) {
    statusColorClass = 'bg-[hsl(var(--status-error-bg))]';
    statusTextColorClass = 'text-[hsl(var(--status-error-bg))]';
    statusIcon = <AlertTriangle className="w-5 h-5 mr-2 text-[hsl(var(--status-error-bg))]" />;
    statusText = "Full";
  }
  
  const displayFillLevel = Math.min(fillLevel, 100);

  return (
    <Card className="card-hover bg-card/50 backdrop-blur-sm border-2 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-xl">
          <span className="font-bold">{name}</span>
          <span className={cn(
            "text-sm font-semibold flex items-center px-3 py-1 rounded-full transition-colors duration-300",
            statusTextColorClass,
            "bg-opacity-10 hover:bg-opacity-20"
          )}>
            {statusIcon}
            {statusText}
          </span>
        </CardTitle>
        <CardDescription className="text-base flex items-center gap-2">
          <Gauge className="w-4 h-4" />
          Fill Level: {fillLevel}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Progress 
            value={displayFillLevel} 
            className={cn(
              "h-4 rounded-full [&>div]:transition-all [&>div]:duration-500",
              statusColorClass
            )} 
          />
          {fillLevel >= 100 && (
            <p className="text-xs text-center mt-2 font-semibold text-[hsl(var(--status-error-bg))] animate-pulse">
              FULL! Please empty the bin.
            </p>
          )}
        </div>
        
        <div className="space-y-3">
          <label htmlFor={`slider-${id}`} className="text-sm font-medium text-muted-foreground block">
            Simulate Fill Level
          </label>
          <div className="space-y-2">
            <Slider
              id={`slider-${id}`}
              min={0}
              max={100}
              step={1}
              value={[fillLevel]}
              onValueChange={handleSliderChange}
              className="my-2 transition-all duration-300"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span className="font-medium text-primary">{fillLevel}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={handleEmptyBin} 
          className="w-full btn-secondary focus-ring transition-all duration-300 hover:scale-[1.02]"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Empty Bin
        </Button>
      </CardFooter>
    </Card>
  );
}
