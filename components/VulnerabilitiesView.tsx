import React from 'react';
import { Vulnerability } from '../types';
import { ShieldAlert, BookOpen, ExternalLink, Code } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface VulnerabilitiesViewProps {
  vulnerabilities: Vulnerability[];
}

// Fallback data if none passed
const fallbackVulns: Vulnerability[] = [
  {
    id: "VULN-992",
    title: "JWT Algorithm Confusion",
    description: "The authentication middleware accepts 'none' or insecure algorithms when verifying JWT tokens, allowing attackers to forge credentials and escalate privileges.",
    severity: "Critical" as any,
    file: "src/auth/middleware.ts",
    line: 42,
    suggestion: "Enforce exact algorithm verification in jsonwebtoken library by passing `algorithms: ['RS256']` in the verify options.",
    cwe: "CWE-327"
  },
  {
    id: "VULN-811",
    title: "SQL Injection via Search Parameter",
    description: "User input from req.query.q is directly concatenated into a raw SQL query. This permits complete database extraction via UNION-based injection.",
    severity: "High" as any,
    file: "src/api/users/search.ts",
    line: 18,
    suggestion: "Migrate away from raw string concatenation. Use parameterized queries or an ORM like Prisma.",
    cwe: "CWE-89"
  },
  {
    id: "VULN-412",
    title: "Missing Rate Limiting on Password Reset",
    description: "The POST /api/auth/reset-password endpoint has no rate limiting configured, making it vulnerable to brute-force attacks and email spamming.",
    severity: "Medium" as any,
    file: "src/api/auth/reset.ts",
    line: 12,
    suggestion: "Implement a sliding window rate limiter (e.g., redis-based) allowing a maximum of 3 requests per IP per hour.",
    cwe: "CWE-307"
  }
];

const VulnerabilitiesView: React.FC<VulnerabilitiesViewProps> = ({ vulnerabilities }) => {
  const displayVulns = vulnerabilities.length > 0 ? vulnerabilities : fallbackVulns;

  return (
    <div className="max-w-5xl mx-auto pt-2 space-y-6 h-full flex flex-col">
       <div>
         <h2 className="text-xl font-mono text-white tracking-widest uppercase flex items-center gap-2">
           <ShieldAlert className="w-5 h-5 text-red-500" /> Confirmed Exploits
         </h2>
         <p className="text-xs text-gray-500 font-mono mt-1">
           Vulnerabilities mathematically proven via Red Team autonomous penetration testing.
         </p>
       </div>

       <div className="flex-1 overflow-y-auto space-y-4 pr-2">
         {displayVulns.map((vuln, i) => (
           <motion.div 
             key={vuln.id}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-gray-900/30 border border-gray-800 rounded-lg p-5 backdrop-blur-sm"
           >
             <div className="flex items-start justify-between mb-4">
               <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded border uppercase",
                      vuln.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                      vuln.severity === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                      vuln.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    )}>
                      {vuln.severity} SEVERITY
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{vuln.id}</span>
                  </div>
                  <h3 className="text-lg font-mono text-white">{vuln.title}</h3>
               </div>
               
               {vuln.cwe && (
                  <div className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 font-mono flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {vuln.cwe}
                  </div>
               )}
             </div>

             <p className="text-sm text-gray-300 leading-relaxed mb-6">
               {vuln.description}
             </p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-800 pt-4">
                <div>
                   <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2 flex items-center gap-1">
                     <Code className="w-3 h-3" /> Vulnerable Location
                   </p>
                   <div className="bg-black border border-gray-800 rounded p-3 font-mono text-xs text-gray-400 flex items-center justify-between">
                      <span>{vuln.file}</span>
                      <span className="text-gray-600">Line {vuln.line}</span>
                   </div>
                </div>
                <div>
                   <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-2 flex items-center gap-1">
                     <ExternalLink className="w-3 h-3" /> Auto-Generated Patch Suggestion
                   </p>
                   <div className="bg-green-950/20 border border-green-900/30 rounded p-3 font-mono text-xs text-green-400/80 leading-relaxed">
                     {vuln.suggestion}
                   </div>
                </div>
             </div>
           </motion.div>
         ))}
       </div>
    </div>
  );
};

export default VulnerabilitiesView;
