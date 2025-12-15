import React from 'react';
import { Truck, Cpu, TrendingUp, Code2, BoxSelect, Workflow, Layers, ShieldCheck } from 'lucide-react';

const BusinessSection: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto pb-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Real-World Business Applications</h1>
        <p className="text-slate-600 text-lg max-w-3xl mx-auto">
          From shipping containers to server clusters, the Knapsack Problem (and its variations) drives efficiency in major industries.
        </p>
      </div>

      {/* Industry Applications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
             <Truck size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Logistics & Shipping</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            <strong>Problem:</strong> Cargo Loading (Bin Packing).<br/>
            Carriers must pack containers to maximize value/volume while adhering to weight limits.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">Multi-Knapsack</span>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">3D Constraints</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
             <TrendingUp size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Finance</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            <strong>Problem:</strong> Portfolio Optimization.<br/>
            Selecting assets (items) with highest expected return (value) within a fixed budget (capacity) and risk tolerance.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">Quadratic Knapsack</span>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">Budgeting</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 mb-4">
             <Cpu size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Cloud Computing</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            <strong>Problem:</strong> Resource Scheduling.<br/>
            Allocating VMs (items) to physical hosts (knapsacks) based on CPU/RAM requirements to minimize idle resources.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">Multi-dimensional</span>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">Kubernetes</span>
          </div>
        </div>
      </div>

      {/* Frameworks & Libraries */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-8">
           <Code2 className="text-indigo-600" size={32} />
           <h2 className="text-3xl font-bold text-slate-900">Frameworks & Libraries</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BoxSelect size={64} />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Google OR-Tools</h4>
            <p className="text-slate-600 text-sm mb-4">
              An open-source software suite for combinatorial optimization. It contains a specialized <code>KnapsackSolver</code> that uses advanced branch-and-bound algorithms.
            </p>
            <div className="bg-white p-3 rounded border border-slate-200 font-mono text-xs text-slate-700">
              solver = pywraplp.Solver.CreateSolver('SCIP')<br/>
              solver.Maximize(sum(values[i] * x[i]))
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Layers size={64} />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">SciPy & NumPy</h4>
            <p className="text-slate-600 text-sm mb-4">
              Standard Python scientific stack. <code>scipy.optimize.milp</code> allows for Mixed Integer Linear Programming, effectively solving Knapsack by treating item selection as binary decision variables.
            </p>
             <div className="bg-white p-3 rounded border border-slate-200 font-mono text-xs text-slate-700">
              from scipy.optimize import milp<br/>
              res = milp(c=-values, constraints=...)
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Workflow size={64} />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Gurobi / CPLEX</h4>
            <p className="text-slate-600 text-sm mb-4">
              Enterprise-grade solvers. They excel at massive-scale problems (millions of items) using proprietary pre-solve heuristics and parallel branch-and-cut algorithms.
            </p>
             <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Industry Standard for Fortune 500</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck size={64} />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Pyomo / PuLP</h4>
            <p className="text-slate-600 text-sm mb-4">
              High-level modeling languages. They allow developers to write the Knapsack equations in intuitive Python syntax, which is then compiled and sent to solvers like CBC or Gurobi.
            </p>
             <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Best for Prototyping</div>
          </div>
        </div>
      </div>

      {/* Design Patterns */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Common Design Patterns</h2>
        
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">1</div>
            <div>
              <h4 className="font-bold text-lg text-slate-800">Branch and Bound</h4>
              <p className="text-slate-600 mt-1">
                The standard "exact" pattern. It explores the tree of possible item combinations but "prunes" (cuts off) branches that cannot possibly exceed the current best solution (based on linear relaxation bounds). This turns an exponential problem into a manageable one for medium datasets.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">2</div>
            <div>
              <h4 className="font-bold text-lg text-slate-800">Meta-Heuristics (Genetic Algorithms)</h4>
              <p className="text-slate-600 mt-1">
                Used when the search space is too large for exact methods. A "population" of knapsack solutions evolves over time.
                <ul className="list-disc ml-5 mt-2 text-sm text-slate-500">
                  <li><strong>Crossover:</strong> Combine two packing lists to create a new one.</li>
                  <li><strong>Mutation:</strong> Randomly add/remove an item to avoid local optima.</li>
                </ul>
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">3</div>
            <div>
              <h4 className="font-bold text-lg text-slate-800">Column Generation</h4>
              <p className="text-slate-600 mt-1">
                A sophisticated pattern used in the "Cutting Stock" problem (a knapsack variant). Instead of considering all possible items/patterns at once, the algorithm generates useful patterns "on the fly" to enter the basis of the linear program. This handles problems with effectively infinite item variations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSection;