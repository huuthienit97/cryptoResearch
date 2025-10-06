import { GoogleGenAI, Type } from "@google/genai";
import { ProjectAnalysis } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    status: { type: Type.STRING, description: "Trạng thái hiện tại của dự án (ví dụ: Đang hoạt động, Giai đoạn đầu, Suy giảm, Không còn tồn tại)." },
    projectName: { type: Type.STRING, description: "Tên của dự án." },
    strengths: { type: Type.STRING, description: "Những điểm mạnh chính của dự án." },
    weaknesses: { type: Type.STRING, description: "Những điểm yếu hoặc thách thức chính." },
    potential: { type: Type.STRING, description: "Tiềm năng và triển vọng trong tương lai." },
    investmentPotential: { type: Type.STRING, description: "Đánh giá tiềm năng đầu tư của dự án (ví dụ: Cao, Trung bình, Thấp) và giải thích ngắn gọn." },
    risks: { type: Type.STRING, description: "Những rủi ro chính liên quan đến dự án." },
    founderAndTeam: { type: Type.STRING, description: "Thông tin về nhà sáng lập và đội ngũ." },
    tokenomics: { type: Type.STRING, description: "Phân tích về Tokenomics của dự án (phân phối token, tiện ích, lạm phát/giảm phát)." },
    communityAndEcosystem: { type: Type.STRING, description: "Đánh giá về cộng đồng và hệ sinh thái xung quanh dự án." },
  },
  required: ["status", "projectName", "strengths", "weaknesses", "potential", "investmentPotential", "risks", "founderAndTeam", "tokenomics", "communityAndEcosystem"]
};

export const analyzeProject = async (projectName: string, projectLink: string): Promise<ProjectAnalysis> => {
  try {
    const prompt = `Phân tích dự án tiền điện tử có tên "${projectName}". Trang web/tài nguyên chính: ${projectLink}. Cung cấp một phân tích đầu tư ngắn gọn nhưng toàn diện. Đánh giá các yếu tố sau: Tình trạng, Điểm mạnh, Điểm yếu, Tiềm năng, Tiềm năng đầu tư (ví dụ: Cao, Trung bình, Thấp kèm giải thích), Rủi ro, Người sáng lập và Đội ngũ, Tokenomics, và Cộng đồng/Hệ sinh thái. Trả về kết quả phân tích dưới dạng một đối tượng JSON duy nhất.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    // Ensure the project name from input is used, as model might slightly alter it.
    parsedData.projectName = projectName;

    return parsedData as ProjectAnalysis;

  } catch (error) {
    console.error("Error analyzing project:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze project with Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred during project analysis.");
  }
};
