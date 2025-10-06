
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Phân Tích Dự Án Crypto
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Đánh giá tiềm năng đầu tư với sự trợ giúp của AI.
      </p>
    </header>
  );
};

export default Header;
