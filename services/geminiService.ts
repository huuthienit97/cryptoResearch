
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectAnalysis, AnalysisDetails, GroundingSource } from '../types';
import { GEMINI_API_KEY } from '../config';

// Updated: Add new quantitative fields to the schema.
const analysisSchemaProperties = {
    status: { type: Type.STRING, description: "Trạng thái hiện tại của dự án (ví dụ: Đang hoạt động, Giai đoạn đầu, Suy giảm, Không còn tồn tại)." },
    marketCap: { type: Type.STRING, description: "Vốn hóa thị trường hiện tại của dự án. Trả về 'Không có dữ liệu' nếu không tìm thấy." },
    currentPrice: { type: Type.STRING, description: "Giá token/coin hiện tại. Trả về 'Không có dữ liệu' nếu không tìm thấy." },
    volume24h: { type: Type.STRING, description: "Khối lượng giao dịch trong 24 giờ qua. Trả về 'Không có dữ liệu' nếu không tìm thấy." },
    circulatingSupply: { type: Type.STRING, description: "Nguồn cung token/coin đang lưu hành. Trả về 'Không có dữ liệu' nếu không tìm thấy." },
    totalSupply: { type: Type.STRING, description: "Tổng nguồn cung của token/coin. Trả về 'Không có dữ liệu' nếu không tìm thấy." },
    ath: { type: Type.STRING, description: "Giá cao nhất mọi thời đại (ATH). Trả về 'Không có dữ liệu' nếu không tìm thấy." },
    strengths: { type: Type.STRING, description: "Những điểm mạnh chính của dự án." },
    weaknesses: { type: Type.STRING, description: "Những điểm yếu hoặc thách thức chính." },
    potential: { type: Type.STRING, description: "Tiềm năng và triển vọng trong tương lai." },
    investmentPotential: { type: Type.STRING, description: "Đánh giá tiềm năng đầu tư của dự án (ví dụ: Cao, Trung bình, Thấp) và giải thích ngắn gọn." },
    risks: { type: Type.STRING, description: "Những rủi ro chính liên quan đến dự án." },
    founderAndTeam: { type: Type.STRING, description: "Thông tin về nhà sáng lập và đội ngũ." },
    tokenomics: { type: Type.STRING, description: "Phân tích về Tokenomics của dự án (phân phối token, tiện ích, lạm phát/giảm phát)." },
    communityAndEcosystem: { type: Type.STRING, description: "Đánh giá về cộng đồng và hệ sinh thái xung quanh dự án." },
};

const analysisSchemaRequired = ["status", "marketCap", "currentPrice", "volume24h", "circulatingSupply", "totalSupply", "ath", "strengths", "weaknesses", "potential", "investmentPotential", "risks", "founderAndTeam", "tokenomics", "communityAndEcosystem"];

const analysisSchema = {
  type: Type.OBJECT,
  properties: analysisSchemaProperties,
  required: analysisSchemaRequired
};

const schemaDescriptionForPrompt = `QUAN TRỌNG: Trả về toàn bộ phản hồi của bạn dưới dạng một đối tượng JSON hợp lệ duy nhất. Không thêm bất kỳ định dạng markdown nào (như \`\`\`json). JSON phải có các khóa sau với giá trị chuỗi: "status", "marketCap", "currentPrice", "volume24h", "circulatingSupply", "totalSupply", "ath", "strengths", "weaknesses", "potential", "investmentPotential", "risks", "founderAndTeam", "tokenomics", "communityAndEcosystem". Không bao gồm khóa "projectName" trong đối tượng JSON.`;


