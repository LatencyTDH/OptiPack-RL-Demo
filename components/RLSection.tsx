import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateExplanation } from '../services/geminiService';
import { Brain, Target, Zap, GitBranch, Network, Calculator, RefreshCw } from 'lucide-react';

const RLSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dynamicContent, setDynamicContent] = useState<string>('');

  const askAi = async (topic: string) => {
    setLoading(true);
    const text = await generateExplanation(topic, "Focus on Reinforcement Learning formulation for Knapsack Problem. Compare DP and Policy Gradients.");
    setDynamicContent(text);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto pb-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Knapsack & Reinforcement Learning</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          From classical Dynamic Programming to modern Deep Reinforcement Learning, understanding how to model the Knapsack Problem as a sequential decision process.
        </p>
      </div>

      {/* Core RL Components */}
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

      {/* Algorithms Comparison Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <Network className="text-indigo-600" />
          Algorithmic Approaches
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dynamic Programming */}
          <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <Calculator size={20} />
              </div>
              <h3 className="text-xl font-bold text-indigo-900">Dynamic Programming (DP)</h3>
            </div>
            <p className="text-slate-700 mb-4 leading-relaxed">
              <strong>The Foundation.</strong> DP is effectively "Model-Based RL" with perfect knowledge of the environment. It solves the Bellman Equation exactly by iterating through a table (the grid seen in the Visualizer).
            </p>
            <ul className="space-y-2 text-sm text-slate-600 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>Bellman Equation:</strong> V(w) = max(V(w), v_i + V(w - w_i))</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>Pros:</strong> Guarantees the mathematically optimal solution.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>Cons:</strong> Suffers from "Curse of Dimensionality" (fails if capacity is huge or non-integer).</span>
              </li>
            </ul>
          </div>

          {/* Policy Gradients */}
          <div className="bg-gradient-to-br from-fuchsia-50 to-white p-8 rounded-2xl border border-fuchsia-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-fuchsia-600 text-white rounded-lg">
                <RefreshCw size={20} />
              </div>
              <h3 className="text-xl font-bold text-fuchsia-900">Policy Gradients (Deep RL)</h3>
            </div>
             <p className="text-slate-700 mb-4 leading-relaxed">
              <strong>The Modern Approach.</strong> Methods like <strong>REINFORCE</strong> or <strong>PPO</strong> use Neural Networks to approximate the policy. The network outputs a probability distribution over the items to pick next.
            </p>
            <ul className="space-y-2 text-sm text-slate-600 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-400 font-bold">•</span>
                <span><strong>Mechanism:</strong> A "Pointer Network" (Sequence-to-Sequence model) reads the item list and points to the next item to pack.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-400 font-bold">•</span>
                <span><strong>Use Case:</strong> Stochastic Knapsack (where item values change) or when solving thousands of varying knapsack instances rapidly (Generalization).</span>
              </li>
            </ul>
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