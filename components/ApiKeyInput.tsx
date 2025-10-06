import React, { useState } from 'react';

interface ApiKeyInputProps {
  onSave: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
          Nhập API Key Google AI của bạn
        </label>
        <input
          type="password"
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Dán API Key của bạn vào đây"
          className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
          required
        />
        <p className="mt-2 text-xs text-gray-500">
          Khóa của bạn được lưu trữ an toàn trong bộ nhớ cục bộ của trình duyệt và không bao giờ được gửi đi đâu khác. 
          <a 
            href="https://makersuite.google.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline ml-1"
          >
            Lấy API Key của bạn ở đây.
          </a>
        </p>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Lưu API Key
        </button>
      </div>
    </form>
  );
};

export default ApiKeyInput;
