import React, { useState, useEffect } from 'react';
import { ProjectAnalysis } from './types';
import { analyzeProject } from './services/geminiService';
import Header from './components/Header';
import ProjectInputForm from './components/ProjectInputForm';
import ResultsTable from './components/ResultsTable';
import Loader from './components/Loader';

const HISTORY_KEY = 'cryptoAnalysisHistory';

const App: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<ProjectAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Tải lịch sử phân tích đã lưu
    try {
      const savedResults = localStorage.getItem(HISTORY_KEY);
      if (savedResults) {
        setAnalysisResults(JSON.parse(savedResults));
      }
    } catch (error) {
      console.error("Could not load analysis history:", error);
      localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  const handleAnalyze = async (projectName: string, projectLink: string) => {
    if (!projectName.trim() || !projectLink.trim()) {
      setError('Vui lòng nhập Tên dự án và Liên kết dự án.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fix: API key is now handled by geminiService using environment variables.
      const result = await analyzeProject(projectName, projectLink);
      
      // Cập nhật state và lưu vào localStorage
      const updatedResults = [result, ...analysisResults];
      setAnalysisResults(updatedResults);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedResults));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử phân tích không? Thao tác này không thể hoàn tác.')) {
      setAnalysisResults([]);
      localStorage.removeItem(HISTORY_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <main className="mt-8 space-y-12">
          {/* Fix: Simplified UI by removing API key input form and logic. */}
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
          
          <ResultsTable results={analysisResults} onClearHistory={handleClearHistory} />

        </main>
      </div>
    </div>
  );
};

export default App;
