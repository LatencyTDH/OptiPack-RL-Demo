import { Item, KnapsackSolution, DPStep } from '../types';

export const solveDP = (items: Item[], capacity: number): KnapsackSolution => {
  const start = performance.now();
  const n = items.length;
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
  const trace: DPStep[] = [];

  for (let i = 1; i <= n; i++) {
    const currentItem = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      const prevExcludeVal = dp[i - 1][w];
      let prevIncludeVal = -1;
      let val = prevExcludeVal;
      let action: 'exclude' | 'include' = 'exclude';

      if (currentItem.weight <= w) {
        prevIncludeVal = dp[i - 1][w - currentItem.weight] + currentItem.value;
        if (prevIncludeVal > prevExcludeVal) {
          val = prevIncludeVal;
          action = 'include';
        }
      }
      
      dp[i][w] = val;

      // Record the step for visualization
      trace.push({
        i,
        w,
        val,
        action,
        prevExcludeVal,
        prevIncludeVal: currentItem.weight <= w ? prevIncludeVal : -1, // -1 denotes impossible
        itemWeight: currentItem.weight,
        itemValue: currentItem.value
      });
    }
  }

  // Backtrack
  const selectedItems: Item[] = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const item = items[i - 1];
      selectedItems.push(item);
      w -= item.weight;
    }
  }

  const end = performance.now();

  return {
    selectedItems: selectedItems.reverse(),
    totalValue: dp[n][capacity],
    totalWeight: selectedItems.reduce((sum, item) => sum + item.weight, 0),
    capacity,
    method: 'Dynamic Programming',
    dpTable: dp,
    trace,
    executionTime: end - start
  };
};

export const solveGreedyDensity = (items: Item[], capacity: number): KnapsackSolution => {
  const start = performance.now();
  const sortedItems = [...items].sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
  
  const selectedItems: Item[] = [];
  let currentWeight = 0;
  let currentValue = 0;

  for (const item of sortedItems) {
    if (currentWeight + item.weight <= capacity) {
      selectedItems.push(item);
      currentWeight += item.weight;
      currentValue += item.value;
    }
  }
  const end = performance.now();

  return {
    selectedItems,
    totalValue: currentValue,
    totalWeight: currentWeight,
    capacity,
    method: 'Greedy (Value Density)',
    executionTime: end - start
  };
};

export class KnapsackAgent {
  public qTable: Record<string, number[]>; 
  private alpha = 0.1; 
  private gamma = 0.9; 
  
  constructor() {
    this.qTable = {};
  }

  private getStateKey(itemIndex: number, currentCapacity: number): string {
    return `${itemIndex}:${currentCapacity}`;
  }

  private getQ(state: string): number[] {
    if (!this.qTable[state]) {
      this.qTable[state] = [0, 0]; // [Skip, Take]
    }
    return this.qTable[state];
  }

  // Inspect the agent's brain for a specific state
  public getDecisionDetails(itemIndex: number, currentCapacity: number) {
    const state = this.getStateKey(itemIndex, currentCapacity);
    const qValues = this.getQ(state);
    return {
      qSkip: qValues[0],
      qTake: qValues[1],
      bestAction: qValues[1] > qValues[0] ? 1 : 0
    };
  }

  public runEpisode(items: Item[], maxCapacity: number, epsilon: number): number {
    let currentCapacity = 0;
    let totalValue = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const remainingCap = maxCapacity - currentCapacity;
      const state = this.getStateKey(i, remainingCap);
      const actions = this.getQ(state);

      let action = 0;
      const canTake = item.weight <= remainingCap;

      if (Math.random() < epsilon) {
        action = canTake ? (Math.random() < 0.5 ? 1 : 0) : 0;
      } else {
        if (!canTake) {
          action = 0;
        } else {
          action = actions[1] > actions[0] ? 1 : 0;
        }
      }

      let reward = 0;
      if (action === 1) {
        currentCapacity += item.weight;
        totalValue += item.value;
        reward = item.value;
      }

      const nextState = this.getStateKey(i + 1, maxCapacity - currentCapacity);
      const nextMaxQ = i < items.length - 1 ? Math.max(...this.getQ(nextState)) : 0;

      this.qTable[state][action] = 
        (1 - this.alpha) * this.qTable[state][action] + 
        this.alpha * (reward + this.gamma * nextMaxQ);
    }

    return totalValue;
  }
}

export const getRandomColor = () => {
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
    'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};