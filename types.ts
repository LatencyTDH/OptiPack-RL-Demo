export interface Item {
  id: string;
  name: string;
  weight: number;
  value: number;
  color: string;
}

export interface KnapsackSolution {
  selectedItems: Item[];
  totalValue: number;
  totalWeight: number;
  capacity: number;
  method: 'Dynamic Programming' | 'Greedy (Value Density)' | 'Greedy (Absolute Value)';
}

export enum Tab {
  VISUALIZER = 'VISUALIZER',
  LEARN = 'LEARN',
  RL_CONTEXT = 'RL_CONTEXT',
  BUSINESS = 'BUSINESS'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}