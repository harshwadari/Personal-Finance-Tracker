import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbconfig';
import { Budgets, Expenses } from '@/utils/schema';
import moment from 'moment/moment';
import React, { useState } from 'react';
import { toast } from 'sonner';

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addNewExpense = async () => {
    if (!name.trim() || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await db
        .insert(Expenses)
        .values({
          name: name.trim(),
          amount: numericAmount,
          budgetId: budgetId,
          createdAt: moment().format('DD/MM/YYYY')
        })
        .returning({ insertedId: Expenses.id });

      if (result && result.length > 0) {
        setAmount('');
        setName('');
        refreshData();
        toast.success('New Expense Added');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='border p-5 rounded-lg'>
      <h2 className='font-bold text-lg'>Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Shopping"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          type="number"
          placeholder="e.g. 5000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isSubmitting}
          min="0"
          step="0.01"
        />
      </div>
      <Button
        disabled={isSubmitting || !(name && amount)}
        onClick={addNewExpense}
        className='mt-3 w-full'
      >
        {isSubmitting ? 'Adding...' : 'Add New Expense'}
      </Button>
    </div>
  );
}

export default AddExpense;