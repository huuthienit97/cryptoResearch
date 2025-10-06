
import React, { useState, useEffect } from 'react';
import { ProjectAnalysis } from './types';
import { analyzeProject } from './services/geminiService';
import { DEVELOPER_API_KEY } from './config';
import Header from './components/Header';
import ProjectInputForm from './components/ProjectInputForm';
import ApiKeyInput from './components/ApiKeyInput';
import ResultsTable from './components/ResultsTable';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<ProjectAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isKeyFromConfig, setIsKeyFromConfig] = useState<boolean>(false);

  useEffect(() => {
    // Ưu tiên 1: Kiểm tra key trong localStorage
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsKeyFromConfig(false);
    } 
    // Ưu tiên 2: Kiểm tra key trong file config
    else if (DEVELOPER_API_KEY) {
      setApiKey(DEVELOPER_API_KEY);
      setIsKeyFromConfig(true);
    }
  }, []);

  const handleApiKeySave = (key: string) => {
    localStorage.setItem('geminiApiKey', key);
    setApiKey(key);
    setIsKeyFromConfig(false);
    setError(null);
  };
  
  const handleChangeApiKey = () => {
    localStorage.removeItem('geminiApiKey');
    // Sau khi xóa, quay lại kiểm tra file config
    if (DEVELOPER_API_KEY) {
      setApiKey(DEVELOPER_API_KEY);
      setIsKeyFromConfig(true);
    } else {
      setApiKey(null);
      setIsKeyFromConfig(false);
    }
  }

  const handleAnalyze = async (projectName: string, projectLink: string) => {
    if (!projectName.trim() || !projectLink.trim()) {
      setError('Vui lòng nhập Tên dự án và Liên kết dự án.');
      return;
    }
    if (!apiKey) {
      setError('Vui lòng nhập và lưu API Key của bạn trước khi phân tích.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeProject(projectName, projectLink, apiKey);
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
            {!apiKey ? (
              <ApiKeyInput onSave={handleApiKeySave} />
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4 -mt-2">
                   {isKeyFromConfig && (
                    <p className="text-xs text-gray-400">Đang sử dụng API Key từ file cấu hình.</p>
                  )}
                  <div className="flex-grow"></div> {/* Đẩy nút sang phải */}
                  <button onClick={handleChangeApiKey} className="text-sm text-blue-400 hover:text-blue-300 ml-auto">
                    {isKeyFromConfig ? 'Nhập API Key Khác' : 'Thay đổi API Key'}
                  </button>
                </div>
                <ProjectInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
              </div>
            )}
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
