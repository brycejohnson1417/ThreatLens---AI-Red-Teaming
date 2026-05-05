import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DigitalTwinMap from './components/DigitalTwinMap';
import RedTeamTerminal from './components/RedTeamTerminal';
import VulnerabilitiesView from './components/VulnerabilitiesView';
import { ViewState, Vulnerability, TwinNode, TwinEdge } from './types';
import { Menu, Activity } from 'lucide-react';
import { cn } from './lib/utils';
import { RedTeamSimulationResult } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [nodes, setNodes] = useState<TwinNode[]>([]);
  const [edges, setEdges] = useState<TwinEdge[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const targetRepo = "https://github.com/picc-ai/nabis-notion-sync";

  const handleSimulationComplete = (result: RedTeamSimulationResult) => {
    setIsSimulating(false);
    setVulnerabilities(result.vulnerabilities);
    setNodes(result.nodes);
    setEdges(result.edges);
  };

  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard vulnerabilities={vulnerabilities} targetRepo={targetRepo} />;
      case 'digital-twin':
        return <DigitalTwinMap nodes={nodes} edges={edges} />;
      case 'red-team-terminal':
        return (
          <RedTeamTerminal 
            target={targetRepo}
            onSimulationStart={() => setIsSimulating(true)} 
            onSimulationComplete={handleSimulationComplete}
          />
        );
      case 'vulnerabilities':
        return <VulnerabilitiesView vulnerabilities={vulnerabilities} />;
      default:
        return <Dashboard vulnerabilities={vulnerabilities} targetRepo={targetRepo} />;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-red-500/30">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black opacity-40 pointer-events-none" />
        
        <header className="h-16 border-b border-gray-900/50 flex items-center px-4 md:px-8 justify-between shrink-0 z-10 relative backdrop-blur-sm bg-black/60">
          <div className="flex items-center">
            <button 
              className="mr-4 text-gray-500 hover:text-white md:hidden"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest truncate flex items-center gap-2">
              <span className="text-red-500">_</span> 
              {currentView === 'dashboard' ? 'WAR ROOM : OVERVIEW' : `MODULE : ${currentView.replace('-', ' ')}`}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
             {isSimulating && (
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 border border-red-900/50">
                 <Activity className="w-3 h-3 text-red-500 animate-pulse" />
                 <span className="text-[10px] text-red-400 font-mono">SIMULATION ACTIVE</span>
               </div>
             )}
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-gray-900/50 border border-gray-800 text-xs text-gray-500 font-mono">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               TARGET: {targetRepo.replace('https://github.com/', '')}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6 scroll-smooth relative z-10">
           {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;