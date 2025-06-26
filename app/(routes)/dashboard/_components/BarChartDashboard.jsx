import React from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function BarChartDashboard({ budgetList }) { // Destructure props correctly
  // Ensure budgetList is an array and provide fallback
  const chartData = Array.isArray(budgetList) ? budgetList : [];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Budget Overview</h3>
      <ResponsiveContainer width={'80%'} height={300}>
      <BarChart
        
        data={chartData}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" stroke="#888888" className="dark:text-gray-400" />
        <YAxis stroke="#888888" className="dark:text-gray-400" />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'var(--tooltip-bg, white)',
            color: 'var(--tooltip-color, black)',
            borderColor: 'var(--tooltip-border, #cccccc)'
          }}
          itemStyle={{
            color: 'var(--tooltip-item-color, black)'
          }}
          wrapperStyle={{
            outline: 'none'
          }}
        />
        <Legend />
        <Bar dataKey="totalSpend" stackId="a" fill="#4845d2" name="Total Spent" />
        <Bar dataKey="amount" stackId="a" fill="#C3C2FF" name="Budget Amount" />
      </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Add this to your global styles or component:
// :root {
//   --tooltip-bg: white;
//   --tooltip-color: black;
//   --tooltip-border: #cccccc;
//   --tooltip-item-color: black;
// }
// 
// .dark {
//   --tooltip-bg: #1f2937;
//   --tooltip-color: white;
//   --tooltip-border: #374151;
//   --tooltip-item-color: white;
// }

export default BarChartDashboard;