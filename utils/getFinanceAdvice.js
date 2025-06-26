const getFinanceAdvice = async (totalBudget, totalSpend) => {
  try {
    const budgetUtilization = totalBudget > 0 ? ((totalSpend / totalBudget) * 100).toFixed(1) : 0;
    const remaining = totalBudget - totalSpend;
    
    let advice = "";
    let additionalTips = "";

    // Generate additional advice based on absolute values
    if (totalBudget > 100000) {
      // Higher budget advice
      additionalTips = remaining > 20000 ? 
        "Consider investing some of your surplus in mutual funds or fixed deposits." : 
        "Look for high-value expenses you might be able to optimize.";
    } else if (totalBudget > 30000) {
      // Medium budget advice
      additionalTips = remaining > 10000 ? 
        "You could set aside some of your surplus for emergency funds." : 
        "Review your recurring subscriptions and non-essential expenses.";
    } else {
      // Lower budget advice
      additionalTips = remaining > 0 ? 
        "Try to save small amounts consistently for future needs." : 
        "Focus on reducing daily expenses like eating out or transportation costs.";
    }

    if (totalBudget === 0) {
      advice = "Please add a budget to get personalized advice.";
    } else if (budgetUtilization > 100) {
      advice = `You've spent ₹${totalSpend.toLocaleString('en-IN')}, which is ₹${Math.abs(remaining).toLocaleString('en-IN')} over your budget of ₹${totalBudget.toLocaleString('en-IN')} (${budgetUtilization}%). Time to reassess your spending priorities and cut back where possible. ${remaining < -5000 ? "Consider implementing a strict spending freeze on non-essentials until next month." : "Try to reduce discretionary spending for the rest of the period."}`;
    } else if (budgetUtilization > 90) {
      advice = `You're using ${budgetUtilization}% of your budget with ₹${remaining.toLocaleString('en-IN')} remaining. That's very close to your limit. Consider reducing discretionary expenses to stay in control. ${additionalTips}`;
    } else if (budgetUtilization > 70) {
      advice = `You're at ${budgetUtilization}% of your budget with ₹${remaining.toLocaleString('en-IN')} remaining. Keep an eye on spending to avoid going over. ${additionalTips}`;
    } else if (budgetUtilization > 50) {
      advice = `You've used ${budgetUtilization}% of your budget with ₹${remaining.toLocaleString('en-IN')} remaining. You're on track, but continue to monitor expenses. ${additionalTips}`;
    } else {
      advice = `Nice! You're only using ${budgetUtilization}% of your budget with ₹${remaining.toLocaleString('en-IN')} remaining. Keep it up and consider putting some of the surplus into savings. ${additionalTips}`;
    }

    return advice;
  } catch (error) {
    console.error("Error getting financial advice:", error);
    return "Unable to generate financial advice at this time. Please try again later.";
  }
};

export default getFinanceAdvice;