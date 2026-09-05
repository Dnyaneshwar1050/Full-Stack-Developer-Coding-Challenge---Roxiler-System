import React from 'react';

export const Loading = ({ text = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
};
