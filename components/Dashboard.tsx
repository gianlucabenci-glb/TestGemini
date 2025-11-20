import React from 'react';
import { AnalysisResult } from '../types';
import SentimentChart from './SentimentChart';
import WordBubbleChart from './WordBubbleChart';
import { TrendingUp, MessageCircle, Lightbulb, AlertCircle, CheckCircle2, BarChart3 } from 'lucide-react';

interface Props {
  data: AnalysisResult;
}

const Dashboard: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Score */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${data.overallScore > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Sentiment Score</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold ${data.overallScore > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.overallScore > 0 ? '+' : ''}{data.overallScore.toFixed(2)}
            </span>
            <span className="text-slate-400 text-sm">/ 1.0</span>
          </div>
          <p className="text-slate-500 text-sm mt-2">
            Based on {data.reviewCount} reviews processed
          </p>
        </div>

        {/* Summary Card */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Executive Summary</h3>
          </div>
          <p className="text-slate-700 leading-relaxed text-sm md:text-base">
            {data.executiveSummary}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-800">Sentiment Trend Over Time</h3>
          </div>
          <SentimentChart data={data.sentimentTrend} />
        </div>

        {/* Word Cloud */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-800">Key Themes (Praises vs Complaints)</h3>
          </div>
          <WordBubbleChart data={data.wordCloudData} />
        </div>
      </div>

      {/* Actionable Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
           <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-800 text-lg">Strategic Action Plan</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {data.actionableInsights.map((insight, idx) => (
            <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className={`
                  text-xs font-bold px-2 py-1 rounded-full border
                  ${insight.priority === 'High' ? 'bg-red-50 text-red-600 border-red-200' : 
                    insight.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
                    'bg-green-50 text-green-600 border-green-200'}
                `}>
                  {insight.priority.toUpperCase()} PRIORITY
                </span>
                <span className="text-slate-300 font-mono text-xs">0{idx + 1}</span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2 flex items-start gap-2">
                {insight.title}
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;