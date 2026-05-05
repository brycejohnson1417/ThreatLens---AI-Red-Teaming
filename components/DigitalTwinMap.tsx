import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, Cpu, Database, Globe, Network, ShieldAlert } from 'lucide-react';
import { TwinNode, TwinEdge } from '../types';
import { cn } from '../lib/utils';

// Mock data for the digital twin architecture
const mockNodes: TwinNode[] = [
  { id: 'gateway', type: 'gateway', name: 'API Gateway', status: 'secure', riskScore: 10 },
  { id: 'auth', type: 'service', name: 'Auth Service', status: 'compromised', riskScore: 85 },
  { id: 'users-db', type: 'database', name: 'Users Database', status: 'under-attack', riskScore: 60 },
  { id: 'payment', type: 'service', name: 'Payment Service', status: 'secure', riskScore: 15 },
  { id: 'frontend', type: 'client', name: 'Web Client', status: 'secure', riskScore: 5 },
  { id: 'cache', type: 'database', name: 'Redis Cache', status: 'secure', riskScore: 20 },
];

const mockEdges: TwinEdge[] = [
  { id: 'e1', source: 'frontend', target: 'gateway', protocol: 'HTTPS' },
  { id: 'e2', source: 'gateway', target: 'auth', protocol: 'gRPC' },
  { id: 'e3', source: 'gateway', target: 'payment', protocol: 'gRPC' },
  { id: 'e4', source: 'auth', target: 'users-db', protocol: 'TCP' },
  { id: 'e5', source: 'auth', target: 'cache', protocol: 'TCP' },
];

const NodeIcon = ({ type, className }: { type: string, className?: string }) => {
  switch (type) {
    case 'gateway': return <Network className={className} />;
    case 'service': return <Cpu className={className} />;
    case 'database': return <Database className={className} />;
    case 'client': return <Globe className={className} />;
    default: return <Terminal className={className} />;
  }
};

