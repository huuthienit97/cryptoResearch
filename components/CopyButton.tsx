import React, { useState } from 'react';
import { ProjectAnalysis } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

interface CopyButtonProps {
  data: ProjectAnalysis[];
  headers: string[];
}

const CopyButton: React.FC<CopyButtonProps> = ({ data, headers }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const sanitize = (str: string) => `"${(str || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;

    const headerRow = headers.join('\t');
    const dataRows = data.map(row => 
      [
        sanitize(row.status),
        sanitize(row.projectName),
        sanitize(row.marketCap),
        sanitize(row.currentPrice),
        sanitize(row.volume24h),
        sanitize(row.circulatingSupply),
        sanitize(row.totalSupply),
        sanitize(row.ath),
        sanitize(row.strengths),
        sanitize(row.weaknesses),
        sanitize(row.potential),
        sanitize(row.investmentPotential),
        sanitize(row.risks),
        sanitize(row.founderAndTeam),
        sanitize(row.tokenomics),
        sanitize(row.communityAndEcosystem),
      ].join('\t')
    ).join('\n');

    const tsvContent = `${headerRow}\n${dataRows}`;

    navigator.clipboard.writeText(tsvContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200"
    >
      {copied ? (
        <>
          <CheckIcon className="h-5 w-5 mr-2 text-green-400" />
          Đã sao chép
        </>
      ) : (
        <>
          <ClipboardIcon className="h-5 w-5 mr-2" />
          Sao chép vào Bảng tính
        </>
      )}
    </button>
  );
};

export default CopyButton;