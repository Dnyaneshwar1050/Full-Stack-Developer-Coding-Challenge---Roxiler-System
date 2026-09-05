import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    },
  }[color] || {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-100',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value ?? 0}</p>
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-lg ${colorStyles.bg} ${colorStyles.text} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};
