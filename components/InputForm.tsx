import React, { useState } from 'react';
import { Play, FileText, RotateCcw } from 'lucide-react';

interface Props {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

const DEFAULT_TEXT = `Review 1 (10/01): I absolutely love the new dashboard design! It's so intuitive and the colors are perfect. Great job team.
Review 2 (10/02): The load times are terrible. I waited 5 seconds for the report to generate. Unacceptable for a paid tier.
Review 3 (10/05): Customer support was helpful, but the billing process is confusing. Why are there so many hidden fees?
Review 4 (10/06): Best tool I've used for social media tracking. The automated reports save me hours every week.
Review 5 (10/07): App keeps crashing on mobile. Please fix this asap! I can't work on the go.
Review 6 (10/08): Solid update. I like the new export features. A bit pricey, but worth it for the stability.
Review 7 (10/10): I'm cancelling my subscription. Features promised in the roadmap are delayed by months.
Review 8 (10/12): Fantastic user experience. The onboarding tutorial was very clear.
Review 9 (10/15): Not bad, but lacks integration with Slack. Would be 5 stars if that was added.
Review 10 (10/16): The new AI features are mind-blowing! Deep thinking mode actually works.`;

const InputForm: React.FC<Props> = ({ onAnalyze, isAnalyzing }) => {
  const [text, setText] = useState(DEFAULT_TEXT);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-800">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold">Raw Customer Reviews</h2>
        </div>
        <button
          onClick={() => setText(DEFAULT_TEXT)}
          className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset Sample
        </button>
      </div>
      
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none font-mono text-sm text-slate-600"
          placeholder="Paste your customer reviews here (one per line or paragraph)..."
          disabled={isAnalyzing}
        />
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => onAnalyze(text)}
            disabled={isAnalyzing || !text.trim()}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-white shadow-lg transition-all transform
              ${isAnalyzing || !text.trim() 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95'}
            `}
          >
            <Play className={`w-4 h-4 ${isAnalyzing ? 'hidden' : 'fill-current'}`} />
            {isAnalyzing ? 'Thinking...' : 'Generate Report'}
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        * Uses Gemini 3 Pro with high-budget thinking mode to process unstructured text.
      </p>
    </div>
  );
};

export default InputForm;