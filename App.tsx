import React, { useState } from 'react';
import { Tab } from './types';
import Visualizer from './components/Visualizer';
import RLSection from './components/RLSection';
import BusinessSection from './components/BusinessSection';
import ChatInterface from './components/ChatInterface';
import { Box, BrainCircuit, Briefcase, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.VISUALIZER);
  const [chatOpen, setChatOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.VISUALIZER:
        return <Visualizer />;
      case Tab.RL_SIMULATION:
        return <RLSection />;
      case Tab.BUSINESS:
        return <BusinessSection />;
      default:
        return <Visualizer />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Box className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">OptiPack <span className="text-indigo-600">AI</span></h1>
          </div>
          
          <nav className="flex gap-1">
            <button 
              onClick={() => setActiveTab(Tab.VISUALIZER)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === Tab.VISUALIZER ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <Box size={16} /> Visualizer
            </button>
            <button 
              onClick={() => setActiveTab(Tab.RL_SIMULATION)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === Tab.RL_SIMULATION ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <BrainCircuit size={16} /> RL Simulation
            </button>
            <button 
              onClick={() => setActiveTab(Tab.BUSINESS)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === Tab.BUSINESS ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <Briefcase size={16} /> Real World
            </button>
          </nav>

          <button 
             onClick={() => setChatOpen(!chatOpen)}
             className={`p-2 rounded-full transition-colors ${chatOpen ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
             title="AI Assistant"
          >
            <MessageSquare size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {chatOpen ? (
           <ChatInterface />
        ) : (
          <div className="h-full overflow-y-auto">
             {renderContent()}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 shrink-0">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          Powered by Google Gemini 2.5 Flash • React 18 • Tailwind CSS
        </div>
      </footer>
    </div>
  );
};

export default App;