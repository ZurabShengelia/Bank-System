import React, { useState, useEffect } from 'react';
import Balance from './Balance';
import TransactionList from './TransactionList';
import Analytics from './Analytics';
import SkeletonLoader from './SkeletonLoader';
import { ToastContainer } from './Toast';
import { useDarkMode } from '../context/DarkModeContext';
import {
  depositMoney,
  withdrawMoney,
  getBalance,
  getUserTransactions,
} from '../utils/storage';
const Dashboard = ({ username, onLogout }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState('deposit');
  const [toasts, setToasts] = useState([]);
  const { isDark, toggleDarkMode } = useDarkMode();
  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  const loadUserData = () => {
    const currentBalance = getBalance(username);
    const userTransactions = getUserTransactions(username);
    setBalance(currentBalance);
    setTransactions(userTransactions);
    setIsLoadingData(false);
  };
  useEffect(() => {
    loadUserData();

  }, [username]);
  const handleDeposit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = depositMoney(username, parseFloat(amount));
      if (result.success) {
        addToast(result.message, 'success');
        setBalance(result.newBalance);
        setAmount('');
        loadUserData();
      } else {
        addToast(result.message, 'error');
      }
      setLoading(false);
    }, 600);
  };
  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = withdrawMoney(username, parseFloat(amount));
      if (result.success) {
        addToast(result.message, 'success');
        setBalance(result.newBalance);
        setAmount('');
        loadUserData();
      } else {
        addToast(result.message, 'error');
      }
      setLoading(false);
    }, 600);
  };
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-gray-900 to-gray-800'
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      <header className={`${
        isDark ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-md'
      } sticky top-0 z-20 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">💰</span>
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Bank System
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden sm:block">
                <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Welcome, <span className="text-blue-600">{username}</span>
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'
                } hover:scale-110 transform duration-200`}
                title="Toggle dark mode"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition transform hover:scale-105 shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fadeIn">
          {isLoadingData ? <SkeletonLoader type="card" /> : <Balance balance={balance} />}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <div className={`rounded-2xl shadow-lg overflow-hidden transition-colors duration-300 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex">
                <button
                  onClick={() => {
                    setActiveTab('deposit');
                    setAmount('');
                  }}
                  className={`flex-1 py-4 px-6 font-bold text-center transition-colors ${
                    activeTab === 'deposit'
                      ? 'bg-green-500 text-white'
                      : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📥 Deposit
                </button>
                <button
                  onClick={() => {
                    setActiveTab('withdraw');
                    setAmount('');
                  }}
                  className={`flex-1 py-4 px-6 font-bold text-center transition-colors ${
                    activeTab === 'withdraw'
                      ? 'bg-red-500 text-white'
                      : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📤 Withdraw
                </button>
              </div>
              <div className="p-6">
                <form
                  onSubmit={activeTab === 'deposit' ? handleDeposit : handleWithdraw}
                  className="space-y-5"
                >
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Amount
                    </label>
                    <div className="relative">
                      <span className={`absolute left-4 top-3 text-2xl font-bold ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}>
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
                        className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:outline-none transition font-semibold text-lg ${
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
                    className={`w-full text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      activeTab === 'deposit'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    }`}
                  >
                    {loading ? '⏳ Processing...' : `${activeTab === 'deposit' ? '💰 Deposit' : '💸 Withdraw'}`}
                  </button>
                </form>
                <div className={`mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`text-xs mb-3 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Quick Actions
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[50, 100, 200, 500].map((quickAmount) => (
                      <button
                        key={quickAmount}
                        onClick={() => setAmount(quickAmount.toString())}
                        className={`${
                          isDark
                            ? 'bg-gray-700 hover:bg-blue-700 text-gray-300 hover:text-white'
                            : 'bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700'
                        } font-semibold py-2 rounded-lg transition text-sm transform hover:scale-105`}
                      >
                        ${quickAmount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            {isLoadingData ? (
              <SkeletonLoader count={4} type="transaction" />
            ) : (
              <TransactionList transactions={transactions} />
            )}
          </div>
        </div>
        {!isLoadingData && <Analytics transactions={transactions} isDark={isDark} />}
      </main>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};
export default Dashboard;

