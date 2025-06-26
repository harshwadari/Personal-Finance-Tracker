import React from "react";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle"; // Import the ThemeToggle component

function DashboardHeader() {
  return (
    <div className="p-5 shadow-sm border-b flex justify-between items-center bg-white dark:bg-black dark:border-gray-800">
      <div className="text-lg font-semibold"></div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserButton />
      </div>
    </div>
  );
}

export default DashboardHeader;