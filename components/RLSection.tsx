import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateExplanation } from '../services/geminiService';
import { Brain, Target, Zap, GitBranch, Play, RefreshCw, Eye, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, BarChart, Bar, Cell } from 'recharts';
import { Item, TrainingDataPoint } from '../types';
import { KnapsackAgent, getRandomColor } from '../utils/solvers';

const RLSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dynamicContent, setDynamicContent] = useState<string>('');
  
  // Simulation State
  const [isTraining, setIsTraining] = useState(false);
  const [trainingData, setTrainingData] = useState<TrainingDataPoint[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [trainingSpeed, setTrainingSpeed] = useState(50);
  const agentRef = useRef<KnapsackAgent>(new KnapsackAgent());
  
  // Inference State
  const [inferenceMode, setInferenceMode] = useState(false);
  const [currentInferenceStep, setCurrentInferenceStep] = useState(-1);
  const [inferenceHistory, setInferenceHistory] = useState<any[]>([]);
  
  // Mock Environment
  const simCapacity = 20;
  const simItems: Item[] = [
    { id: '1', name: 'Diamond', weight: 5, value: 10, color: 'bg-cyan-500' },
    { id: '2', name: 'Gold', weight: 8, value: 15, color: 'bg-amber-400' },
    { id: '3', name: 'Silver', weight: 3, value: 8, color: 'bg-slate-400' },
    { id: '4', name: 'Bronze', weight: 6, value: 12, color: 'bg-orange-600' },
    { id: '5', name: 'Platinum', weight: 2, value: 5, color: 'bg-indigo-300' },
  ];
  const maxPossibleValue = 35;

  const askAi = async (topic: string) => {
    setLoading(true);
    const text = await generateExplanation(topic, "Focus on Reinforcement Learning formulation for Knapsack Problem. Compare DP and Policy Gradients.");
    setDynamicContent(text);
    setLoading(false);
  };

  const startTraining = () => {
    setIsTraining(true);
    setInferenceMode(false);
    setTrainingData([]);
    setCurrentEpisode(0);
    agentRef.current = new KnapsackAgent();
  };

  const stopTraining = () => {
    setIsTraining(false);
  };

  // Inference / Test Loop
  const startInference = () => {
     setInferenceMode(true);
     setInferenceHistory([]);
     setCurrentInferenceStep(0);
  };

  useEffect(() => {
    if (inferenceMode && currentInferenceStep < simItems.length) {
       const timer = setTimeout(() => {
          const itemIdx = currentInferenceStep;
          const currentWeight = inferenceHistory.reduce((acc, step) => acc + (step.action === 1 ? step.item.weight : 0), 0);
          const remainingCap = simCapacity - currentWeight;
          
          const decision = agentRef.current.getDecisionDetails(itemIdx, remainingCap);
          
          setInferenceHistory(prev => [...prev, {
             item: simItems[itemIdx],
             remainingCap,
             ...decision
          }]);
          
          setCurrentInferenceStep(prev => prev + 1);
       }, 1500); // Slow step for visualization
       return () => clearTimeout(timer);
    }
  }, [inferenceMode, currentInferenceStep]);


  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTraining) {
      interval = setInterval(() => {
        setCurrentEpisode(prev => {
          const episodeNum = prev + 1;
          const epsilon = Math.max(0.01, 1.0 - episodeNum * 0.005);
          
          const reward = agentRef.current.runEpisode(simItems, simCapacity, epsilon);
          
          setTrainingData(prevData => {
            const newData = [...prevData, {
              episode: episodeNum,
              reward: reward,
              averageReward: prevData.length > 0 
                ? (prevData[prevData.length-1].averageReward * 0.9 + reward * 0.1) 
                : reward,
              epsilon
            }];
            return newData.slice(-100);
          });

          if (episodeNum >= 200) {
            setIsTraining(false);
          }
          return episodeNum;
        });
      }, trainingSpeed);
    }

    return () => clearInterval(interval);
  }, [isTraining, trainingSpeed]);

  return (
    <div className="p-8 max-w-6xl mx-auto pb-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Knapsack & Reinforcement Learning</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
           Train an agent to solve the problem by trial-and-error, then inspect its "brain" to see how it makes decisions.
        </p>
      </div>

      {/* Main Interactive Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
         {/* Left: Training Center */}
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Zap className="text-indigo-600" size={20}/> Training Lab
               </h3>
               <button 
                  onClick={isTraining ? stopTraining : startTraining}
                  className={`px-4 py-1.5 text-sm rounded-full font-bold text-white transition-colors ${isTraining ? 'bg-red-500' : 'bg-indigo-600'}`}
               >
                  {isTraining ? 'Stop' : 'Train Agent'}
               </button>
            </div>
            
            <div className="flex-1 min-h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={trainingData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <XAxis dataKey="episode" hide />
                   <YAxis domain={[0, maxPossibleValue + 5]} hide />
                   <Tooltip />
                   <ReferenceLine y={maxPossibleValue} stroke="green" strokeDasharray="3 3" />
                   <Line type="monotone" dataKey="averageReward" stroke="#4f46e5" strokeWidth={2} dot={false} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-4 text-xs text-center text-slate-500">
               Episode: {currentEpisode} | Epsilon: {trainingData.length > 0 ? trainingData[trainingData.length-1].epsilon.toFixed(2) : '1.0'}
            </div>
         </div>

         {/* Right: Inference / Brain Inspector */}
         <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col text-slate-300 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 z-10">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Eye className="text-emerald-400" size={20}/> Agent "Brain" Inspector
               </h3>
               <button 
                  onClick={startInference}
                  disabled={isTraining || trainingData.length === 0}
                  className="px-4 py-1.5 text-sm rounded-full font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  Test Agent
               </button>
            </div>

            {/* Live Inference Visualization */}
            <div className="flex-1 space-y-4 z-10 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
               {!inferenceMode && (
                  <div className="h-full flex items-center justify-center text-slate-500 italic text-center p-8">
                     Train the agent first, then click "Test Agent" to watch it solve the problem step-by-step.
                  </div>
               )}
               
               {inferenceHistory.map((step, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full ${step.item.color} flex items-center justify-center font-bold text-white shrink-0`}>
                        {step.item.name[0]}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs mb-1">
                           <span className="text-white font-medium">{step.item.name}</span>
                           <span className="text-slate-400">Cap Left: {step.remainingCap}</span>
                        </div>
                        {/* Q-Value Bars */}
                        <div className="flex gap-2 h-1.5 mt-2">
                           <div className="flex-1 bg-slate-700 rounded-full overflow-hidden flex">
                              <div className="bg-red-500 h-full transition-all duration-500" style={{width: `${Math.max(5, (step.qSkip / (step.qSkip + step.qTake || 1)) * 100)}%`}}></div>
                           </div>
                           <div className="flex-1 bg-slate-700 rounded-full overflow-hidden flex justify-end">
                              <div className="bg-green-500 h-full transition-all duration-500" style={{width: `${Math.max(5, (step.qTake / (step.qSkip + step.qTake || 1)) * 100)}%`}}></div>
                           </div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                           <span>Q(Skip): {step.qSkip.toFixed(1)}</span>
                           <span>Q(Take): {step.qTake.toFixed(1)}</span>
                        </div>
                     </div>
                     <div className="shrink-0">
                        {step.bestAction === 1 ? <CheckCircle className="text-green-500" size={20}/> : <XCircle className="text-red-500" size={20}/>}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Core RL Components - Theory */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <Brain size={24} />
            <h2 className="text-lg font-bold text-slate-800">State Space (S)</h2>
          </div>
          <p className="text-slate-600 text-sm mb-4">
            The environment state at step <code>t</code>.
          </p>
          <div className="bg-slate-50 p-3 rounded border border-slate-200 font-mono text-xs text-slate-700">
            S_t = [Current_Capacity, Available_Items_Mask]
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4 text-green-600">
            <GitBranch size={24} />
            <h2 className="text-lg font-bold text-slate-800">Action Space (A)</h2>
          </div>
          <p className="text-slate-600 text-sm mb-4">
            The agent's decision at step <code>t</code>.
          </p>
          <div className="bg-slate-50 p-3 rounded border border-slate-200 font-mono text-xs text-slate-700">
            A_t ∈ {0: "Skip Item", 1: "Pick Item"}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4 text-amber-600">
            <Target size={24} />
            <h2 className="text-lg font-bold text-slate-800">Reward Function (R)</h2>
          </div>
          <p className="text-slate-600 text-sm mb-4">
            Feedback signal to guide optimization.
          </p>
          <div className="bg-slate-50 p-3 rounded border border-slate-200 font-mono text-xs text-slate-700">
            R = Value(i) if feasible<br/>
            R = -Large_Penalty if capacity exceeded
          </div>
        </div>
      </div>

      {/* AI Exploration Section */}
      <div className="bg-slate-900 text-slate-300 rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Deep Dive with AI</h3>
            <p className="text-slate-400">Generate technical explanations for advanced RL concepts.</p>
          </div>
          {loading && (
             <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
               <Brain size={20} />
               <span className="text-sm font-medium">Processing Request...</span>
             </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3 mb-8">
          <button 
            onClick={() => askAi("Pointer Networks for Combinatorial Optimization")}
            disabled={loading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-full transition-all text-sm font-medium"
          >
            Explain Pointer Networks
          </button>
          <button 
            onClick={() => askAi("Knapsack as a Markov Decision Process (MDP)")}
            disabled={loading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-full transition-all text-sm font-medium"
          >
            Knapsack as MDP
          </button>
          <button 
            onClick={() => askAi("Compare Q-Learning vs Policy Gradients for Knapsack")}
            disabled={loading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-full transition-all text-sm font-medium"
          >
            Q-Learning vs Policy Gradients
          </button>
        </div>

        {dynamicContent && (
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 prose prose-invert max-w-none">
             <ReactMarkdown>{dynamicContent}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default RLSection;