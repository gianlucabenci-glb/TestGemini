import React, { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import InputForm from './components/InputForm';
import Dashboard from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';
import ChatBot from './components/ChatBot';
import { analyzeReviews } from './services/gemini';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisData(null); // Clear previous results to focus user on loading
    try {
      const result = await analyzeReviews(text);
      setAnalysisData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze reviews. Please check your API key and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Sentimind <span className="font-normal text-slate-400 hidden sm:inline">| Customer Insights AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
              Gemini 3 Pro
             </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InputForm onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8 flex items-center gap-2">
             <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {isAnalyzing && <LoadingScreen />}

        {!isAnalyzing && analysisData && (
          <Dashboard data={analysisData} />
        )}

        {!isAnalyzing && !analysisData && !error && (
           <div className="text-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
              <p>Enter reviews above and click "Generate Report" to start analyzing.</p>
           </div>
        )}
      </main>

      <ChatBot analysisContext={analysisData} />
    </div>
  );
};

export default App;