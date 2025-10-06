import { ProjectAnalysis } from '../types';

declare global {
  interface Window {
    gapi: any;
  }
}

const HEADERS = [
  "Status", "Project Name", "Strengths", "Weaknesses", "Potential", 
  "Investment Potential", "Risks", "Founder and Team", "Tokenomics", "Community and Ecosystem"
];

// Helper to convert project data object to an array in the correct order
const projectAnalysisToArray = (data: ProjectAnalysis): string[] => {
  return [
    data.status,
    data.projectName,
    data.strengths,
    data.weaknesses,
    data.potential,
    data.investmentPotential,
    data.risks,
    data.founderAndTeam,
    data.tokenomics,
    data.communityAndEcosystem,
  ];
};


export const appendToSheet = async (spreadsheetId: string, data: ProjectAnalysis) => {
  try {
    const sheets = window.gapi.client.sheets;

    // Check if the sheet is empty or has headers
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'Sheet1!A1:J1', // Check the first row
    });

    const firstRow = getResponse.result.values ? getResponse.result.values[0] : [];
    let needsHeaders = true;

    if (firstRow && firstRow.length > 0) {
      // Basic check to see if it looks like our header row
      if (firstRow[0] === HEADERS[0] && firstRow[1] === HEADERS[1]) {
        needsHeaders = false;
      }
    }
    
    const valuesToAppend = [];
    if (needsHeaders) {
      valuesToAppend.push(HEADERS);
    }
    valuesToAppend.push(projectAnalysisToArray(data));

    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'Sheet1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: valuesToAppend,
      },
    });
  } catch (err: any) {
    console.error("Google Sheets API Error:", err);
    // Re-throw a more user-friendly error
    const reason = err.result?.error?.message || 'Không thể ghi dữ liệu.';
    throw new Error(`Lỗi Google Sheets: ${reason}`);
  }
};
