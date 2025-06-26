import getFinanceAdvice from '@/utils/getFinanceAdvice';
import { PiggyBank, ReceiptTextIcon, Wallet, Lightbulb } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function CardInfo(props) {
    const { budgetList, incomeList, incomes } = props;

    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);
    const [financialAdvice, setFinancialAdvice] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAdviceLoading, setIsAdviceLoading] = useState(false);

    useEffect(() => {
        calculateCardInfo();
    }, [props, budgetList, incomeList, incomes]);

    useEffect(() => {
        if (!isLoading && (totalBudget > 0 || totalSpend > 0)) {
            const fetchFinancialAdvice = async () => {
                setIsAdviceLoading(true);
                try {
                    // Updated to only pass totalBudget and totalSpend
                    const advice = await getFinanceAdvice(totalBudget, totalSpend);
                    setFinancialAdvice(advice);
                } catch (error) {
                    console.error("Error fetching financial advice:", error);
                    setFinancialAdvice("Unable to generate financial advice at this time.");
                } finally {
                    setIsAdviceLoading(false);
                }
            };
            fetchFinancialAdvice();
        }
    }, [totalBudget, totalSpend, isLoading]);

    const extractAmount = (item) => {
        if (!item) return 0;
        return parseFloat(item.amount || item.value || item.income?.amount || item.income || (typeof item === 'number' ? item : 0)) || 0;
    };

    const calculateTotalFromArray = (array) => {
        if (!Array.isArray(array)) return 0;
        return array.reduce((total, item) => total + extractAmount(item), 0);
    };

    const calculateCardInfo = () => {
        setIsLoading(true);
        let totalBudget_ = 0;
        let totalSpend_ = 0;

        if (Array.isArray(budgetList) && budgetList.length > 0) {
            budgetList.forEach(element => {
                totalBudget_ += parseFloat(element.amount) || 0;
                totalSpend_ += parseFloat(element.totalSpend) || 0;
            });
        }

        setTotalBudget(totalBudget_);
        setTotalSpend(totalSpend_);
        setIsLoading(false);
    };

    // Removed Total Income card and kept only 3 cards
    const cards = [
        { label: "Total Budget", value: `₹${totalBudget.toLocaleString('en-IN')}`, icon: <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white dark:text-blue-500' /> },
        { label: "Total Spend", value: `₹${totalSpend.toLocaleString('en-IN')}`, icon: <ReceiptTextIcon className='bg-primary p-3 h-12 w-12 rounded-full text-white dark:text-blue-500' /> },
        { label: "No. of Budgets", value: budgetList?.length || 0, icon: <Wallet className='bg-primary p-3 h-12 w-12 rounded-full text-white' /> }
    ];

    return (
        <div>
            {/* Changed grid-cols-4 to grid-cols-3 to make cards fill the row */}
            <div className='mt-7 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5'>
                {isLoading ? (
                    cards.map((_, index) => (
                        <div key={index} className='p-7 border rounded-lg flex items-center justify-between bg-slate-200 dark:bg-slate-800 animate-pulse'>
                            <div>
                                <div className='text-sm bg-gray-300 dark:bg-gray-600 h-4 w-24 rounded animate-pulse' />
                                <div className='font-bold text-2xl bg-gray-300 dark:bg-gray-600 h-6 w-16 rounded mt-2 animate-pulse' />
                            </div>
                            <div className='bg-gray-300 dark:bg-blue-500 p-3 h-12 w-12 rounded-full animate-pulse' />
                        </div>
                    ))
                ) : (
                    cards.map((card, index) => (
                        <div key={index} className='p-7 border dark:border-gray-700 rounded-lg flex items-center justify-between bg-white dark:bg-gray-800'>
                            <div>
                                <h2 className='text-sm dark:text-gray-300'>{card.label}</h2>
                                <h2 className='font-bold text-2xl dark:text-white'>{card.value}</h2>
                            </div>
                            {card.icon}
                        </div>
                    ))
                )}
            </div>

            <div className='mt-7 p-6 border rounded-lg bg-blue-50 dark:bg-blue-900/20'>
                <div className='flex items-center mb-4'>
                    <Lightbulb className='text-primary dark:text-blue-500 h-6 w-6 mr-2' />
                    <h2 className='text-lg font-semibold dark:text-white'>Financial Insights</h2>
                </div>
                {isAdviceLoading ? (
                    <div className='animate-pulse bg-gray-300 dark:bg-gray-600 h-4 w-full rounded'></div>
                ) : financialAdvice ? (
                    <p className='text-gray-700 dark:text-gray-200'>{financialAdvice}</p>
                ) : (
                    <p className='text-gray-500 dark:text-gray-400 italic'>
                        Add budget or spending data to receive personalized financial advice.
                    </p>
                )}
            </div>
        </div>
    );
}

export default CardInfo;