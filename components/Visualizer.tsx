import React, { useState, useEffect } from 'react';
import { Item, KnapsackSolution } from '../types';
import { solveDP, solveGreedyDensity, getRandomColor } from '../utils/solvers';
import { generateScenario } from '../services/geminiService';
import { Plus, Trash2, Play, RefreshCw, Wand2, Calculator } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const Visualizer: React.FC = () => {
  const [capacity, setCapacity] = useState<number>(50);
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: 'Laptop', weight: 3, value: 10, color: 'bg-blue-500' },
    { id: '2', name: 'Camera', weight: 4, value: 12, color: 'bg-red-500' },
    { id: '3', name: 'Food', weight: 8, value: 6, color: 'bg-green-500' },
    { id: '4', name: 'Tent', weight: 10, value: 18, color: 'bg-yellow-500' },
    { id: '5', name: 'Water', weight: 15, value: 15, color: 'bg-cyan-500' },
  ]);
  const [solution, setSolution] = useState<KnapsackSolution | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemWeight, setNewItemWeight] = useState(1);
  const [newItemValue, setNewItemValue] = useState(1);

  const handleAddItem = () => {
    if (!newItemName) return;
    const newItem: Item = {
      id: Date.now().toString(),
      name: newItemName,
      weight: newItemWeight,
      value: newItemValue,
      color: getRandomColor(),
    };
    setItems([...items, newItem]);
    setNewItemName('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    if (solution) setSolution(null);
  };

  const runSolver = (method: 'dp' | 'greedy') => {
    if (method === 'dp') {
      setSolution(solveDP(items, capacity));
    } else {
      setSolution(solveGreedyDensity(items, capacity));
    }
  };

  const handleGenerateScenario = async () => {
    setIsGenerating(true);
    const data = await generateScenario();
    setIsGenerating(false);
    
    if (data.items.length > 0) {
      setCapacity(data.capacity);
      setItems(data.items.map((i: any, idx: number) => ({
        id: `gen-${idx}`,
        name: i.name,
        weight: i.weight,
        value: i.value,
        color: getRandomColor()
      })));
      setSolution(null);
    }
  };

  const chartData = items.map(item => ({
    name: item.name,
    weight: item.weight,
    value: item.value,
    selected: solution?.selectedItems.some(s => s.id === item.id) ? 1 : 0.3
  }));

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50">
      {/* Controls Bar */}
      <div className="bg-white border-b border-slate-200 p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 uppercase">Capacity</label>
            <input 
              type="number" 
              value={capacity} 
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="border border-slate-300 rounded px-2 py-1 w-24 text-slate-800 font-mono"
            />
          </div>
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          <div className="flex gap-2">
            <button 
              onClick={() => runSolver('dp')}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Calculator size={16} />
              Run Optimal (DP)
            </button>
            <button 
              onClick={() => runSolver('greedy')}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-slate-300"
            >
              <Play size={16} />
              Run Greedy
            </button>
          </div>
        </div>
        <button 
          onClick={handleGenerateScenario}
          disabled={isGenerating}
          className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors text-sm"
        >
          {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <Wand2 size={16} />}
          AI Generate Scenario
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 flex flex-col md:flex-row gap-6">
        {/* Left Panel: Item Management */}
        <div className="w-full md:w-1/3 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-3">Add New Item</h3>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <input 
                placeholder="Name" 
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="border p-2 rounded text-sm w-full col-span-3"
              />
              <input 
                type="number" 
                placeholder="Weight" 
                value={newItemWeight}
                onChange={e => setNewItemWeight(Number(e.target.value))}
                className="border p-2 rounded text-sm w-full"
              />
              <input 
                type="number" 
                placeholder="Value" 
                value={newItemValue}
                onChange={e => setNewItemValue(Number(e.target.value))}
                className="border p-2 rounded text-sm w-full"
              />
              <button 
                onClick={handleAddItem}
                className="bg-green-600 hover:bg-green-700 text-white rounded p-2 flex justify-center items-center"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 text-sm flex justify-between">
              <span>Inventory ({items.length})</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className={`p-3 border-b border-slate-100 flex justify-between items-center hover:bg-slate-50 ${solution?.selectedItems.some(s => s.id === item.id) ? 'bg-indigo-50/50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <div>
                      <div className="font-medium text-slate-800 text-sm">{item.name}</div>
                      <div className="text-xs text-slate-500">W: {item.weight} | V: ${item.value}</div>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveItem(item.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {items.length === 0 && <div className="p-4 text-center text-slate-400 text-sm">No items. Add some or generate a scenario.</div>}
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Solution Summary */}
          {solution ? (
            <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-md flex justify-between items-center">
              <div>
                <div className="text-indigo-200 text-sm font-medium mb-1">{solution.method} Result</div>
                <div className="text-3xl font-bold">${solution.totalValue} <span className="text-lg font-normal text-indigo-300">Total Value</span></div>
              </div>
              <div className="text-right">
                 <div className="text-3xl font-bold">{solution.totalWeight} <span className="text-lg font-normal text-indigo-300">/ {capacity}</span></div>
                 <div className="text-indigo-200 text-sm font-medium mt-1">Weight Used</div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 border-2 border-dashed border-slate-300 p-6 rounded-xl flex items-center justify-center text-slate-500">
              Run a solver to see results
            </div>
          )}

          {/* Knapsack Graphic */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-[300px]">
            <h4 className="text-sm font-semibold text-slate-500 mb-4">Value Distribution (Selection Opacity)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                <Tooltip 
                   cursor={{fill: '#f1f5f9'}}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="value" name="Item Value" fill="#6366f1">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fillOpacity={entry.selected} />
                  ))}
                </Bar>
                <Bar dataKey="weight" name="Item Weight" fill="#cbd5e1">
                   {chartData.map((entry, index) => (
                    <Cell key={`cell-w-${index}`} fillOpacity={entry.selected} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
           {/* Visual Pack Representation */}
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-500 mb-2">Knapsack Packing Visualization (Abstract)</h4>
              <div className="w-full h-16 bg-slate-200 rounded-lg overflow-hidden flex border border-slate-300 relative">
                  {solution?.selectedItems.map((item, idx) => {
                    const widthPercent = (item.weight / capacity) * 100;
                    return (
                      <div 
                        key={idx} 
                        className={`${item.color} h-full flex items-center justify-center text-xs text-white font-medium border-r border-white/20 whitespace-nowrap overflow-hidden transition-all duration-500`}
                        style={{ width: `${widthPercent}%` }}
                        title={`${item.name} (${item.weight}kg)`}
                      >
                         {widthPercent > 5 && item.name}
                      </div>
                    )
                  })}
                  {/* Empty space filler */}
                  <div className="flex-1 bg-transparent"></div>
                  
                  {/* Capacity Marker */}
                  <div className="absolute top-0 bottom-0 right-0 w-px bg-red-500 z-10"></div>
                  <div className="absolute -bottom-5 right-0 text-xs text-red-500 font-bold">{capacity}kg</div>
              </div>
              <div className="mt-2 text-xs text-slate-400 text-right">
                {solution ? `${Math.round((solution.totalWeight / capacity) * 100)}% Full` : '0% Full'}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Visualizer;