import React from 'react';
import { Vulnerability } from '../types';
import { Target, AlertTriangle, Shield, Activity, TerminalSquare, Network } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface DashboardProps {
  vulnerabilities: Vulnerability[];
  targetRepo: string;
}

const mockActivityData = [
  { time: '00:00', events: 12 },
  { time: '04:00', events: 45 },
  { time: '08:00', events: 15 },
  { time: '12:00', events: 89 },
  { time: '16:00', events: 120 },
  { time: '20:00', events: 65 },
  { time: '24:00', events: 34 },
];

const StatCard = ({ title, value, icon: Icon, colorClass, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-gray-900/40 border border-gray-800 rounded-lg p-5 flex items-center justify-between backdrop-blur-sm relative overflow-hidden"
  >
    <div className={cn("absolute inset-0 opacity-10 mix-blend-overlay", colorClass)} />
    <div>
      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">{title}</p>
      <h3 className="text-3xl font-light tracking-tight">{value}</h3>
    </div>
    <div className={cn("p-3 rounded-full bg-gray-900", colorClass)}>
      <Icon size={20} className="opacity-80" />
    </div>
  </motion.div>
);

const Dashboard: React.FC<DashboardProps> = ({ vulnerabilities, targetRepo }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="ATTACK PATHS FOUND" value="14" icon={Network} colorClass="bg-red-500 text-red-500" delay={0.1} />
        <StatCard title="VULNERABILITIES" value={vulnerabilities.length || 3} icon={AlertTriangle} colorClass="bg-orange-500 text-orange-500" delay={0.2} />
        <StatCard title="DEFENSE POSTURE" value="42%" icon={Shield} colorClass="bg-yellow-500 text-yellow-500" delay={0.3} />
        <StatCard title="SIMULATIONS RUN" value="1,405" icon={Target} colorClass="bg-blue-500 text-blue-500" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="lg:col-span-2 bg-gray-900/40 border border-gray-800 rounded-lg p-6 backdrop-blur-sm relative"
        >
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              <h3 className="font-mono text-xs text-gray-300 uppercase tracking-widest">Network Threat Activity</h3>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockActivityData}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f2937', color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#ef4444' }}
                />
                <Area type="monotone" dataKey="events" stroke="#ef4444" fillOpacity={1} fill="url(#colorEvents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-gray-900/40 border border-gray-800 rounded-lg p-6 backdrop-blur-sm flex flex-col"
        >
          <div className="flex items-center gap-2 border-b border-gray-800 pb-4 mb-4">
            <TerminalSquare className="w-4 h-4 text-gray-400" />
            <h3 className="font-mono text-xs text-gray-300 uppercase tracking-widest">Recent Intelligence</h3>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
             {[
               { id: 'INT-01', time: '10 mins ago', desc: 'Auth middleware bypass detected in simulation.', risk: 'CRITICAL' },
               { id: 'INT-02', time: '1 hr ago', desc: 'Suspected SQLi vector in /api/users endpoint.', risk: 'HIGH' },
               { id: 'INT-03', time: '4 hrs ago', desc: 'Rate limiting absent on password reset flow.', risk: 'MEDIUM' },
               { id: 'INT-04', time: '12 hrs ago', desc: 'Outdated dependency: lodash < 4.17.21', risk: 'LOW' }
             ].map((intel, i) => (
                <div key={i} className="p-3 bg-black border border-gray-800 rounded relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-gray-500 font-mono">{intel.id}</span>
                    <span className={cn(
                      "text-[9px] font-mono px-1.5 py-0.5 rounded",
                      intel.risk === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      intel.risk === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      intel.risk === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    )}>
                      {intel.risk}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">{intel.desc}</p>
                  <p className="text-[10px] text-gray-600 mt-2 font-mono">{intel.time}</p>
                </div>
             ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
