import React, { useState, useEffect } from 'react';
import Balance from './Balance';
import TransactionList from './TransactionList';
import Analytics from './Analytics';
import SavingsTracker from './SavingsTracker';
import DailyLimits from './DailyLimits';
import FinancialTips from './FinancialTips';
import MoneyTransfer from './MoneyTransfer';
import {
  depositMoney,
  withdrawMoney,
  getBalance,
  getUserTransactions,
  checkDailyLimit,
  undoLastTransaction,
} from '../utils/storage';
import { DepositIcon, WithdrawIcon, UndoIcon } from './Icons';
const TransactionForm = ({ username, onTransaction, isDark, addToast }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('deposit');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }

    const limitCheck = checkDailyLimit(username, mode, parseFloat(amount));
    if (!limitCheck.allowed) {
      addToast(limitCheck.message, 'warning');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result =
        mode === 'deposit'
          ? depositMoney(username, parseFloat(amount))
          : withdrawMoney(username, parseFloat(amount));
      if (result.success) {

        addToast(result.message || `${mode === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`, 'success');
        setAmount('');
        onTransaction();
      } else {
        addToast(result.error || result.message, 'error');
      }
      setLoading(false);
    }, 600);
  };
  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
  };
  return (
    <div className={`rounded-2xl shadow-xl p-8 ${isDark ? 'bg-gray-800' : 'bg-white'} border-2 ${isDark ? 'border-gray-700' : 'border-gray-100'} hover:shadow-2xl transition-all duration-300`}>
      <h2 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Transaction
      </h2>
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setMode('deposit')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
            mode === 'deposit'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
              : isDark
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <DepositIcon size={20} />
          Deposit
        </button>
        <button
          onClick={() => setMode('withdraw')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
            mode === 'withdraw'
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105'
              : isDark
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <WithdrawIcon size={20} />
          Withdraw
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Amount
          </label>
          <div className="relative">
            <span className={`absolute left-4 top-4 text-lg font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              disabled={loading}
              className={`w-full pl-10 pr-4 py-4 border-2 rounded-lg focus:outline-none transition text-lg font-semibold ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-bold py-4 px-4 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg ${
            mode === 'deposit'
              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl'
              : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? 'Processing...' : mode === 'deposit' ? 'Deposit Money' : 'Withdraw Money'}
        </button>
      </form>
      <div className={`mt-8 pt-8 border-t-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <p className={`text-xs mb-4 font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Quick Actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[50, 100, 200, 500].map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => handleQuickAmount(quickAmount)}
              className={`py-3 rounded-lg font-bold transition transform hover:scale-110 text-sm active:scale-95 ${
                isDark
                  ? 'bg-gray-700 hover:bg-blue-700 text-gray-300 hover:text-white'
                  : 'bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700'
              }`}
            >
              ${quickAmount}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
const MainDashboard = ({ username, onLogout, isDark, addToast }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [transactionTrigger, setTransactionTrigger] = useState(0);
  const loadUserData = React.useCallback(() => {
    const currentBalance = getBalance(username);
    const userTransactions = getUserTransactions(username);
    setBalance(currentBalance);
    setTransactions(userTransactions);
    setTransactionTrigger(prev => prev + 1);
  }, [username]);
  useEffect(() => {
    loadUserData();
  }, [username, loadUserData]);
  const handleUndo = () => {
    const result = undoLastTransaction(username);
    if (result.success) {
      addToast(result.message, 'success');
      loadUserData();
    } else {
      addToast(result.message, 'error');
    }
  };
  return (
    <div className="space-y-10">
      <div className="dashboard-card">
        <Balance balance={balance} isDark={isDark} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 dashboard-card">
          <TransactionForm username={username} onTransaction={loadUserData} isDark={isDark} addToast={addToast} />
        </div>
        <div className="lg:col-span-2 dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recent Transactions
            </h2>
            {transactions.length > 0 && (
              <button
                onClick={handleUndo}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105 ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title="Undo last transaction"
              >
                <UndoIcon size={18} />
                <span className="text-sm">Undo</span>
              </button>
            )}
          </div>
          <TransactionList transactions={transactions} isDark={isDark} />
        </div>
      </div>
      <div className="dashboard-card">
        <DailyLimits username={username} transactionTrigger={transactionTrigger} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="dashboard-card">
          <MoneyTransfer username={username} onTransferSuccess={loadUserData} isDark={isDark} addToast={addToast} />
        </div>
        <div className="dashboard-card">
          <SavingsTracker username={username} transactionTrigger={transactionTrigger} onFundAdded={loadUserData} />
        </div>
      </div>
      {transactions.length > 0 && (
        <div className="dashboard-card">
          <Analytics transactions={transactions} isDark={isDark} />
        </div>
      )}
      <div className="dashboard-card">
        <FinancialTips username={username} />
      </div>
    </div>
  );
};
export { TransactionForm, MainDashboard };

