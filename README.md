# ThreatLens AI Red-Teaming

ThreatLens is a security-awareness prototype that visualizes AI-generated attack paths against a represented technology stack. It is exploratory: useful for thinking about failure modes, but not a replacement for real security review.

View the AI Studio prototype: https://ai.studio/apps/a4706f95-4f64-4d5b-818a-135f72121726

## What It Explores

- Turning system components into possible attack-path narratives.
- Visualizing risk, impact, and staged failure modes.
- Using AI to support security thinking without treating output as authoritative.
- Where a real security tool would need evidence, scanning, and validation.

## Technical Notes

- React and Vite frontend.
- Gemini API integration through `@google/genai`.
- Recharts, motion, clsx, tailwind-merge, and lucide-react for interface and visualization work.

## Current Status

This is a prototype source repo. It should be treated as a security-awareness concept, not an operational scanner or validated red-team system.

Production work would require evidence-backed findings, safe target handling, model-output validation, audit logs, permissions, and clear scope boundaries.

## Run Locally

Prerequisite: Node.js.

1. Install dependencies:
   `npm install`
2. Create `.env.local` and add your own Gemini API key.
3. Run the app:
   `npm run dev`

## API Key Boundary

Do not deploy this Vite app with a private Gemini key embedded into browser JavaScript. If deploying outside AI Studio, use a server-side API route or an explicit visitor-provided key flow.

## AI-Assisted Build Note

This prototype was built with AI assistance. The useful work is failure-mode framing, risk visualization, and being explicit that generated attack narratives need validation before they should guide real decisions.

## Related Public Notes

See the combined prototype overview repo: https://github.com/brycejohnson1417/ai-studio-prototype-overviews