const DigitalTwinMap: React.FC = () => {
  const [nodes, setNodes] = useState(mockNodes);
  const [selectedNode, setSelectedNode] = useState<TwinNode | null>(null);

  // Glitch effect intervals
  useEffect(() => {
    const interval = setInterval(() => {
       setNodes(current => current.map(n => {
         if (n.status === 'under-attack') {
           return { ...n, riskScore: Math.min(100, n.riskScore + Math.floor(Math.random() * 5)) };
         }
         return n;
       }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col pt-2">
      <div className="mb-4 flex items-center justify-between">
         <div>
           <h2 className="text-xl font-mono text-white tracking-widest">ARCHITECTURE TWIN</h2>
           <p className="text-xs text-gray-500 font-mono mt-1 w-2/3">
             Interactive physical topology of target repository. Highlighted nodes indicate simulated compromise paths.
           </p>
         </div>
         <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
              <span className="text-[10px] text-gray-400 font-mono uppercase">Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]"></span>
              <span className="text-[10px] text-gray-400 font-mono uppercase">Under Attack</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
              <span className="text-[10px] text-gray-400 font-mono uppercase">Compromised</span>
            </div>
         </div>
      </div>

      <div className="flex-1 bg-gray-900/20 border border-gray-800 rounded-lg relative overflow-hidden backdrop-blur-sm grid grid-cols-4 gap-0">
        
        {/* Visual Map Area */}
        <div className="col-span-3 relative p-8">
           {/* Grid Background */}
           <div className="absolute inset-0 pattern-grid opacity-20 pointer-events-none" />
           
           <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <style>
                {`
                  .path-line {
                    stroke-dasharray: 4;
                    animation: dash 20s linear infinite;
                  }
                  @keyframes dash {
                    to {
                      stroke-dashoffset: -100;
                    }
                  }
                `}
              </style>
             {mockEdges.map(edge => {
                // Highly simplified coordinate mapping for visual demo
                const coords: Record<string, {x: string, y: string}> = {
                  'frontend': { x: '10%', y: '50%' },
                  'gateway': { x: '30%', y: '50%' },
                  'auth': { x: '60%', y: '30%' },
                  'payment': { x: '60%', y: '70%' },
                  'users-db': { x: '85%', y: '20%' },
                  'cache': { x: '85%', y: '40%' }
                };
                
                const source = coords[edge.source];
                const target = coords[edge.target];
                const isCompromisedPath = edge.target === 'auth' || edge.target === 'users-db';

                return (
                  <g key={edge.id}>
                    <line 
                      x1={source.x} y1={source.y}
                      x2={target.x} y2={target.y}
                      stroke={isCompromisedPath ? "#ef4444" : "#4b5563"}
                      strokeWidth="2"
                      className="path-line opacity-50"
                    />
                    {isCompromisedPath && (
                       <circle r="3" fill="#ef4444">
                          <animateMotion dur="2s" repeatCount="indefinite" path={`M 0 0 L 0 0`} />
                       </circle>
                    )}
                  </g>
                );
             })}
           </svg>

           {/* Nodes */}
           {nodes.map(node => {
              const coords: Record<string, any> = {
                  'frontend': { left: '10%', top: '50%' },
                  'gateway': { left: '30%', top: '50%' },
                  'auth': { left: '60%', top: '30%' },
                  'payment': { left: '60%', top: '70%' },
                  'users-db': { left: '85%', top: '20%' },
                  'cache': { left: '85%', top: '40%' }
              };
              
              const isSelected = selectedNode?.id === node.id;
              
              return (
                <motion.div
                  key={node.id}
                  whileHover={{ scale: 1.05 }}
                  style={{ ...coords[node.id], transform: 'translate(-50%, -50%)' }}
                  className="absolute cursor-pointer"
                  onClick={() => setSelectedNode(node)}
                >
                  <div className={cn(
                    "flex flex-col items-center gap-2",
                    isSelected ? "opacity-100" : "opacity-80 hover:opacity-100"
                  )}>
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300 relative",
                      node.status === 'secure' ? 'bg-black border-green-500/50 text-green-400' :
                      node.status === 'under-attack' ? 'bg-black border-yellow-500 text-yellow-400' :
                      'bg-red-950 border-red-500 text-red-500',
                      isSelected && "ring-2 ring-white ring-offset-2 ring-offset-black"
                    )}>
                      {node.status === 'under-attack' && (
                        <div className="absolute -inset-2 border border-yellow-500/30 rounded-lg animate-ping pointer-events-none" />
                      )}
                      {node.status === 'compromised' && (
                        <div className="absolute -top-2 -right-2">
                           <ShieldAlert className="w-4 h-4 text-red-500" />
                        </div>
                      )}
                      <NodeIcon type={node.type} className="w-5 h-5" />
                    </div>
                    <div className="bg-black/80 px-2 py-1 rounded border border-gray-800 text-center">
                      <p className="text-[10px] font-mono whitespace-nowrap">{node.name}</p>
                    </div>
                  </div>
                </motion.div>
              );
           })}
        </div>

        {/* Node Properties Sidebar */}
        <div className="col-span-1 border-l border-gray-800 bg-black/50 p-6 flex flex-col">
           {selectedNode ? (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xl font-mono text-white mb-1">{selectedNode.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 uppercase tracking-widest">{selectedNode.type}</span>
                    <span className="text-gray-700">•</span>
                    <span className={cn(
                      "text-[10px] font-mono px-1.5 py-0.5 rounded uppercase",
                      selectedNode.status === 'secure' ? 'text-green-400 bg-green-500/10' :
                      selectedNode.status === 'under-attack' ? 'text-yellow-400 bg-yellow-500/10' :
                      'text-red-500 bg-red-500/10'
                    )}>
                      {selectedNode.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-gray-500 font-mono mb-2">RISK SCORE: {selectedNode.riskScore}/100</p>
                  <div className="w-full bg-gray-900 rounded-full h-1.5">
                    <div 
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        selectedNode.riskScore < 30 ? 'bg-green-500' :
                        selectedNode.riskScore < 70 ? 'bg-yellow-500' : 'bg-red-500'
                      )}
                      style={{ width: `${selectedNode.riskScore}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800 space-y-4">
                  <p className="text-[10px] text-gray-500 font-mono uppercase">Node Telemetry</p>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-gray-900/50 p-2 rounded border border-gray-800 text-center">
                        <p className="text-[9px] text-gray-500 font-mono">CPU USAGE</p>
                        <p className="text-sm font-mono text-gray-300">{Math.floor(Math.random() * 40 + 20)}%</p>
                     </div>
                     <div className="bg-gray-900/50 p-2 rounded border border-gray-800 text-center">
                        <p className="text-[9px] text-gray-500 font-mono">CONNECTIONS</p>
                        <p className="text-sm font-mono text-gray-300">{Math.floor(Math.random() * 500 + 100)}</p>
                     </div>
                  </div>
                </div>
                
                {selectedNode.status === 'compromised' && (
                  <div className="mt-6 bg-red-950/30 border border-red-900/50 p-3 rounded text-red-400 text-xs font-mono">
                     <p className="mb-2 uppercase tracking-widest text-[10px] flex items-center gap-2">
                       <ShieldAlert className="w-3 h-3" /> Breach Details
                     </p>
                     Payload injected via crafted JWT. Privilege escalation successful. Node fully compromised.
                  </div>
                )}
             </motion.div>
           ) : (
             <div className="h-full flex items-center justify-center text-center">
                <p className="text-xs text-gray-600 font-mono max-w-[200px]">Select a node to view vulnerability telemetry and structural details.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinMap;
