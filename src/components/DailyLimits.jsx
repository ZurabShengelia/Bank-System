import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { AlertIcon, DepositIcon, WithdrawIcon } from './Icons';
import { getDailyLimits } from '../utils/storage';
export default function DailyLimits({ username, transactionTrigger }) {
  const { isDark } = useDarkMode();
  const [limits, setLimits] = useState(null);
  useEffect(() => {
    const updateLimits = () => {
      setLimits(getDailyLimits(username));
    };
    updateLimits();
    const interval = setInterval(updateLimits, 1000);
    return () => clearInterval(interval);
  }, [username, transactionTrigger]);
  if (!limits) return null;
  const depositProgress = (limits.depositUsed / limits.depositLimit) * 100;
  const withdrawalProgress = (limits.withdrawUsed / limits.withdrawLimit) * 100;
  const depositRemaining = Math.max(0, limits.depositLimit - limits.depositUsed);
  const withdrawalRemaining = Math.max(0, limits.withdrawLimit - limits.withdrawUsed);
  const depositWarning = depositProgress > 80;
  const withdrawalWarning = withdrawalProgress > 80;
  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-xl transition-all duration-300 border-2 ${
      depositWarning || withdrawalWarning ? (isDark ? 'border-orange-800' : 'border-orange-200') : (isDark ? 'border-gray-700' : 'border-gray-100')
    }`}>
      <div className="flex items-center gap-3 mb-8">
        {(depositWarning || withdrawalWarning) && (
          <div className={`p-3 rounded-xl ${isDark ? 'bg-orange-900' : 'bg-orange-100'}`}>
            <AlertIcon size={20} className={isDark ? 'text-orange-300' : 'text-orange-600'} />
          </div>
        )}
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Daily Transaction Limits
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-blue-50'} border-2 ${depositWarning ? (isDark ? 'border-orange-700' : 'border-orange-300') : (isDark ? 'border-gray-600' : 'border-blue-200')}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DepositIcon size={18} className="text-green-500" />
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Daily Deposit Limit
              </h3>
            </div>
            {depositWarning && (
              <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-semibold">
                ⚠ Warning
              </span>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Used
              </span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ${limits.depositUsed.toFixed(2)} / ${limits.depositLimit.toFixed(2)}
              </span>
            </div>
            <div className={`h-4 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-blue-200'}`}>
              <div
                className={`h-full transition-all duration-300 ${
                  depositProgress > 80
                    ? 'bg-gradient-to-r from-orange-400 to-red-500'
                    : 'bg-gradient-to-r from-green-400 to-blue-500'
                }`}
                style={{ width: `${Math.min(depositProgress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {depositProgress.toFixed(0)}% used
              </span>
              <span className={`font-semibold ${depositRemaining < 500 ? 'text-orange-500' : 'text-green-500'}`}>
                ${depositRemaining.toFixed(2)} remaining
              </span>
            </div>
          </div>
        </div>
        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-red-50'} border-2 ${withdrawalWarning ? (isDark ? 'border-orange-700' : 'border-orange-300') : (isDark ? 'border-gray-600' : 'border-red-200')}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <WithdrawIcon size={18} className="text-red-500" />
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Daily Withdrawal Limit
              </h3>
            </div>
            {withdrawalWarning && (
              <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-semibold">
                ⚠ Warning
              </span>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Used
              </span>
              <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ${limits.withdrawUsed.toFixed(2)} / ${limits.withdrawLimit.toFixed(2)}
              </span>
            </div>
            <div className={`h-4 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-red-200'}`}>
              <div
                className={`h-full transition-all duration-300 ${
                  withdrawalProgress > 80
                    ? 'bg-gradient-to-r from-orange-400 to-red-500'
                    : 'bg-gradient-to-r from-amber-400 to-red-500'
                }`}
                style={{ width: `${Math.min(withdrawalProgress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {withdrawalProgress.toFixed(0)}% used
              </span>
              <span className={`font-semibold ${withdrawalRemaining < 300 ? 'text-orange-500' : 'text-green-500'}`}>
                ${withdrawalRemaining.toFixed(2)} remaining
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-100'} text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
        ℹ️ Limits reset daily at midnight. These are safeguards to help you manage your finances responsibly.
      </div>
    </div>
  );
}

