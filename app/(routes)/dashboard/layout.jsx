"use client"; // ✅ Ensures this is a Client Component

import React, { useEffect } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import { db } from "@/utils/dbconfig";
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      checkUserBudgets();
    }
  }, [user]); // ✅ Correct dependency array

  const checkUserBudgets = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      const result = await db
        .select()
        .from(Budgets)
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress));

      console.log("Budget Check:", result);

      if (result?.length === 0) {
        router.replace("/dashboard/budgets");
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  return (
    <div className="flex">
      {/* ✅ Sidebar */}
      <aside className="w-64 fixed hidden md:block">
        <SideNav />
      </aside>

      {/* ✅ Main content area */}
      <div className="flex-1 md:ml-64">
        <DashboardHeader />
        <main className="p-5">{children}</main>
      </div>
    </div>
  );
}
