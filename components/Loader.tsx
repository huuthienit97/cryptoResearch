
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-10">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400">AI đang phân tích... Quá trình này có thể mất một chút thời gian.</p>
    </div>
  );
};

export default Loader;
