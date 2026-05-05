export enum Severity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  INFO = 'Info'
}

export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  file?: string;
  line?: number;
  suggestion: string;
  cwe?: string; // Common Weakness Enumeration ID
}

export interface TwinNode {
  id: string;
  type: 'service' | 'database' | 'client' | 'gateway' | 'third-party';
  name: string;
  status: 'secure' | 'compromised' | 'under-attack' | 'unknown';
  riskScore: number;
}

export interface TwinEdge {
  id: string;
  source: string;
  target: string;
  protocol: string;
}

export interface AttackStep {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  targetNodeId: string;
  status: 'success' | 'failed' | 'in-progress';
  details: string;
}

export interface RedTeamSimulationResult {
  logs: string[];
  vulnerabilities: Vulnerability[];
  nodes: TwinNode[];
  edges: TwinEdge[];
}

export type ViewState = 'dashboard' | 'digital-twin' | 'red-team-terminal' | 'vulnerabilities' | 'settings';
