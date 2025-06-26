import {db} from '@/utils/dbconfig'
import { Expenses } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

function ExpenseListTable({expensesList, refreshData}) {
    const deleteExpense=async(expense)=>{
   const result=await db.delete(Expenses)
   .where(eq(Expenses.id,expense.id))
    .returning();
    if(result){
        toast('Expense Deleted');
        refreshData()
    }

    }
  return (
    <div className='mt-3'>
      <div className='grid grid-cols-4 bg-slate-200 dark:bg-gray-700 p-2 rounded-t-lg'>
        <h2 className='font-bold dark:text-white'>Name</h2>
        <h2 className='font-bold dark:text-white'>Amount</h2>
        <h2 className='font-bold dark:text-white'>Date</h2>
        <h2 className='font-bold dark:text-white'>Action</h2>
      </div>
      {expensesList.map((expenses,index)=>(
        <div 
          key={expenses.id}
          className={`grid grid-cols-4 bg-slate-200 dark:bg-gray-800 p-2 ${
            index === expensesList.length - 1 ? 'rounded-b-lg' : 'border-b border-slate-300 dark:border-gray-700'
          }`}
        >
          <h2 className='dark:text-gray-200'>{expenses.name}</h2>
          <h2 className='dark:text-gray-200'>{expenses.amount}</h2>
          <h2 className='dark:text-gray-200'>{expenses.createdAt}</h2>
          <h2>
              <Trash className='text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 cursor-pointer'
              onClick={()=> deleteExpense(expenses)} />
          </h2>
        </div>
      ))}
    </div>
  )
}

export default ExpenseListTable