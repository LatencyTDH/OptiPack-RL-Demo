export interface Item {
  id: string;
  name: string;
  weight: number;
  value: number;
  color: string;
}

export interface DPStep {
  i: number; // Item index (1-based)
  w: number; // Current Capacity
  val: number; // Calculated Value
  action: 'exclude' | 'include'; // Decision made
  prevExcludeVal: number; // Value if we skipped
  prevIncludeVal: number; // Value if we took (includes item value)
  itemWeight: number;
  itemValue: number;
}

export interface KnapsackSolution {
  selectedItems: Item[];
  totalValue: number;
  totalWeight: number;
  capacity: number;
  method: 'Dynamic Programming' | 'Greedy (Value Density)' | 'Greedy (Absolute Value)';
  dpTable?: number[][]; 
  trace?: DPStep[]; // The step-by-step history
  executionTime?: number;
}

export interface TrainingDataPoint {
  episode: number;
  reward: number;
  averageReward: number;
  epsilon: number;
}

export enum Tab {
  VISUALIZER = 'VISUALIZER',
  RL_SIMULATION = 'RL_SIMULATION',
  BUSINESS = 'BUSINESS'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}