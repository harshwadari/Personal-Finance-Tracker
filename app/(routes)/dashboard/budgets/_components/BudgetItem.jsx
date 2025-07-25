import Link from 'next/link'
import React from 'react'

function BudgetItem({budget}) {
  const calculateProgressPerc=()=>{
  //(spend/total)*100
    const perc=(budget.totalSpend/budget.amount)*100;
    return perc.toFixed(2);
  }
  return (

    <Link href={'/dashboard/expenses/'+budget?.id} >
      <div className='p-5 border rounded-lg
    hover:shadow-md cursor-pointer h-[170px] dark:border-gray-700 dark:hover:shadow-lg dark:hover:shadow-gray-800'>
        <div className='flex gap-2 items-center justify-between'>

        
    <div className='flex gap-2 items-center'>
        <h2 className='text-2xl p-3 px-4 bg-slate-100 dark:bg-slate-800 rounded-full'>
            {budget?.icon}
        </h2>
        <div>
            <h2 className='dark:text-white'>{budget.name}</h2>
            <h2 className='dark:text-gray-300'>{budget.totalItem}Item</h2>
        </div>
        
    </div>
    <h2 className='font-bold text-primary dark:text-primary text-lg'>
           ₹ {budget.amount}
        </h2>
        </div>
        <div className='mt-5'>
          <div className='flex items-center justify-between'>
            <h2 className='text-sm dark:text-gray-300'>
              ₹{budget.totalSpend?budget.totalSpend:0} Spend
            </h2>
            <h2 className='text-sm dark:text-gray-300'>
              ₹{budget.amount-budget.totalSpend} Remaining
            </h2>
          </div>
            <div className='w-full bg-slate-300 dark:bg-slate-700 h-2 rounded-full'>

            
            <div className='
            bg-primary h-2 rounded-full'
            style={{
              width:`${calculateProgressPerc()}%`
            }}
            >
                 
            </div>
            </div>
        </div>
        </div>
    </Link>

  )
}

export default BudgetItem