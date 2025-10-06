
import React, { useState } from 'react';

interface ProjectInputFormProps {
  onAnalyze: (projectName: string, projectLink: string) => void;
  isLoading: boolean;
}

const ProjectInputForm: React.FC<ProjectInputFormProps> = ({ onAnalyze, isLoading }) => {
  const [projectName, setProjectName] = useState('');
  const [projectLink, setProjectLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(projectName, projectLink);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-2">
            Tên dự án
          </label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="ví dụ: Ethereum"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
            required
          />
        </div>
        <div>
          <label htmlFor="projectLink" className="block text-sm font-medium text-gray-300 mb-2">
            Liên kết dự án (Website, Whitepaper, v.v.)
          </label>
          <input
            type="url"
            id="projectLink"
            value={projectLink}
            onChange={(e) => setProjectLink(e.target.value)}
            placeholder="https://ethereum.org"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
            required
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang phân tích...
            </>
          ) : (
            'Phân tích dự án'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectInputForm;
