import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';
const TransactionList = ({ transactions }) => {
  const { isDark } = useDarkMode();
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  return (
    <div className={`rounded-2xl shadow-lg overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className={`${
        isDark
          ? 'bg-gradient-to-r from-gray-700 to-gray-800'
          : 'bg-gradient-to-r from-gray-800 to-gray-900'
      } p-6`}>
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          📊 Transaction History
        </h3>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-300'}`}>
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="overflow-x-auto">
        {transactions.length === 0 ? (
          <div className={`p-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <p className="text-lg">No transactions yet</p>
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Start by making your first deposit or withdrawal
            </p>
          </div>
        ) : (
          <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {[...transactions].reverse().map((transaction, index) => (
              <div
                key={index}
                className={`p-4 hover:${isDark ? 'bg-gray-750' : 'bg-gray-50'} transition-colors border-l-4 transform hover:scale-102 duration-200 ${
                  transaction.type === 'deposit'
                    ? isDark
                      ? 'border-green-500 bg-gray-700'
                      : 'border-green-500 bg-green-50'
                    : transaction.type === 'withdrawal'
                    ? isDark
                      ? 'border-red-500 bg-gray-700'
                      : 'border-red-500 bg-red-50'
                    : transaction.type === 'transfer_sent'
                    ? isDark
                      ? 'border-orange-500 bg-gray-700'
                      : 'border-orange-500 bg-orange-50'
                    : transaction.type === 'transfer_received'
                    ? isDark
                      ? 'border-purple-500 bg-gray-700'
                      : 'border-purple-500 bg-purple-50'
                    : isDark
                    ? 'border-blue-500 bg-gray-700'
                    : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl">
                        {transaction.type === 'deposit' ? '📥' : transaction.type === 'withdrawal' ? '📤' : transaction.type === 'transfer_sent' ? '📤💸' : transaction.type === 'transfer_received' ? '📨💰' : '💰'}
                      </span>
                      <div>
                        <p className={`font-semibold capitalize ${
                          isDark ? 'text-white' : 'text-gray-800'
                        }`}>
                          {transaction.type === 'savings' 
                            ? `Savings: ${transaction.goalName}` 
                            : transaction.type === 'transfer_sent'
                            ? `Sent to ${transaction.recipient}`
                            : transaction.type === 'transfer_received'
                            ? `Received from ${transaction.sender}`
                            : transaction.type}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(transaction.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-2xl font-bold ${
                        transaction.type === 'deposit' || transaction.type === 'transfer_received'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {transaction.type === 'deposit' || transaction.type === 'transfer_received' ? '+' : '-'}$
                      {transaction.amount.toFixed(2)}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Balance: ${transaction.balanceAfter.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default TransactionList;

