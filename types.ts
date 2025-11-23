// Simple types for our encounter generator
export interface EncounterResult {
  title: string;
  description: string;
  suggestedCreatures: string[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

// Minimal definition for the global OBR object if you want type safety without the full package
// In a real app, you would install @owlbear-rodeo/sdk via npm
declare global {
  interface Window {
    OBR: any;
  }
}