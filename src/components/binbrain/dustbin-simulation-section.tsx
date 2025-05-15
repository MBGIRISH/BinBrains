"use client";

import { useState, useEffect } from 'react';
import type { Dustbin } from '@/types/dustbin';
import { DustbinCard } from './dustbin-card';
import { SectionWrapper } from './section-wrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { PlusCircle, Settings2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"


const initialDustbins: Dustbin[] = [
  { id: 'bin1', name: 'General Waste (Office)', fillLevel: 30, maxCapacity: 100, lastEmptied: new Date(), isAlertActive: false },
  { id: 'bin2', name: 'Recyclables (Kitchen)', fillLevel: 60, maxCapacity: 100, lastEmptied: new Date(), isAlertActive: false },
  { id: 'bin3', name: 'Organic (Cafeteria)', fillLevel: 10, maxCapacity: 100, lastEmptied: new Date(), isAlertActive: false },
];

export function DustbinSimulationSection() {
  const [dustbins, setDustbins] = useState<Dustbin[]>(initialDustbins);
  const [alertThreshold, setAlertThreshold] = useState(90);
  const [newBinName, setNewBinName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    dustbins.forEach(bin => {
      if (bin.fillLevel >= alertThreshold && !bin.isAlertActive) {
        toast({
          title: "Dustbin Alert!",
          description: `${bin.name} has reached ${bin.fillLevel}% capacity.`,
          variant: bin.fillLevel >= 100 ? "destructive" : "default",
          duration: 5000,
        });
        setDustbins(prev => prev.map(db => db.id === bin.id ? { ...db, isAlertActive: true } : db));
      } else if (bin.fillLevel < alertThreshold && bin.isAlertActive) {
        // Reset alert active status if fill level drops below threshold
        setDustbins(prev => prev.map(db => db.id === bin.id ? { ...db, isAlertActive: false } : db));
      }
    });
  }, [dustbins, alertThreshold, toast]);

  const handleFillLevelChange = (id: string, newFillLevel: number) => {
    setDustbins(prevDustbins =>
      prevDustbins.map(bin =>
        bin.id === id ? { ...bin, fillLevel: newFillLevel } : bin
      )
    );
  };

  const handleEmptyBin = (id: string) => {
    setDustbins(prevDustbins =>
      prevDustbins.map(bin =>
        bin.id === id ? { ...bin, fillLevel: 0, lastEmptied: new Date(), isAlertActive: false } : bin
      )
    );
     toast({
        title: "Bin Emptied",
        description: `${dustbins.find(db => db.id === id)?.name} has been emptied.`,
        duration: 3000,
      });
  };

  const handleAddDustbin = () => {
    if (newBinName.trim() === '') {
      toast({ title: "Error", description: "Bin name cannot be empty.", variant: "destructive"});
      return;
    }
    const newBin: Dustbin = {
      id: `bin${Date.now()}`,
      name: newBinName.trim(),
      fillLevel: 0,
      maxCapacity: 100,
      lastEmptied: new Date(),
      isAlertActive: false,
    };
    setDustbins(prev => [...prev, newBin]);
    setNewBinName('');
     toast({
        title: "Bin Added",
        description: `${newBin.name} has been added.`,
        duration: 3000,
      });
  };


  return (
    <SectionWrapper
      id="simulation"
      title="Smart Dustbin Simulation"
      description="Monitor and manage virtual smart dustbins. Adjust fill levels to see real-time alerts and statuses."
      className="bg-secondary/50"
    >
      <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end justify-between">
            <div className="flex-1">
              <Label htmlFor="alertThreshold" className="text-lg font-semibold mb-2 block">Alert Threshold (%)</Label>
              <Input
                id="alertThreshold"
                type="number"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0)))}
                className="max-w-xs text-base h-12"
                min="0"
                max="100"
              />
              <p className="text-sm text-muted-foreground mt-1">Set the fill percentage at which alerts are triggered.</p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-12 text-base">
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
                      className="col-span-3"
                      placeholder="e.g., Lobby Bin"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type="submit" onClick={handleAddDustbin} disabled={!newBinName.trim()}>Add Dustbin</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </div>
      </div>

      {dustbins.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg py-10">No dustbins to display. Add a new dustbin to start the simulation.</p>
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
