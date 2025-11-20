import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { ReviewPoint } from '../types';

interface Props {
  data: ReviewPoint[];
}

const SentimentChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-[400px] bg-white rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
          />
          <YAxis 
            domain={[-1, 1]} 
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            label={{ value: 'Sentiment Score', angle: -90, position: 'insideLeft', fill: '#64748b' }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [value.toFixed(2), 'Sentiment']}
            labelStyle={{ color: '#475569', marginBottom: '0.5rem' }}
          />
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
          <Legend />
          <Line
            type="monotone"
            dataKey="sentimentScore"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 4, fill: '#6366f1' }}
            activeDot={{ r: 6 }}
            name="Sentiment"
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;