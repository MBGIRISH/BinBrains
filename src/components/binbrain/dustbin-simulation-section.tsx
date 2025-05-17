"use client";

import { useState, useEffect } from 'react';
import type { Dustbin } from '@/types/dustbin';
import { DustbinCard } from './dustbin-card';
import { SectionWrapper } from './section-wrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { PlusCircle, Settings2, Loader2, Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { addDustbin, getDustbins, updateDustbin, updateAlertThreshold, getAlertThreshold } from '@/lib/firebase/dustbin-service';
import { Slider } from '@/components/ui/slider';

const initialDustbins: Dustbin[] = [
  { id: 'bin1', name: 'General Waste (Office)', fillLevel: 30, maxCapacity: 100, lastEmptied: new Date(), isAlertActive: false },
  { id: 'bin2', name: 'Recyclables (Kitchen)', fillLevel: 60, maxCapacity: 100, lastEmptied: new Date(), isAlertActive: false },
  { id: 'bin3', name: 'Organic (Cafeteria)', fillLevel: 10, maxCapacity: 100, lastEmptied: new Date(), isAlertActive: false },
];

export function DustbinSimulationSection() {
  const [dustbins, setDustbins] = useState<Dustbin[]>([]);
  const [alertThreshold, setAlertThreshold] = useState(90);
  const [newBinName, setNewBinName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [bins, threshold] = await Promise.all([
        getDustbins(),
        getAlertThreshold()
      ]);
      
      if (bins.length === 0) {
        const defaultBins = await Promise.all(
          initialDustbins.map(async (bin) => {
            const id = await addDustbin(bin);
            return { ...bin, id };
          })
        );
        setDustbins(defaultBins);
      } else {
        setDustbins(bins);
      }
      setAlertThreshold(threshold);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertThresholdChange = async (value: number) => {
    try {
      await updateAlertThreshold(value);
      setAlertThreshold(value);
      toast({
        title: "Alert Threshold Updated",
        description: `Alert threshold set to ${value}%`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alert threshold. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    dustbins.forEach(bin => {
      if (bin.fillLevel >= alertThreshold && !bin.isAlertActive) {
        toast({
          title: "Dustbin Alert!",
          description: `${bin.name} has reached ${bin.fillLevel}% capacity.`,
          variant: bin.fillLevel >= 100 ? "destructive" : "default",
          duration: 5000,
        });
        updateDustbin(bin.id, { isAlertActive: true });
        setDustbins(prev => prev.map(db => db.id === bin.id ? { ...db, isAlertActive: true } : db));
      } else if (bin.fillLevel < alertThreshold && bin.isAlertActive) {
        updateDustbin(bin.id, { isAlertActive: false });
        setDustbins(prev => prev.map(db => db.id === bin.id ? { ...db, isAlertActive: false } : db));
      }
    });
  }, [dustbins, alertThreshold, toast]);

  const handleFillLevelChange = async (id: string, newFillLevel: number) => {
    try {
      await updateDustbin(id, { fillLevel: newFillLevel });
      setDustbins(prevDustbins =>
        prevDustbins.map(bin =>
          bin.id === id ? { ...bin, fillLevel: newFillLevel } : bin
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update fill level. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEmptyBin = async (id: string) => {
    try {
      const now = new Date();
      await updateDustbin(id, { fillLevel: 0, lastEmptied: now, isAlertActive: false });
      setDustbins(prevDustbins =>
        prevDustbins.map(bin =>
          bin.id === id ? { ...bin, fillLevel: 0, lastEmptied: now, isAlertActive: false } : bin
        )
      );
      toast({
        title: "Bin Emptied",
        description: `${dustbins.find(db => db.id === id)?.name} has been emptied.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to empty bin. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddDustbin = async () => {
    if (newBinName.trim() === '') {
      toast({ title: "Error", description: "Bin name cannot be empty.", variant: "destructive"});
      return;
    }

    try {
      const newBin: Omit<Dustbin, 'id'> = {
        name: newBinName.trim(),
        fillLevel: 0,
        maxCapacity: 100,
        lastEmptied: new Date(),
        isAlertActive: false,
      };

      const id = await addDustbin(newBin);
      setDustbins(prev => [...prev, { ...newBin, id }]);
      setNewBinName('');
      toast({
        title: "Bin Added",
        description: `${newBin.name} has been added.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add bin. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <SectionWrapper
        id="simulation"
        title="Smart Dustbin Simulation"
        description="Loading dustbins..."
        className="bg-secondary/50"
      >
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper
      id="simulation"
      title="Smart Dustbin Simulation"
      description="Monitor and manage virtual smart dustbins. Adjust fill levels to see real-time alerts and statuses."
      className="bg-secondary/50"
    >
      <div className="mb-8 p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg border-2">
        <div className="flex flex-col sm:flex-row gap-6 sm:items-end justify-between">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <Label htmlFor="alertThreshold" className="text-lg font-semibold">Alert Threshold</Label>
            </div>
            <div className="space-y-2">
              <Slider
                id="alertThreshold"
                min={0}
                max={100}
                step={5}
                value={[alertThreshold]}
                onValueChange={(value) => handleAlertThresholdChange(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span className="font-medium text-primary">{alertThreshold}%</span>
                <span>100%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Set the fill percentage at which alerts are triggered.</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-12 text-base btn-secondary focus-ring">
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Dustbin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Dustbin</DialogTitle>
                <DialogDescription>
                  Enter a name for the new dustbin to add it to the simulation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newBinName" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="newBinName"
                    value={newBinName}
                    onChange={(e) => setNewBinName(e.target.value)}
                    className="col-span-3 input-custom"
                    placeholder="e.g., Lobby Bin"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button 
                    type="submit" 
                    onClick={handleAddDustbin} 
                    disabled={!newBinName.trim()}
                    className="btn-primary focus-ring"
                  >
                    Add Dustbin
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {dustbins.length === 0 ? (
        <div className="text-center py-16 bg-card/50 backdrop-blur-sm rounded-lg border-2">
          <p className="text-muted-foreground text-lg">No dustbins to display. Add a new dustbin to start the simulation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {dustbins.map(bin => (
            <DustbinCard
              key={bin.id}
              dustbin={bin}
              onFillLevelChange={handleFillLevelChange}
              onEmptyBin={handleEmptyBin}
              alertThreshold={alertThreshold}
            />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
