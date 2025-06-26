"use client";

import React from 'react';
import { 
  Rocket, 
  Lock, 
  BarChart2, 
  CreditCard, 
  Shield, 
  Database 
} from 'lucide-react';
import { Button } from '@/components/ui/button';


function page() {
  const upgradeTiers = [
    {
      title: 'Free Plan',
      price: '₹0',
      features: [
        'Basic Expense Tracking',
        'Limited Categories (3)',
        'Monthly Reports',
        'Basic Visualizations'
      ],
      icon: <Database className="w-12 h-12 text-blue-500 dark:text-blue-400" />
    },
    {
      title: 'Pro Plan',
      price: '₹499/month',
      features: [
        'Unlimited Categories',
        'Advanced Analytics',
        'Multi-Device Sync',
        'Detailed Expense Insights',
        'Budget Forecasting'
      ],
      icon: <Rocket className="w-12 h-12 text-purple-500 dark:text-purple-400" />,
      recommended: true
    },
    {
      title: 'Enterprise Plan',
      price: '₹999/month',
      features: [
        'All Pro Features',
        'Team Collaboration',
        'Custom Report Generation',
        'AI-Powered Spending Recommendations',
        'Priority Support'
      ],
      icon: <Shield className="w-12 h-12 text-green-500 dark:text-green-400" />
    }
  ];

  const featureHighlights = [
    {
      icon: <BarChart2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      title: 'Advanced Analytics',
      description: 'Gain deep insights into your spending patterns with machine learning-powered analysis.'
    },
    {
      icon: <Lock className="w-8 h-8 text-green-600 dark:text-green-400" />,
      title: 'Secure & Private',
      description: 'Bank-grade encryption ensures your financial data remains completely confidential.'
    },
    {
      icon: <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
      title: 'Smart Budgeting',
      description: 'Intelligent budget recommendations based on your unique spending habits.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 dark:bg-gray-900">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Upgrade Your Expense Tracking Experience</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Unlock powerful features to transform how you manage your finances
        </p>
      </div>

      {/* Pricing Tiers */}
      

      {/* Feature Highlights */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16 rounded-lg">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 dark:text-white">Why Upgrade?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featureHighlights.map((feature) => (
              <div 
                key={feature.title}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-all"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold mb-6 dark:text-white">Ready to Take Control of Your Finances?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Start your journey to smarter financial management today
        </p>
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
          Upgrade Now
        </Button>
      </div>
    </div>
  );
};

export default page;