import React from 'react';
import { ProjectAnalysis, AnalysisDetails } from '../types';
import { PdfIcon } from './icons/PdfIcon';

interface ExportButtonProps {
  project: ProjectAnalysis;
}

const ExportButton: React.FC<ExportButtonProps> = ({ project }) => {
  const handleExport = () => {
    const analysisData = project.fullAnalysis || project;
    
    const { projectName, sources } = project;
    const { ...details } = analysisData;
    const reportTitle = `Phân Tích Dự Án Crypto: ${projectName}`;

    const fieldLabels: { [key in keyof Omit<AnalysisDetails, 'projectName' | 'sources' | 'fullAnalysis'>]: string } = {
        status: "Tình trạng",
        marketCap: "Vốn hóa thị trường",
        currentPrice: "Giá hiện tại",
        volume24h: "Khối lượng giao dịch (24h)",
        circulatingSupply: "Nguồn cung lưu hành",
        totalSupply: "Tổng cung",
        ath: "Giá cao nhất mọi thời đại (ATH)",
        strengths: "Điểm mạnh",
        weaknesses: "Điểm yếu",
        potential: "Tiềm năng",
        investmentPotential: "Tiềm năng Đầu tư",
        risks: "Rủi ro",
        founderAndTeam: "Người sáng lập & Đội ngũ",
        tokenomics: "Tokenomics",
        communityAndEcosystem: "Cộng đồng & Hệ sinh thái",
    };
    
    // Define the order for the report
    const fieldOrder: (keyof typeof fieldLabels)[] = [
      'status', 'marketCap', 'currentPrice', 'volume24h', 'circulatingSupply', 'totalSupply', 'ath',
      'investmentPotential', 'potential', 'strengths', 'weaknesses', 'risks', 
      'founderAndTeam', 'tokenomics', 'communityAndEcosystem'
    ];

    let content = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${reportTitle}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
              line-height: 1.6; 
              color: #1a202c;
              margin: 40px;
            }
            h1 { font-size: 24px; color: #1a202c; border-bottom: 2px solid #718096; padding-bottom: 10px; margin-bottom: 20px; }
            h2 { font-size: 18px; color: #2d3748; border-bottom: 1px solid #cbd5e0; padding-bottom: 5px; margin-top: 25px; margin-bottom: 10px; }
            p, li { font-size: 14px; color: #4a5568; white-space: pre-wrap; word-wrap: break-word; }
            .section { margin-bottom: 20px; page-break-inside: avoid; }
            ul { padding-left: 20px; }
            a { color: #2b6cb0; text-decoration: none; }
            a:hover { text-decoration: underline; }
            @media print {
              body { margin: 20px; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <h1>${reportTitle}</h1>
    `;

    for (const key of fieldOrder) {
      const value = details[key];
      if (value) {
        content += `
          <div class="section">
            <h2>${fieldLabels[key]}</h2>
            <p>${String(value).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
        `;
      }
    }

    if (sources && sources.length > 0) {
        content += `
            <div class="section">
                <h2>Nguồn tham khảo (từ Deep Search)</h2>
                <ul>
                    ${sources.map(source => `<li><a href="${source.uri}" target="_blank" rel="noopener noreferrer">${source.title || source.uri}</a></li>`).join('')}
                </ul>
            </div>
        `;
    }

    content += `</body></html>`;

    const printWindow = window.open('', '_blank', 'height=600,width=800');
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(content);
        printWindow.document.close();
        
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
    }
  };

  return (
    <button
      onClick={handleExport}
      className="p-2 text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-600 rounded-md transition-colors"
      title={`Xuất PDF cho ${project.projectName}`}
    >
      <PdfIcon className="h-5 w-5" />
    </button>
  );
};

export default ExportButton;