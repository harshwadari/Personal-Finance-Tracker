"use client";
import React, { useState, useEffect } from "react"; // ✅ Import useState & useEffect
import CreateBudget from "./CreateBudget";
import { db } from "@/utils/dbconfig";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "./BudgetItem";

// ✅ Define a Skeleton loader component with dark mode support
const SkeletonLoader = () => {
  return (
    <div className="w-full h-[150px] border border-slate-200 dark:border-slate-700 rounded-lg animate-pulse bg-gray-300 dark:bg-gray-700">
      <div className="h-full flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
};

function BudgetList() {
  const [budgetList, setBudgetList] = useState([]); // ✅ Correctly define state
  const [isLoading, setIsLoading] = useState(true); // ✅ Add loading state
  const { user } = useUser();

  useEffect(() => {
    if (user) getBudgetList();
  }, [user]);

  const getBudgetList = async () => {
    setIsLoading(true); // Start loading when fetching data
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)) // ✅ Correct syntax
      .groupBy(Budgets.id);

    setBudgetList(result);
    setIsLoading(false); // Stop loading once data is fetched
  };

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateBudget refreshData={() => getBudgetList()} />

        {/* If loading, show skeleton loaders */}
        {isLoading
          ? Array(6).fill(0).map((_, index) => (
              <SkeletonLoader key={index} />
            ))
          : budgetList?.length > 0
          ? budgetList.map((budget, index) => (
              <BudgetItem key={index} budget={budget} />
            ))
          : null}
      </div>
    </div>
  );
}

export default BudgetList;