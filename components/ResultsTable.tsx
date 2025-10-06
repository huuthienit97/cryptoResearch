import React from 'react';
import { ProjectAnalysis } from '../types';
import CopyButton from './CopyButton';
import ExportButton from './ExportButton';
import { TrashIcon } from './icons/TrashIcon';
import { LinkIcon } from './icons/LinkIcon';

interface ResultsTableProps {
  results: ProjectAnalysis[];
  onClearHistory: () => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, onClearHistory }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-gray-800/30 rounded-2xl border border-gray-700/50">
        <p className="text-gray-400">Kết quả phân tích sẽ xuất hiện ở đây.</p>
        <p className="text-gray-500 text-sm mt-1">Nhập thông tin dự án ở trên và bắt đầu.</p>
      </div>
    );
  }

  const copyHeaders = [
    "Status", "Project Name", "Market Cap", "Current Price", "24h Volume", 
    "Circulating Supply", "Total Supply", "ATH", "Strengths", "Weaknesses", "Potential", 
    "Investment Potential", "Risks", "Founder and Team", "Tokenomics", "Community and Ecosystem"
  ];

  const displayHeaders = [
    { title: "Tên dự án", width: "12%" },
    { title: "Vốn hóa TT", width: "10%" },
    { title: "Giá", width: "8%" },
    { title: "Tiềm năng ĐT", width: "10%" },
    { title: "Điểm mạnh", width: "12%" },
    { title: "Điểm yếu", width: "12%" },
    { title: "Rủi ro", width: "12%" },
    { title: "Đội ngũ", width: "10%" },
    { title: "Tokenomics", width: "9%" },
    { title: "Thao tác", width: "5%" }
  ];


  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Kết quả phân tích</h2>
        <div className="flex items-center gap-2">
            <CopyButton data={results} headers={copyHeaders} />
            <button
                onClick={onClearHistory}
                className="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-md text-red-400 bg-gray-700 hover:bg-red-900/50 hover:border-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors duration-200"
                title="Xóa lịch sử phân tích"
            >
                <TrashIcon className="h-4 w-4 mr-1.5" />
                <span>Xóa Lịch sử</span>
            </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 table-fixed">
          <thead className="bg-gray-800/50">
            <tr>
              {displayHeaders.map((header) => (
                <th 
                  key={header.title} 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  style={{ width: header.width }}
                >
                  {header.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {results.map((result, index) => (
              <tr key={index} className="hover:bg-gray-700/50 transition-colors duration-200">
                <td className="px-6 py-4 align-top text-sm font-semibold text-white break-words">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="font-bold">{result.projectName}</span>
                      <span className="text-xs text-blue-400">{result.status}</span>
                    </div>
                    {result.sources && result.sources.length > 0 && (
                      <div className="relative group flex-shrink-0">
                        <LinkIcon className="h-4 w-4 text-blue-400" />
                        <div className="absolute bottom-full mb-2 w-72 bg-gray-900 border border-gray-600 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 -translate-x-1/2 left-1/2">
                          <h4 className="font-bold mb-1">Nguồn Deep Search:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {result.sources.map((source, i) => (
                              <li key={i} className="truncate">
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:underline" title={source.title}>{source.title}</a>
                              </li>
                            ))}
                          </ul>
                          <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-b border-r border-gray-600 transform rotate-45"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 align-top text-sm text-gray-300 whitespace-pre-wrap break-words">{result.marketCap}</td>
                <td className="px-6 py-4 align-top text-sm text-gray-300 whitespace-pre-wrap break-words">{result.currentPrice}</td>
                <td className="px-6 py-4 align-top text-sm font-medium text-green-400 whitespace-pre-wrap break-words">{result.investmentPotential}</td>
                <td className="px-6 py-4 align-top text-sm text-gray-300 whitespace-pre-wrap break-words">{result.strengths}</td>
                <td className="px-6 py-4 align-top text-sm text-gray-300 whitespace-pre-wrap break-words">{result.weaknesses}</td>
                <td className="px-6 py-4 align-top text-sm text-gray-300 whitespace-pre-wrap break-words">{result.risks}</td>
                <td className="px-6 py-4 align-top text-sm text-gray-300 whitespace-pre-wrap break-words">{result.founderAndTeam}</td>
                <td className="px-6 py-4 align-top text-sm text-gray-300 whitespace-pre-wrap break-words">{result.tokenomics}</td>
                <td className="px-6 py-4 align-top text-sm text-center">
                    <ExportButton project={result} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;