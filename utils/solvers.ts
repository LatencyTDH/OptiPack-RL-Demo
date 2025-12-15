import { Item, KnapsackSolution } from '../types';

export const solveDP = (items: Item[], capacity: number): KnapsackSolution => {
  const n = items.length;
  // dp[i][w] stores the maximum value that can be attained with weight less than or equal to w using items up to i
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const currentItem = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (currentItem.weight <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - currentItem.weight] + currentItem.value
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find selected items
  const selectedItems: Item[] = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const item = items[i - 1];
      selectedItems.push(item);
      w -= item.weight;
    }
  }

  const totalValue = dp[n][capacity];
  const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);

  return {
    selectedItems: selectedItems.reverse(),
    totalValue,
    totalWeight,
    capacity,
    method: 'Dynamic Programming'
  };
};

export const solveGreedyDensity = (items: Item[], capacity: number): KnapsackSolution => {
  // Sort by value/weight ratio descending
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

  return {
    selectedItems,
    totalValue: currentValue,
    totalWeight: currentWeight,
    capacity,
    method: 'Greedy (Value Density)'
  };
};

// Generates a random color for new items
export const getRandomColor = () => {
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
    'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};