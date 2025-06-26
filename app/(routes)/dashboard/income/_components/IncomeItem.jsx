"use client";

import React, { useState, useEffect } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import { db } from "@/utils/dbconfig";
import { Incomes } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";

function IncomeItem() {
  const [incomes, setIncomes] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  // This ensures the component only renders on the client side
  useEffect(() => {
    setIsClient(true);
    if (user) {
      fetchIncomes();
    }
  }, [user]);

  const fetchIncomes = async () => {
    setIsLoading(true);
    try {
      const result = await db
        .select()
        .from(Incomes)
        .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress));

      setIncomes(result);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      setIsLoading(false);
    }
  };

  // If we're not on the client yet, show a loading indicator
  if (!isClient) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">Income Distribution</h3>
        <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
      </div>
    );
  }

  // If data is still loading, show loading indicator
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">Income Distribution</h3>
        <p className="text-gray-500 dark:text-gray-400">Loading income data...</p>
      </div>
    );
  }

  // If no incomes are available after loading
  if (!incomes || incomes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">Income Distribution</h3>
        <p className="text-gray-500 dark:text-gray-400">No income data available to display</p>
        <button 
          onClick={fetchIncomes}
          className="mt-3 text-blue-600 dark:text-blue-400 text-sm hover:text-blue-800 dark:hover:text-blue-300"
        >
          Refresh data
        </button>
      </div>
    );
  }

  // Prepare data for the pie chart
  const pieData = incomes.map(income => ({
    name: income.name,
    value: parseFloat(income.amount || 0),
  }));

  // Generate array of colors for pie chart sections
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  // Custom tooltip formatter with dark mode support
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded shadow-sm text-gray-800 dark:text-white">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">₹{payload[0].value.toFixed(2)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-300">
            {((payload[0].value / pieData.reduce((sum, entry) => sum + entry.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <h3 className="text-lg font-medium mb-4 text-center text-gray-800 dark:text-gray-100">Income Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Total Income: ₹{pieData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
        </p>
        <button 
          onClick={fetchIncomes}
          className="text-blue-600 dark:text-blue-400 text-sm hover:text-blue-800 dark:hover:text-blue-300"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export default IncomeItem;