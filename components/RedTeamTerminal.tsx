import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Terminal as TerminalIcon, Play, Square, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { simulateRedTeam } from '../services/geminiService';
import { RedTeamSimulationResult } from '../types';

interface RedTeamTerminalProps {
  target: string;
  onSimulationStart: () => void;
  onSimulationComplete: (result: RedTeamSimulationResult) => void;
}

const RedTeamTerminal: React.FC<RedTeamTerminalProps> = ({ target, onSimulationStart, onSimulationComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isGenerating]);

  const launchSimulation = async () => {
    setLogs([]);
    setIsRunning(true);
    setIsGenerating(true);
    onSimulationStart();

    setLogs((prev) => [
      ...prev,
      `Initializing ThreatLens Red Team AI...`,
      `Establishing connection to Gemini 3.1 Pro...`,
      `Target locked: ${target}`,
      `Commencing deep structural analysis...`
    ]);

    try {
      // Actually hit the Gemini API to get custom payload based on the target
      const result = await simulateRedTeam(target);
      setIsGenerating(false);

      // Now slowly print out the logs from the AI to simulate an ongoing attack
      let currentIndex = 0;
      const generatedLogs = result.logs;
      
      const pushNextLog = () => {
        if (!isRunning) return; // if user stopped it

        if (currentIndex < generatedLogs.length) {
          setLogs(prev => [...prev, generatedLogs[currentIndex]]);
          currentIndex++;
          // Random delay to look "hacker-ish"
          setTimeout(pushNextLog, Math.random() * 800 + 400);
        } else {
          setLogs(prev => [...prev, `[!!!] APT SIMULATION COMPLETE. Data aggregated.`]);
          setIsRunning(false);
          onSimulationComplete(result);
        }
      };

      setTimeout(pushNextLog, 1000);

    } catch (error) {
      setIsGenerating(false);
      setIsRunning(false);
      setLogs((prev) => [...prev, `[CRITICAL FATAL] API Connection lost or analysis failed.`, String(error)]);
    }
  };

  const stopSimulation = () => {
    setIsRunning(false);
    setIsGenerating(false);
  };

  return (
    <div className="h-full flex flex-col pt-2 max-w-5xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
         <div>
           <h2 className="text-xl font-mono text-white tracking-widest uppercase">Autonomous Red Team Agent</h2>
           <p className="text-xs text-gray-500 font-mono mt-1">Multi-agent LLM system attempting to breach the digital twin.</p>
         </div>
         <button 
           onClick={isRunning ? stopSimulation : launchSimulation}
           disabled={isGenerating}
           className={cn(
             "px-4 py-2 rounded text-xs font-mono tracking-widest uppercase flex items-center gap-2 transition-all",
             isRunning 
              ? "bg-red-950/50 text-red-500 border border-red-900/50 hover:bg-red-900/30" 
              : "bg-green-950/50 text-green-500 border border-green-900/50 hover:bg-green-900/30",
             isGenerating && "opacity-50 cursor-not-allowed"
           )}
         >
           {isRunning ? (
             <><Square className="w-3 h-3" /> Abort</>
           ) : (
             <><Play className="w-3 h-3" /> Launch APT Simulator</>
           )}
         </button>
      </div>

      <div className="flex-1 bg-black border border-gray-800 rounded-lg flex flex-col overflow-hidden relative shadow-2xl">
         {/* Terminal Header */}
         <div className="h-10 bg-gray-900 border-b border-gray-800 flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-2">
               <TerminalIcon className="w-4 h-4 text-gray-500" />
               <span className="text-xs font-mono text-gray-400">root@threatlens:~#</span>
            </div>
            {isRunning && (
               <div className="flex items-center gap-2">
                 <Loader2 className="w-3 h-3 text-red-500 animate-spin" />
                 <span className="text-[10px] text-red-500 font-mono tracking-widest">
                   {isGenerating ? "GENERATING AI PAYLOAD..." : "EXECUTING"}
                 </span>
               </div>
            )}
         </div>

         {/* Terminal Body */}
         <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-2 relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20" />
            
            <div className="text-xs font-mono text-gray-500 mb-6">
              Welcome to ThreatLens Cognitive Cyber Engine v2.0.<br/>
              Powered by Gemini 3.1 Pro via AI Studio.<br/>
              Type 'help' for available commands or click 'Launch APT Simulator' to begin autonomous operation.<br/>
              ========================================================================
            </div>

            {logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "font-mono text-sm tracking-tight leading-relaxed",
                  log.includes("[!]") && "text-yellow-400",
                  log.includes("[AGENT]") && "text-blue-400",
                  log.includes("[CRITICAL]") || log.includes("[DATA LEAK]") ? "text-red-500 font-bold" : "text-green-400/90"
                )}
              >
                <span className="text-gray-600 mr-2">{'>'}</span> {log}
              </motion.div>
            ))}
            
            {isRunning && (
              <motion.div 
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-gray-400 inline-block mt-2"
              />
            )}
         </div>
      </div>
    </div>
  );
};

export default RedTeamTerminal;
