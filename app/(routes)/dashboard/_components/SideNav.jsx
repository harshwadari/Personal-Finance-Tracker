"use client"; // ✅ Ensures hooks like `usePathname` work

import React from "react";
import Image from "next/image";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, IndianRupee } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

function SideNav() {
  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { id: 2, name: "Budgets", icon: PiggyBank, path: "/dashboard/budgets" },
    { id: 3, name: "Expenses", icon: ReceiptText, path: "/dashboard/expenses" },
    { id: 4, name: "Upgrade", icon: ShieldCheck, path: "/dashboard/upgrade" },
    { id: 5, name: "Income", icon: IndianRupee, path: "/dashboard/income" }, // ✅ Updated with Rupee Symbol
  ];

  const path = usePathname();

  return (
    <div className="h-screen p-5 border shadow-sm w-64 bg-white dark:bg-gray-900 dark:border-gray-800">
      {/* ✅ Logo */}
      <Image src="/logo.svg" alt="logo" width={160} height={100} />

      {/* ✅ Menu List */}
      <div className="mt-5">
        {menuList.map((menu) => (
          <Link key={menu.id} href={menu.path} className="block">
            <div
              className={`flex gap-2 items-center text-gray-700 dark:text-gray-200 font-medium p-4 cursor-pointer rounded-md hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30
              ${path === menu.path 
                ? "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30" 
                : ""}`}
            >
              <menu.icon className="w-5 h-5" />
              {menu.name}
            </div>
          </Link>
        ))}
      </div>

      {/* ✅ Profile */}
      <div className="fixed bottom-10 p-5 flex gap-2 items-center">
        <UserButton />
        <span className="font-medium dark:text-white">Profile</span>
      </div>
    </div>
  );
}

export default SideNav;