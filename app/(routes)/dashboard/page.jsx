"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import CardInfo from "./_components/CardInfo";
import { db } from "@/utils/dbconfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";

function Dashboard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Define all functions before using them
  const getBudgetList = async () => {
    setIsLoading(true);
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`COALESCE(SUM(${Expenses.amount}), 0)`.mapWith(Number),
          totalItem: sql`COALESCE(COUNT(${Expenses.id}), 0)`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      setBudgetList(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Error fetching budget list:", error);
      setBudgetList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllExpenses = async () => {
    try {
      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
        })
        .from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(Expenses.id));
      
      setExpensesList(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpensesList([]);
    }
  };

  const refreshBudgetList = () => {
    if (user) {
      getBudgetList();
      getAllExpenses(); // Added to refresh expenses too
    }
  };

  useEffect(() => {
    if (user) {
      getBudgetList();
      getAllExpenses(); // Call both on initial load
    }
  }, [user]);

  const isValidBudgetList = Array.isArray(budgetList);

  return (
    <div className="p-8 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-bold text-3xl dark:text-white">Hi, {user?.fullName} 😀</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Here's what's happening with your money. Let's manage your expenses!
          </p>
        </div>
        <button
          onClick={refreshBudgetList}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Loading budgets...</p>
        </div>
      ) : isValidBudgetList && budgetList.length > 0 ? (
        <CardInfo budgetList={budgetList} />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No budgets found. Create one to get started!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
        <div className="md:col-span-2">
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
            </div>
          ) : isValidBudgetList && budgetList.length > 0 ? (
            <div className="dark:bg-gray-800 rounded-lg p-4">
              <BarChartDashboard budgetList={budgetList} />
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No data available for chart</p>
            </div>
          )}
          
          <h2 className='font-bold text-lg mt-3 dark:text-white'>Latest Expenses</h2>
          <div className="dark:bg-gray-800 rounded-lg">
            <ExpenseListTable
              expensesList={expensesList}
              refreshData={refreshBudgetList} // Updated to refresh both budgets and expenses
            />
          </div>
        </div>
        <div className="grid gap-5">
          <h2 className="font-bold text-lg dark:text-white">Latest Budgets</h2>
          <div className="dark:bg-gray-800 rounded-lg p-4">
            {isValidBudgetList && budgetList.length > 0 ? (
              budgetList.map((budget, index) => (
                <BudgetItem budget={budget} key={index} />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No budgets available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;