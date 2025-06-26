"use client";

import React, { useState, useEffect } from "react";
import { IndianRupee, Calendar, Clock, Trash2 } from "lucide-react";
import { db } from "@/utils/dbconfig";
import { Incomes } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

function IncomeCards() {
  const [incomes, setIncomes] = useState([]);
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [name, setName] = useState("");

  const [totalIncome, setTotalIncome] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [weeklyIncome, setWeeklyIncome] = useState(0);
  const [dailyIncome, setDailyIncome] = useState(0);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchIncomes();
    }
  }, [user]);

  const fetchIncomes = async () => {
    try {
      const result = await db
        .select()
        .from(Incomes)
        .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress));

      setIncomes(result);
      calculateTotals(result);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      toast.error("Could not load incomes.");
    }
  };

  const calculateTotals = (incomesList) => {
    let daily = 0,
      weekly = 0,
      monthly = 0;

    incomesList.forEach((income) => {
      const amt = parseFloat(income.amount || "0");
      if (income.frequency === "daily") daily += amt;
      if (income.frequency === "weekly") weekly += amt;
      if (income.frequency === "monthly") monthly += amt;
    });

    setDailyIncome(daily);
    setWeeklyIncome(weekly);
    setMonthlyIncome(monthly);
    setTotalIncome(daily + weekly + monthly);
  };

  const handleAddIncome = async () => {
    if (!name || !amount) {
      toast.warning("Please fill in all fields.");
      return;
    }

    try {
      await db.insert(Incomes).values({
        name,
        amount,
        frequency,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date().toISOString(),
      });

      toast.success("Income added!");
      setName("");
      setAmount("");
      setFrequency("monthly");
      fetchIncomes();
    } catch (error) {
      console.error("Error adding income:", error);
      toast.error("Failed to add income.");
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await db.delete(Incomes).where(eq(Incomes.id, id));
      toast.success("Income deleted.");
      fetchIncomes();
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income.");
    }
  };

  return (
    <div className="p-4 space-y-6 dark:bg-gray-900">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Daily Income" amount={dailyIncome} icon={<Clock />} />
        <Card label="Weekly Income" amount={weeklyIncome} icon={<Calendar />} />
        <Card label="Monthly Income" amount={monthlyIncome} icon={<Calendar />} />
        <Card label="Total Income" amount={totalIncome} icon={<IndianRupee />} />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Income Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border dark:border-gray-700 p-2 rounded w-full md:w-auto dark:bg-gray-700 dark:text-white"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border dark:border-gray-700 p-2 rounded w-full md:w-auto dark:bg-gray-700 dark:text-white"
        />
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="border dark:border-gray-700 p-2 rounded w-full md:w-auto dark:bg-gray-700 dark:text-white"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button
          onClick={handleAddIncome}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Add Income
        </button>
      </div>

      {/* Table View of Incomes */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left dark:text-gray-200">Name</th>
              <th className="p-3 text-left dark:text-gray-200">Amount</th>
              <th className="p-3 text-left dark:text-gray-200">Frequency</th>
              <th className="p-3 text-center dark:text-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income.id} className="border-t dark:border-gray-700">
                <td className="p-3 dark:text-gray-200">{income.name}</td>
                <td className="p-3 dark:text-gray-200">₹{income.amount}</td>
                <td className="p-3 capitalize dark:text-gray-200">{income.frequency}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDeleteIncome(income.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {incomes.length === 0 && (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500 dark:text-gray-400">
                  No income records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ label, amount, icon }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center space-x-4">
      <div className="text-blue-600 dark:text-blue-400">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-semibold dark:text-white">₹{amount.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default IncomeCards;