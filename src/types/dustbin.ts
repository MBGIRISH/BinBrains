export interface Dustbin {
  id: string;
  name: string;
  fillLevel: number; // Percentage 0-100+, can exceed 100 for overfilled
  maxCapacity: number; // For calculating percentage if needed, or just use 100 as max for UI percentage.
  lastEmptied: Date;
  isAlertActive: boolean; // To track if an alert for "full" is currently active
}
