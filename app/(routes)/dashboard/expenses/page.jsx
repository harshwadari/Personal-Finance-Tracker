"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbconfig';
import { Budgets, Expenses } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import ExpenseListTable from './_components/ExpenseListTable';
import ExpenseFeatures from './_components/ExpenseFeatures';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Page() {
  const { user } = useUser();
  const [expensesList, setExpensesList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRecurringForm, setShowRecurringForm] = useState(false);

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#8884D8', '#82CA9D', '#FF6384', '#36A2EB',
    '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
  ];

  const getAllExpenses = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const result = await db.select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
        budgetName: Budgets.name
      }).from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
        .orderBy(desc(Expenses.id));

      setExpensesList(result);
      const categoryExpenses = calculateCategoryExpenses(result);
      setCategoryData(categoryExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpensesList([]);
      setCategoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCategoryExpenses = (expenses) => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      const categoryName = expense.budgetName || 'Uncategorized';
      if (!acc[categoryName]) acc[categoryName] = 0;
      acc[categoryName] += parseFloat(expense.amount) || 0;
      return acc;
    }, {});

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
      .filter(category => category.value > 0)
      .sort((a, b) => b.value - a.value);
  };

  const refreshBudgetList = () => getAllExpenses();

  useEffect(() => { if (user) getAllExpenses(); }, [user]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = categoryData.reduce((sum, entry) => sum + entry.value, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(2);
      return (
        <div className='bg-white dark:bg-gray-800 p-4 border dark:border-gray-700 rounded shadow-lg'>
          <p className='font-bold dark:text-white'>{payload[0].name}</p>
          <p className='dark:text-gray-200'>Amount: ₹{payload[0].value.toFixed(2)}</p>
          <p className='dark:text-gray-200'>Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='p-10 dark:bg-gray-900'>
      <h2 className='font-bold text-3xl mb-6 dark:text-white'>My Expenses</h2>

      <button onClick={() => setShowRecurringForm(!showRecurringForm)} className='mb-4 px-4 py-2 bg-blue-500 text-white rounded dark:bg-blue-600'>
        {showRecurringForm ? 'Hide Recurring Expense Form' : 'Add Recurring Expense'}
      </button>

      {showRecurringForm && <ExpenseFeatures />}

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2'>
          <h2 className='font-bold text-lg mb-3 dark:text-white'>Latest Expenses</h2>
          <ExpenseListTable expensesList={expensesList} refreshData={refreshBudgetList} isLoading={isLoading} />
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
          <h3 className='font-bold text-lg mb-4 dark:text-white'>Expenses by Category</h3>
          <div className='w-full h-[350px]'>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie data={categoryData} cx='50%' cy='50%' outerRadius='80%' innerRadius='50%' fill='#8884d8' dataKey='value'>
                    {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend layout='horizontal' verticalAlign='bottom' align='center' wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} formatter={(value) => <span className='dark:text-gray-200'>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className='text-center text-gray-500 dark:text-gray-400 h-[350px] flex items-center justify-center'>
                No expense categories to display
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
