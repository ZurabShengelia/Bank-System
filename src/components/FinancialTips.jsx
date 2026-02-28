import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { InfoIcon, AlertIcon, SuccessIcon, TrendingUpIcon } from './Icons';
import { getFinancialInsights } from '../utils/storage';
export default function FinancialTips({ username }) {
  const { isDark } = useDarkMode();
  const [insights, setInsights] = useState([]);
  const [dismissedTips, setDismissedTips] = useState(new Set());
  useEffect(() => {
    const insights = getFinancialInsights(username);

    if (insights) {
      const tips = [
        {
          id: 'income',
          type: 'info',
          title: 'Monthly Income',
          message: `You've received $${insights.monthlyIncome?.toFixed(2) || '0.00'} this month`,
        },
        {
          id: 'spending',
          type: insights.monthlyExpense > insights.monthlyIncome ? 'warning' : 'success',
          title: 'Monthly Spending',
          message: `You've spent $${insights.monthlyExpense?.toFixed(2) || '0.00'} this month`,
        },
        {
          id: 'credit',
          type: 'success',
          title: 'Credit Score',
          message: `Your credit score is ${insights.creditScoreTrend || 750}`,
        },
        {
          id: 'savings',
          type: insights.netMonthly > 0 ? 'success' : 'warning',
          title: 'Net Monthly',
          message: `Net balance: $${insights.netMonthly?.toFixed(2) || '0.00'}`,
        },
      ];
      setInsights(tips);
    } else {
      setInsights([]);
    }
  }, [username]);
  const dismissTip = (id) => {
    const newDismissed = new Set(dismissedTips);
    newDismissed.add(id);
    setDismissedTips(newDismissed);
  };
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <SuccessIcon size={20} className="text-green-500" />;
      case 'warning':
        return <AlertIcon size={20} className="text-orange-500" />;
      case 'info':
      default:
        return <InfoIcon size={20} className="text-blue-500" />;
    }
  };
  const getIconBg = (type, isDark) => {
    switch (type) {
      case 'success':
        return isDark ? 'bg-green-900' : 'bg-green-100';
      case 'warning':
        return isDark ? 'bg-orange-900' : 'bg-orange-100';
      case 'info':
      default:
        return isDark ? 'bg-blue-900' : 'bg-blue-100';
    }
  };
  const getBorder = (type, isDark) => {
    switch (type) {
      case 'success':
        return isDark ? 'border-green-800' : 'border-green-200';
      case 'warning':
        return isDark ? 'border-orange-800' : 'border-orange-200';
      case 'info':
      default:
        return isDark ? 'border-blue-800' : 'border-blue-200';
    }
  };
  const visibleTips = insights.filter((tip) => !dismissedTips.has(tip.id));
  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-xl transition-all duration-300`}>
      <div className="flex items-center gap-3 mb-8">
        <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
          <TrendingUpIcon size={24} className={isDark ? 'text-purple-300' : 'text-purple-600'} />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Financial Insights
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Smart tips to improve your finances
          </p>
        </div>
      </div>
      {visibleTips.length === 0 ? (
        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <TrendingUpIcon size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No financial insights at the moment. Keep tracking your transactions!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleTips.map((tip, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${getIconBg(tip.type, isDark)} ${getBorder(tip.type, isDark)} hover:shadow-md`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(tip.type)}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {tip.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {tip.message}
                  </p>
                </div>
                <button
                  onClick={() => dismissTip(tip.id)}
                  className={`flex-shrink-0 text-lg opacity-50 hover:opacity-100 transition ${
                    isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={`mt-8 pt-8 border-t-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          💡 General Financial Tips
        </h3>
        <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <li>• Set realistic savings goals and track them monthly</li>
          <li>• Try to maintain a savings rate between 20-50% of your income</li>
          <li>• Monitor your daily limits to prevent overspending</li>
          <li>• Build an emergency fund with 3-6 months of expenses</li>
          <li>• Review your transaction history weekly to identify spending patterns</li>
          <li>• Use the undo feature if you made a transaction by mistake</li>
        </ul>
      </div>
    </div>
  );
}

