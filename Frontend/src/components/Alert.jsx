import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export const Alert = ({ type = 'error', message, onClose = null }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`flex items-start justify-between p-3.5 rounded-lg border text-sm mb-4 ${
        isSuccess
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
    >
      <div className="flex items-center space-x-2">
        {isSuccess ? (
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
        )}
        <span className="font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className={`ml-3 shrink-0 p-1 rounded hover:bg-black/5 transition-colors ${
            isSuccess ? 'text-emerald-700' : 'text-red-700'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
