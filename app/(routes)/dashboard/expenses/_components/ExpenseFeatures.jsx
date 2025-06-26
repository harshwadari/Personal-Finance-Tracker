import React, { useState, useEffect } from 'react';
import { toast } from 'sonner'; // Import toast from sonner

function ExpenseFeatures() {
    // Mock budget data (in a real app, this would come from your state management or API)
    const [budgets, setBudgets] = useState({
        monthly: {
            housing: 1200,
            transportation: 300,
            food: 500,
            utilities: 200,
            entertainment: 150
        },
        yearly: {
            insurance: 2400,
            vacation: 3000,
            education: 5000,
            medical: 1200,
            taxes: 8000
        }
    });

    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        category: '',
        frequency: 'monthly',
        startDate: '',
        autoDetect: false
    });

    const [availableBudgets, setAvailableBudgets] = useState({});
    const [detectedBudget, setDetectedBudget] = useState(null);

    // Update available budgets when frequency changes
    useEffect(() => {
        setAvailableBudgets(budgets[formData.frequency] || {});
    }, [formData.frequency, budgets]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        
        // Clear detected budget when user changes relevant fields
        if (['amount', 'category', 'frequency'].includes(name)) {
            setDetectedBudget(null);
        }
    };

    const detectBudget = () => {
        const amount = parseFloat(formData.amount);
        if (!amount) {
            toast.error('Please enter an amount first');
            return;
        }

        // Check if category directly matches a budget category
        if (formData.category && availableBudgets[formData.category.toLowerCase()]) {
            setDetectedBudget({
                category: formData.category.toLowerCase(),
                amount: availableBudgets[formData.category.toLowerCase()]
            });
            toast.info(`Matched with ${formData.category.toLowerCase()} budget`);
            return;
        }

        // Otherwise find the most suitable budget based on amount
        const budgetType = formData.frequency === 'monthly' ? 'monthly' : 'yearly';
        const currentBudgets = budgets[budgetType];
        
        // Find closest matching budget
        let bestMatch = null;
        let smallestDifference = Infinity;
        
        Object.entries(currentBudgets).forEach(([category, budgetAmount]) => {
            const difference = Math.abs(budgetAmount - amount);
            if (difference < smallestDifference) {
                smallestDifference = difference;
                bestMatch = { category, amount: budgetAmount };
            }
        });
        
        if (bestMatch) {
            setDetectedBudget(bestMatch);
            toast.info(`Detected ${bestMatch.category} budget`);
        } else {
            toast.error('No matching budget found');
        }
    };

    // Function to fetch budget data
    const fetchBudgetData = async () => {
        // In a real app, you would make an API call here
        // For now, we'll just use the mock data
        return budgets;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.name || !formData.amount || !formData.category || !formData.startDate) {
            toast.error('Please fill in all required fields');
            return;
        }
        
        // If auto-detect is enabled, perform detection before saving
        if (formData.autoDetect && !detectedBudget) {
            detectBudget();
        }
        
        const amount = parseFloat(formData.amount);
        const categoryToUse = detectedBudget ? detectedBudget.category : formData.category.toLowerCase();
        const frequency = formData.frequency;
        
        // Fetch latest budget data
        try {
            const latestBudgets = await fetchBudgetData();
            
            toast.success('Recurring expense created successfully');
            
            // Log the final data
            const finalData = {
                ...formData,
                detectedBudget: detectedBudget,
                amount: amount
            };
            
            console.log('Recurring Expense:', finalData);
            
            // Reset form
            setFormData({
                name: '',
                amount: '',
                category: '',
                frequency: 'monthly',
                startDate: '',
                autoDetect: false
            });
            setDetectedBudget(null);
        } catch (error) {
            toast.error('Failed to fetch budget data');
            console.error(error);
        }
    };

    // Apply detected budget to form
    const applyDetectedBudget = () => {
        if (!detectedBudget) return;
        
        setFormData({
            ...formData,
            category: detectedBudget.category
        });
        
        toast.info(`Applied ${detectedBudget.category} as category`);
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Set Up Recurring Expense</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300">Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300">Amount</label>
                    <input name="amount" type="number" value={formData.amount} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300">Category</label>
                    <input name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300">Frequency</label>
                    <select name="frequency" value={formData.frequency} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300">Start Date / Next Due Date</label>
                    <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="flex items-center text-gray-700 dark:text-gray-300">
                        <input name="autoDetect" type="checkbox" checked={formData.autoDetect} onChange={handleChange} className="mr-2 dark:bg-gray-700" />
                        Auto Detect Budget
                    </label>
                </div>
                
                {formData.autoDetect && (
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                        <button 
                            type="button" 
                            onClick={detectBudget}
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm dark:bg-green-600 mr-2"
                        >
                            Detect Budget
                        </button>
                        
                        {detectedBudget && (
                            <div className="mt-2">
                                <p className="text-sm dark:text-gray-300">
                                    Detected Budget: <span className="font-bold capitalize">{detectedBudget.category}</span> (${detectedBudget.amount})
                                </p>
                                <button 
                                    type="button" 
                                    onClick={applyDetectedBudget}
                                    className="mt-1 px-2 py-1 bg-blue-400 text-white rounded text-xs dark:bg-blue-500"
                                >
                                    Apply
                                </button>
                            </div>
                        )}
                    </div>
                )}
                
                <div className="flex space-x-3">
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded dark:bg-blue-600">Save</button>
                </div>
            </form>
        </div>
    );
}

export default ExpenseFeatures;