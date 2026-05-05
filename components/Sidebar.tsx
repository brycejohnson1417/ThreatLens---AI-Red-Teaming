import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Network, Terminal, ShieldAlert, Settings, X, Crosshair } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose }) => {
  const navItem = (view: ViewState, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => {
        onNavigate(view);
        onClose();
      }}
      className={cn(
        "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 relative group overflow-hidden",
        currentView === view 
          ? 'bg-red-900/20 text-red-400 border-l-2 border-red-500' 
          : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
      )}
    >
      {currentView === view && (
        <span className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-50" />
      )}
      <div className="relative z-10 flex items-center gap-3">
        {icon}
        <span className="font-mono text-xs tracking-widest uppercase">{label}</span>
      </div>
    </button>
  );

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/90 z-40 md:hidden transition-opacity duration-300",
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      
      <div className={cn(
        "fixed md:relative inset-y-0 left-0 z-50 w-64 bg-black border-r border-gray-900 flex flex-col h-full transform transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none",
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-6 flex items-center justify-between border-b border-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-red-900/5 mix-blend-overlay" />
          <div className="flex items-center space-x-3 relative z-10">
            <Crosshair className="w-8 h-8 text-red-500 animate-pulse" />
            <div>
              <h1 className="text-xl font-bold text-white tracking-widest uppercase font-mono">ThreatLens</h1>
              <p className="text-[10px] text-red-500/70 font-mono tracking-widest">APT SIMULATOR V2.0</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white relative z-10">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          {navItem('dashboard', <LayoutDashboard size={18} />, 'War Room')}
          {navItem('digital-twin', <Network size={18} />, 'Digital Twin')}
          {navItem('red-team-terminal', <Terminal size={18} />, 'Auto Agent')}
          {navItem('vulnerabilities', <ShieldAlert size={18} />, 'Findings')}
          {navItem('settings', <Settings size={18} />, 'Config')}
        </nav>

        <div className="p-4 border-t border-gray-900 bg-black backdrop-blur-md">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-2">Sim Engine Status</p>
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-2">
                 <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                 <span className="text-xs text-red-400 font-mono">ACTIVE (HOT)</span>
               </div>
               <span className="text-[10px] text-gray-600 font-mono">35ms</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;