import { GoogleGenAI, Type } from "@google/genai";
import { Vulnerability, RedTeamSimulationResult, TwinNode, TwinEdge } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  // Initialize without exposing default empty strings if undefined
  return new GoogleGenAI({ apiKey: apiKey as string });
};

export const simulateRedTeam = async (targetRepo: string): Promise<RedTeamSimulationResult> => {
  const ai = getAiClient();
  
  const prompt = `
    You are ThreatLens, an autonomous Red Team AI.
    Your objective is to simulate a comprehensive penetration test and APT (Advanced Persistent Threat) attack against the following target:
    Target: ${targetRepo}

    Based on the name or typical architecture of such a target (if it's a known or inferable platform like 'nabis-notion-sync' or a generic web app):
    1. Infer its 'Digital Twin' architecture (Nodes: gateways, databases, microservices, frontends, etc. and Edges: how they connect).
    2. Identify realistic vulnerabilities this specific stack might have.
    3. Generate a chronological sequence of highly technical terminal logs that detail your simulated attack (reconnaissance, exploitation, lateral movement, data exfiltration).
    4. Mark which nodes become 'compromised' or 'under-attack' during your simulation.

    Provide a realistic, professional, and dark-web/red-team flavored output.

    Return EXACTLY the JSON schema requested.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4096 }, // Allow deep analysis
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            logs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Chronological terminal logs of the attack (e.g. '[*] Scanning ports...', '[+] Exploit successful', etc.). Around 15-20 logs."
            },
            vulnerabilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["Critical", "High", "Medium", "Low", "Info"] },
                  file: { type: Type.STRING, description: "Likely file or module name" },
                  line: { type: Type.INTEGER },
                  suggestion: { type: Type.STRING },
                  cwe: { type: Type.STRING }
                },
                required: ["title", "description", "severity", "suggestion"]
              }
            },
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['service', 'database', 'client', 'gateway', 'third-party'] },
                  name: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ['secure', 'compromised', 'under-attack', 'unknown'] },
                  riskScore: { type: Type.INTEGER }
                },
                required: ["id", "type", "name", "status"]
              }
            },
            edges: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  source: { type: Type.STRING },
                  target: { type: Type.STRING },
                  protocol: { type: Type.STRING }
                },
                required: ["id", "source", "target"]
              }
            }
          },
          required: ["logs", "vulnerabilities", "nodes", "edges"]
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No payload returned.");
    }
    
    const parsed = JSON.parse(text);
    
    // Assure IDs exist for vulnerabilities
    const result: RedTeamSimulationResult = {
        logs: parsed.logs || [],
        nodes: parsed.nodes || [],
        edges: parsed.edges || [],
        vulnerabilities: (parsed.vulnerabilities || []).map((v: any, index: number) => ({
            ...v,
            id: `VULN-${Math.floor(Math.random() * 9000) + 1000}`
        }))
    };

    return result;

  } catch (error) {
    console.error("Simulation failed:", error);
    throw error;
  }
};
