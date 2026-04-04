export interface Dimension {
  id: string;
  name: string;
  desc: string;
  custom?: boolean;
}

export interface Scale {
  label: string;
  min: number;
  max: number;
  note: string;
  buildLabel: string;
  buyLabel: string;
}

export interface Rubric {
  id: string;
  org: string;
  title: string;
  description: string;
  authorName: string;
  dimensions: Dimension[];
  scale: Scale;
  createdAt: string;
}

export interface EvalResponse {
  id?: string;
  evaluatorName: string;
  role: string;
  scores: Record<string, number | "na">;
  comment: string;
  submittedAt: string;
}

export const DIMS: Dimension[] = [
  { id: "d1", name: "Strategic Differentiation", desc: "Would owning this capability create a meaningful competitive moat?" },
  { id: "d2", name: "Core Competency Fit", desc: "Does this sit squarely within the team's domain expertise and strengths?" },
  { id: "d3", name: "Time to Value", desc: "Is speed of delivery a critical factor for this capability?" },
  { id: "d4", name: "Total Cost of Ownership", desc: "Is buying likely more cost-effective than building over 3–5 years?" },
  { id: "d5", name: "Vendor Market Maturity", desc: "Are there proven, stable vendors with strong track records available?" },
  { id: "d6", name: "Integration Complexity", desc: "Would a commercial solution integrate well with existing systems and data?" },
  { id: "d7", name: "Data Sensitivity & Control", desc: "Can we share this data externally without meaningful strategic risk?" },
  { id: "d8", name: "Customization Requirements", desc: "Do our requirements closely match what commercial vendors offer out of the box?" },
  { id: "d9", name: "Maintenance & Ops Burden", desc: "Would building internally create significant long-term maintenance overhead?" },
  { id: "d10", name: "Scalability & Reliability", desc: "Can a commercial solution reliably scale with our growth trajectory?" },
  { id: "d11", name: "Internal Talent & Capacity", desc: "Do we have available talent with the right skills to build this well?" },
  { id: "d12", name: "Risk Tolerance", desc: "Can we absorb the risk and potential delay if an internal build effort fails?" },
  { id: "d13", name: "Regulatory & Compliance", desc: "Are compliance requirements better managed by a specialized commercial vendor?" },
  { id: "d14", name: "Innovation Velocity", desc: "Is this space evolving fast enough that vendor R&D outpaces what we could build?" },
  { id: "d15", name: "IP & Competitive Sensitivity", desc: "Can we share this capability externally without exposing competitive IP?" },
];

export const SCALES: Scale[] = [
  { label: "0–3", min: 0, max: 3, note: "Simple 4-point", buildLabel: "0", buyLabel: "3" },
  { label: "1–5", min: 1, max: 5, note: "Standard 5-point", buildLabel: "1", buyLabel: "5" },
  { label: "1–7", min: 1, max: 7, note: "Nuanced 7-point", buildLabel: "1", buyLabel: "7" },
  { label: "1–10", min: 1, max: 10, note: "Detailed 10-point", buildLabel: "1", buyLabel: "10" },
];

export const STAKEHOLDER_ROLES = [
  "Product",
  "Engineering",
  "Operations",
  "Business / Strategy",
  "Finance",
  "Legal / Compliance",
  "Other",
];
