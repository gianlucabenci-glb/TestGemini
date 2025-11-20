import React from 'react';
import { Loader2, BrainCircuit } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="w-full py-24 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-indigo-600 p-4 rounded-full shadow-xl">
          <BrainCircuit className="w-12 h-12 text-white animate-pulse" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">Deep Thinking in Progress</h3>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        Gemini 3 Pro is analyzing your data with high-compute reasoning. This allows it to detect subtle sentiment nuances and complex patterns.
      </p>
      <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium bg-indigo-50 px-4 py-2 rounded-full">
        <Loader2 className="w-4 h-4 animate-spin" />
        Processing thousands of tokens...
      </div>
    </div>
  );
};

export default LoadingScreen;