
import React, { useState } from 'react';
import { ProjectAnalysis } from './types';
import { analyzeProject } from './services/geminiService';
import Header from './components/Header';
import ProjectInputForm from './components/ProjectInputForm';
import ResultsTable from './components/ResultsTable';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<ProjectAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (projectName: string, projectLink: string) => {
    if (!projectName.trim() || !projectLink.trim()) {
      setError('Vui lòng nhập Tên dự án và Liên kết dự án.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeProject(projectName, projectLink);
      setAnalysisResults(prevResults => [result, ...prevResults]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <main className="mt-8 space-y-12">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700">
            <ProjectInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
              <span className="font-bold">Lỗi: </span>
              <span>{error}</span>
            </div>
          )}

          {isLoading && <Loader />}
          
          <ResultsTable results={analysisResults} />

        </main>
      </div>
    </div>
  );
};

export default App;
