export enum SentimentType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL'
}

export interface ReviewPoint {
  id: number;
  date: string;
  sentimentScore: number; // -1 to 1
  excerpt: string;
}

export interface WordNode {
  text: string;
  value: number;
  type: 'praise' | 'complaint' | 'neutral';
}

export interface Insight {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface AnalysisResult {
  overallScore: number;
  reviewCount: number;
  sentimentTrend: ReviewPoint[];
  wordCloudData: WordNode[];
  executiveSummary: string;
  actionableInsights: Insight[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}