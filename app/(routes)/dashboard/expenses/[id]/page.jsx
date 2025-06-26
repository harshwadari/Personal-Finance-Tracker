"use client"
import { db } from '@/utils/dbconfig'
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { Pen, PenBox, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from '../_components/EditBudget';
import ExpenseFeatures from '../_components/ExpenseFeatures';



function ExpensesScreen({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expensesList,setExpensesList]=useState([]);
  const route=useRouter();
  
  const getBudgetInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(Budgets.id, unwrappedParams.id)) // Using unwrapped params here
      .groupBy(Budgets.id);
    
    setBudgetInfo(result[0]);
    getExpensesList();
  }

  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user]);

  const getExpensesList=async()=>{

  const result=await db.select().from(Expenses)
  .where(eq(Expenses.budgetId,unwrappedParams.id))
  .orderBy(desc(Expenses.id));
 setExpensesList(result);
  console.log(result)
  }
  
  const deleteBudget=async()=>{
    const deleteExpensesResult=await
    db.delete(Expenses)
    .where(eq(Expenses.budgetId,unwrappedParams.id))
    .returning()
    if(deleteExpensesResult){
      const result=await db.delete(Budgets)
      .where(eq(Budgets.id,unwrappedParams.id))
      .returning();
  
    }
   toast('Budget Deleted')
    route.replace('/dashboard/budgets');
  }
  return (
    <div className='p-10'>
      <h2 className='text-2xl font-bold flex justify-between items-center'>
        My Expenses
        <div  className='flex gap-2 items-center'>
       <EditBudget  budgetInfo={budgetInfo}
       refreshData={()=>getBudgetInfo()}/>
          
          <AlertDialog>
  <AlertDialogTrigger asChild> 
           
  <Button className='flex gap-2' variant="destructive">
            <Trash/>
            Delete
          </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your current budget along with your expenses
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>deleteBudget()}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
      </div>
        
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
        {budgetInfo ? 
          <BudgetItem budget={budgetInfo} /> :
          <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'>
          </div>
        }
        <AddExpense 
          budgetId={unwrappedParams.id}
          user={user}
          refreshData={()=>getBudgetInfo()}
        />
      </div>
      <div className='mt-4'>
        <h2 className='font-bold text-lg'>
          Latest Expenses
        </h2 >
        <ExpenseListTable expensesList={expensesList}
        refreshData={()=>getBudgetInfo()}/>
        <div>
          
        </div>
      </div>
    </div>
  )
}

export default ExpensesScreen