export interface GroundingSource {
  uri: string;
  title: string;
}

/**
 * Defines the core fields for a project analysis.
 */
export interface AnalysisDetails {
  status: string;
  // New quantitative fields
  marketCap: string;
  currentPrice: string;
  volume24h: string;
  circulatingSupply: string;
  totalSupply: string;
  ath: string;
  // Original qualitative fields
  strengths: string;
  weaknesses: string;
  potential: string;
  investmentPotential: string;
  risks: string;
  founderAndTeam: string;
  tokenomics: string;
  communityAndEcosystem: string;
}

/**
 * Represents the complete analysis result for a project.
 * The top-level properties will contain the summary for deep searches,
 * or the only analysis for regular searches.
 */
export interface ProjectAnalysis extends AnalysisDetails {
  projectName: string;
  fullAnalysis?: AnalysisDetails; // Optional full report for deep search
  sources?: GroundingSource[];
}


// Fix: Added missing SelectedSheet interface.
export interface SelectedSheet {
  id: string;
  name: string;
  url:string;
}