export const analyzeProject = async (projectName: string, projectLinks: string, isDeepSearch: boolean): Promise<ProjectAnalysis> => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("YOUR_GEMINI_API_KEY_HERE")) {
    throw new Error("Vui lòng thiết lập Gemini API Key của bạn trong file config.ts.");
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    let prompt: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let config: any;

    if (isDeepSearch) {
        prompt = `Phân tích chuyên sâu dự án tiền điện tử có tên "${projectName}". Sử dụng Google Search để thu thập thông tin mới nhất và toàn diện nhất, kết hợp với các nguồn thông tin được cung cấp dưới đây:\n${projectLinks}\n\n**YÊU CẦU QUAN TRỌNG:**
1.  **Thu thập dữ liệu định lượng:** Tìm kiếm các số liệu sau và đưa vào kết quả: Vốn hóa thị trường, Giá hiện tại, Khối lượng giao dịch 24h, Nguồn cung lưu hành, Tổng cung, và Giá cao nhất mọi thời đại (ATH). Nếu không tìm thấy một số liệu nào đó, hãy trả về giá trị là "Không có dữ liệu".
2.  **Phân tích định tính:** Cung cấp phân tích chi tiết về: Tình trạng, Điểm mạnh, Điểm yếu, Tiềm năng, Tiềm năng đầu tư, Rủi ro, Người sáng lập và Đội ngũ, Tokenomics, và Cộng đồng/Hệ sinh thái.
3.  **Định dạng đầu ra:** Trả về toàn bộ phản hồi dưới dạng một đối tượng JSON hợp lệ duy nhất. JSON phải có hai khóa chính: "summary" và "fullReport".
    *   "fullReport": Chứa một phân tích chi tiết, sâu sắc và toàn diện cho MỌI mục (cả định lượng và định tính).
    *   "summary": Chứa một bản tóm tắt ngắn gọn và súc tích cho MỌI mục tương ứng trong "fullReport".

Cả "summary" và "fullReport" phải là các đối tượng có đầy đủ các khóa sau: "status", "marketCap", "currentPrice", "volume24h", "circulatingSupply", "totalSupply", "ath", "strengths", "weaknesses", "potential", "investmentPotential", "risks", "founderAndTeam", "tokenomics", "communityAndEcosystem". Không bao gồm khóa "projectName" và không thêm bất kỳ định dạng markdown nào.`;
        config = {
            tools: [{googleSearch: {}}],
            temperature: 0.5,
        };
    } else {
        prompt = `Phân tích dự án tiền điện tử có tên "${projectName}". Hãy sử dụng tất cả các nguồn thông tin được cung cấp dưới đây:\n${projectLinks}\n\n**YÊU CẦU QUAN TRỌNG:**
1.  **Thu thập dữ liệu định lượng:** Tìm kiếm các số liệu sau và đưa vào kết quả: Vốn hóa thị trường, Giá hiện tại, Khối lượng giao dịch 24h, Nguồn cung lưu hành, Tổng cung, và Giá cao nhất mọi thời đại (ATH). Nếu không tìm thấy một số liệu nào đó, hãy trả về giá trị là "Không có dữ liệu".
2.  **Phân tích định tính:** Cung cấp một phân tích đầu tư ngắn gọn nhưng toàn diện về: Tình trạng, Điểm mạnh, Điểm yếu, Tiềm năng, Tiềm năng đầu tư (ví dụ: Cao, Trung bình, Thấp kèm giải thích), Rủi ro, Người sáng lập và Đội ngũ, Tokenomics, và Cộng đồng/Hệ sinh thái.

${schemaDescriptionForPrompt}`;
        config = {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
            temperature: 0.5,
        };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: config,
    });

    let result: ProjectAnalysis;
    const jsonText = response.text.trim();

    if (isDeepSearch) {
        const cleanedJsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        const parsedData: { summary: AnalysisDetails, fullReport: AnalysisDetails } = JSON.parse(cleanedJsonText);
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = groundingChunks
          .map(chunk => chunk.web)
          .filter((source): source is GroundingSource => !!(source && source.uri && source.title));
        
        result = {
          ...parsedData.summary,
          projectName: projectName,
          fullAnalysis: parsedData.fullReport,
          sources: sources
        };

    } else {
        const parsedDetails: AnalysisDetails = JSON.parse(jsonText);
        result = {
          ...parsedDetails,
          projectName: projectName
        };
    }
    
    return result;

  } catch (error) {
    console.error("Error analyzing project:", error);
    if (error instanceof Error) {
        throw new Error(`Đã xảy ra lỗi khi gọi Gemini API: ${error.message}`);
    }
    throw new Error("Đã xảy ra lỗi không xác định trong quá trình phân tích dự án.");
  }
};