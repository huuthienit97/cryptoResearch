export interface ProjectAnalysis {
  status: string;
  projectName: string;
  strengths: string;
  weaknesses: string;
  potential: string;
  investmentPotential: string;
  risks: string;
  founderAndTeam: string;
  tokenomics: string;
  communityAndEcosystem: string;
}

// Fix: Added missing SelectedSheet interface.
export interface SelectedSheet {
  id: string;
  name: string;
  url: string;
}
