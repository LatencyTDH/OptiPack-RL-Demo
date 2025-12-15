import React, { useState, useEffect, useRef } from 'react';
import { Item, KnapsackSolution, DPStep } from '../types';
import { solveDP, solveGreedyDensity, getRandomColor } from '../utils/solvers';
import { generateScenario } from '../services/geminiService';
import { Plus, Trash2, Play, RefreshCw, Wand2, Calculator, Grid3X3, Clock, TrendingUp, Pause, SkipForward, RotateCcw, Cpu, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const Visualizer: React.FC = () => {
  const [capacity, setCapacity] = useState<number>(10); // Lower default for better table visualization
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: 'Guitar', weight: 4, value: 40, color: 'bg-blue-500' },
    { id: '2', name: 'Stereo', weight: 3, value: 25, color: 'bg-red-500' },
    { id: '3', name: 'Laptop', weight: 2, value: 15, color: 'bg-green-500' },
  ]);
  const [solution, setSolution] = useState<KnapsackSolution | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDpTable, setShowDpTable] = useState(false);

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState(200);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Inputs
  const [newItemName, setNewItemName] = useState('');
  const [newItemWeight, setNewItemWeight] = useState(1);
  const [newItemValue, setNewItemValue] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && solution?.trace) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= (solution.trace!.length - 1)) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, solution, playbackSpeed]);

  // Auto-scroll logic for DP table
  useEffect(() => {
    if (currentStepIndex >= 0 && solution?.trace && showDpTable) {
       // Optional: Add logic to scroll table if needed
    }
  }, [currentStepIndex, solution, showDpTable]);

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
      const res = solveDP(items, capacity);
      setSolution(res);
      setShowDpTable(true);
      setCurrentStepIndex(-1); // Reset animation
      setIsPlaying(false);
    } else {
      setSolution(solveGreedyDensity(items, capacity));
      setShowDpTable(false);
    }
  };

  const handleGenerateScenario = async () => {
    setIsGenerating(true);
    const data = await generateScenario();
    setIsGenerating(false);
    
    if (data.items.length > 0) {
      setCapacity(data.capacity > 20 ? 20 : data.capacity); // Cap for visuals
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

  const currentTraceStep: DPStep | undefined = solution?.trace?.[currentStepIndex];

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
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
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
          className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors text-sm font-medium"
        >
          {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <Wand2 size={16} />}
          AI Generate Scenario
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 flex flex-col lg:flex-row gap-6">
        {/* Left Panel: Item Management */}
        <div className="w-full lg:w-1/3 space-y-4 flex flex-col">
          {/* Complexity HUD */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl shadow-md border border-slate-700">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-700 pb-2">
               <Cpu size={16} className="text-indigo-400" />
               <span className="font-bold text-sm text-white">Complexity HUD</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
               <div>
                  <div className="text-slate-500 mb-1">Time Complexity</div>
                  <div className="text-white">O(N × W)</div>
                  <div className="text-emerald-400 mt-1">{items.length} × {capacity} = {items.length * capacity} Ops</div>
               </div>
               <div>
                  <div className="text-slate-500 mb-1">Space Complexity</div>
                  <div className="text-white">O(N × W)</div>
                  <div className="text-indigo-400 mt-1">{(items.length * capacity * 8 / 1024).toFixed(2)} KB</div>
               </div>
            </div>
          </div>

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

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-[200px]">
             <div className="p-3 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 text-sm flex justify-between">
              <span>Inventory ({items.length})</span>
            </div>
            <div className="overflow-y-auto flex-1">
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
        <div className="w-full lg:w-2/3 space-y-6 flex flex-col">
           {/* Solution Summary */}
          {solution ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-500 text-sm flex items-center gap-2"><Clock size={14}/> Execution Time</span>
                    <span className="font-mono text-slate-700">{solution.executionTime?.toFixed(4)} ms</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm flex items-center gap-2"><TrendingUp size={14}/> Algorithm Class</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${solution.method.includes('Dynamic') ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                      {solution.method.includes('Dynamic') ? 'Exact (O(nW))' : 'Approximate (Heuristic)'}
                    </span>
                 </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 border-2 border-dashed border-slate-300 p-6 rounded-xl flex items-center justify-center text-slate-500 h-[120px]">
              Run a solver to see results and performance metrics
            </div>
          )}

          {/* Knapsack Graphic */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-[300px] shrink-0">
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
              <h4 className="text-sm font-semibold text-slate-500 mb-2">Knapsack Packing Visualization</h4>
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
                  <div className="flex-1 bg-transparent"></div>
                  <div className="absolute top-0 bottom-0 right-0 w-px bg-red-500 z-10"></div>
                  <div className="absolute -bottom-5 right-0 text-xs text-red-500 font-bold">{capacity}kg</div>
              </div>
           </div>

           {/* DP Table View with Interactive Playback */}
           {solution?.method === 'Dynamic Programming' && solution.dpTable && (
              <div className="flex-1 flex flex-col min-h-[400px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                       <Grid3X3 size={18} /> 
                       <span>Algorithm Trace</span>
                    </div>
                    {/* Playback Controls */}
                    <div className="flex items-center gap-2">
                       <button onClick={() => { setCurrentStepIndex(-1); setIsPlaying(false); }} className="p-1 hover:bg-slate-200 rounded text-slate-600" title="Reset">
                          <RotateCcw size={16} />
                       </button>
                       <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold text-white transition-all ${isPlaying ? 'bg-amber-500' : 'bg-indigo-600'}`}
                       >
                          {isPlaying ? <><Pause size={12}/> Pause</> : <><Play size={12}/> Play</>}
                       </button>
                       <button onClick={() => setCurrentStepIndex(solution.trace!.length - 1)} className="p-1 hover:bg-slate-200 rounded text-slate-600" title="Skip to End">
                          <SkipForward size={16} />
                       </button>
                       <div className="w-px h-4 bg-slate-300 mx-2"></div>
                       <div className="text-xs font-mono text-slate-500">
                          Step: {currentStepIndex + 1} / {solution.trace!.length}
                       </div>
                    </div>
                 </div>
                 
                 <div className="relative flex-1 overflow-auto p-4" ref={scrollRef}>
                   <table className="w-full text-xs font-mono border-collapse relative z-10">
                     <thead>
                       <tr>
                         <th className="p-2 border bg-slate-100 sticky top-0 z-20">Item \ Cap</th>
                         {solution.dpTable[0].map((_, idx) => (
                           <th key={idx} className="p-2 border bg-slate-50 text-slate-500 sticky top-0 z-20">{idx}</th>
                         ))}
                       </tr>
                     </thead>
                     <tbody>
                       {solution.dpTable.map((row, rowIdx) => (
                         <tr key={rowIdx}>
                           <td className="p-2 border bg-slate-50 font-bold text-slate-700 whitespace-nowrap sticky left-0 z-10">
                             {rowIdx === 0 ? "Initial (0)" : items[rowIdx-1].name}
                           </td>
                           {row.map((cell, colIdx) => {
                             // Visualization Highlighting Logic
                             let bgClass = '';
                             let borderClass = '';
                             let textClass = 'text-slate-500';
                             
                             if (currentTraceStep) {
                               const isTarget = currentTraceStep.i === rowIdx && currentTraceStep.w === colIdx;
                               const isPrevExclude = currentTraceStep.i - 1 === rowIdx && currentTraceStep.w === colIdx;
                               const isPrevInclude = currentTraceStep.i - 1 === rowIdx && (currentTraceStep.w - currentTraceStep.itemWeight) === colIdx;

                               // Only show highlights if we have reached this step in playback
                               if (currentStepIndex >= 0) {
                                  // Cells computed in previous steps
                                  if (rowIdx < currentTraceStep.i || (rowIdx === currentTraceStep.i && colIdx < currentTraceStep.w)) {
                                    textClass = 'text-slate-900';
                                  }

                                  if (isTarget) {
                                     bgClass = 'bg-blue-600 text-white animate-pulse';
                                     textClass = 'text-white font-bold';
                                  } else if (isPrevExclude) {
                                     bgClass = 'bg-slate-200';
                                     borderClass = 'border-slate-400 ring-2 ring-slate-400';
                                  } else if (isPrevInclude) {
                                     bgClass = 'bg-green-200';
                                     borderClass = 'border-green-500 ring-2 ring-green-500';
                                  }
                               }
                             } else {
                               // No trace active (show full result)
                               textClass = 'text-slate-900';
                               if (rowIdx === items.length && colIdx === capacity) {
                                 bgClass = 'bg-green-100 text-green-700 font-bold';
                               }
                             }

                             return (
                               <td key={colIdx} className={`p-2 border text-center transition-colors duration-200 ${bgClass} ${borderClass} ${textClass}`}>
                                 {/* Only show value if it has been calculated in the playback sequence */}
                                 {(currentStepIndex === -1 || (rowIdx < (currentTraceStep?.i || 0)) || (rowIdx === (currentTraceStep?.i || 0) && colIdx <= (currentTraceStep?.w || 0)) || !isPlaying) ? cell : ''}
                               </td>
                             )
                           })}
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>

                 {/* Algorithm Logic Overlay */}
                 {currentTraceStep && isPlaying && (
                    <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 text-white p-4 rounded-xl backdrop-blur-sm shadow-xl border border-white/10 z-30">
                       <div className="flex items-start justify-between">
                          <div>
                            <div className="text-xs text-indigo-300 font-bold uppercase mb-1">Calculating DP[{currentTraceStep.i}][{currentTraceStep.w}]</div>
                            <div className="text-sm font-mono mb-2">
                               max(
                               <span className="text-slate-400"> Exclude: {currentTraceStep.prevExcludeVal} </span>, 
                               <span className="text-green-400"> Include: {currentTraceStep.prevIncludeVal === -1 ? 'Impossible' : `${currentTraceStep.itemValue} + ${currentTraceStep.prevIncludeVal - currentTraceStep.itemValue}`} </span>
                               )
                            </div>
                            <div className="text-xs text-slate-300">
                               Decision: <span className={currentTraceStep.action === 'include' ? 'text-green-400 font-bold' : 'text-slate-400 font-bold'}>{currentTraceStep.action.toUpperCase()}</span>
                            </div>
                          </div>
                          <div className="text-right text-xs text-slate-400 space-y-1">
                             <div>Item: {items[currentTraceStep.i - 1].name}</div>
                             <div>Weight: {currentTraceStep.itemWeight}</div>
                             <div>Value: {currentTraceStep.itemValue}</div>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default Visualizer;