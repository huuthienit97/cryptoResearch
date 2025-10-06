
import React, { useState, useEffect } from 'react';
import { ProjectAnalysis, SelectedSheet } from './types';
import { analyzeProject } from './services/geminiService';
import { appendToSheet } from './services/googleSheetsService';
import { GEMINI_API_KEY } from './config';
import Header from './components/Header';
import ProjectInputForm from './components/ProjectInputForm';
import ApiKeyInput from './components/ApiKeyInput';
import ResultsTable from './components/ResultsTable';
import Loader from './components/Loader';
import GoogleSheetConnector from './components/GoogleSheetConnector';

const App: React.FC = () => {
  const [analysisResults, setAnalysisResults] = useState<ProjectAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(null);
  const [isKeyFromConfig, setIsKeyFromConfig] = useState<boolean>(false);
  const [selectedSheet, setSelectedSheet] = useState<SelectedSheet | null>(null);
  const [sheetStatus, setSheetStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


  useEffect(() => {
    // Ưu tiên 1: Kiểm tra key trong localStorage
    const storedApiKey = localStorage.getItem('geminiApiKey');
    if (storedApiKey) {
      setGeminiApiKey(storedApiKey);
      setIsKeyFromConfig(false);
    } 
    // Ưu tiên 2: Kiểm tra key trong file config
    else if (GEMINI_API_KEY) {
      setGeminiApiKey(GEMINI_API_KEY);
      setIsKeyFromConfig(true);
    }
  }, []);

  const handleApiKeySave = (key: string) => {
    localStorage.setItem('geminiApiKey', key);
    setGeminiApiKey(key);
    setIsKeyFromConfig(false);
    setError(null);
  };
  
  const handleChangeApiKey = () => {
    localStorage.removeItem('geminiApiKey');
    // Sau khi xóa, quay lại kiểm tra file config
    if (GEMINI_API_KEY) {
      setGeminiApiKey(GEMINI_API_KEY);
      setIsKeyFromConfig(true);
    } else {
      setGeminiApiKey(null);
      setIsKeyFromConfig(false);
    }
  }
  
  const handleAppendToSheet = async (analysis: ProjectAnalysis, sheetId: string) => {
    setSheetStatus(null);
    try {
      await appendToSheet(sheetId, analysis);
      setSheetStatus({ message: `Đã thêm "${analysis.projectName}" vào Google Sheet thành công!`, type: 'success' });
    } catch (error) {
       console.error("Error appending to sheet:", error);
       const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định.';
       setSheetStatus({ message: `Không thể thêm vào Google Sheet: ${errorMessage}`, type: 'error' });
    }
  };


  const handleAnalyze = async (projectName: string, projectLink: string) => {
    if (!projectName.trim() || !projectLink.trim()) {
      setError('Vui lòng nhập Tên dự án và Liên kết dự án.');
      return;
    }
    if (!geminiApiKey) {
      setError('Vui lòng nhập và lưu API Key của bạn trước khi phân tích.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSheetStatus(null);

    try {
      const result = await analyzeProject(projectName, projectLink, geminiApiKey);
      setAnalysisResults(prevResults => [result, ...prevResults]);

      if (selectedSheet) {
        await handleAppendToSheet(result, selectedSheet.id);
      }

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
            {!geminiApiKey ? (
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
                <hr className="border-gray-700 my-6" />
                <GoogleSheetConnector onSheetSelect={setSelectedSheet} />
              </div>
            )}
          </div>
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
              <span className="font-bold">Lỗi: </span>
              <span>{error}</span>
            </div>
          )}

          {sheetStatus && (
             <div className={`border ${sheetStatus.type === 'success' ? 'bg-green-900/50 border-green-700 text-green-300' : 'bg-red-900/50 border-red-700 text-red-300'} px-4 py-3 rounded-lg text-center`} role="alert">
              <span>{sheetStatus.message}</span>
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