import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function ProgressChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { day: 'Day 1', mastery: 20 },
    { day: 'Day 2', mastery: 35 },
    { day: 'Day 3', mastery: 50 },
    { day: 'Day 4', mastery: 65 },
    { day: 'Day 5', mastery: 80 },
  ];

  return (
    <div className="w-full h-64 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Mastery Trend Over Time</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorMastery" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} unit="%" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="mastery"
            stroke="#0ea5e9"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorMastery)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

