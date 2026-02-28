import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { SendIcon, AlertIcon, CheckIcon } from './Icons';
import { sendMoneyToUser, getBalance } from '../utils/storage';
export default function MoneyTransfer({ username, onTransferSuccess, isDark, addToast }) {
  const { isDark: darkMode } = useDarkMode();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const [recipientExists, setRecipientExists] = useState(null);
  useEffect(() => {
    setBalance(getBalance(username));
  }, [username]);
  const handleRecipientChange = (e) => {
    const value = e.target.value.trim();
    setRecipient(value);
    setError('');
    if (value === '') {
      setRecipientExists(null);
      return;
    }
    if (value === username) {
      setRecipientExists(false);
      setError('Cannot send money to yourself!');
    } else {
      setRecipientExists(true);
      setError('');
    }
  };
  const handleTransfer = (e) => {
    e.preventDefault();
    setError('');
    if (!recipient) {
      setError('Please enter a recipient username');
      return;
    }
    if (recipient === username) {
      setError('Cannot send money to yourself!');
      return;
    }
    const transferAmount = parseFloat(amount);
    if (!transferAmount || transferAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (transferAmount > balance) {
      setError(`Insufficient balance! Your balance: $${balance.toFixed(2)}`);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = sendMoneyToUser(username, recipient, transferAmount);
      if (result.success) {
        addToast(result.message, 'success');
        setRecipient('');
        setAmount('');
        setRecipientExists(null);
        setBalance(result.newBalance);
        if (onTransferSuccess) onTransferSuccess();
      } else {
        setError(result.message);
        addToast(result.message, 'error');
      }
      setLoading(false);
    }, 500);
  };
  const darkTheme = isDark || darkMode;
  return (
    <div className={`${darkTheme ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-xl transition-all duration-300 border-2 ${darkTheme ? 'border-gray-700' : 'border-gray-100'} hover:shadow-2xl`}>
      <div className="flex items-center gap-3 mb-8">
        <div className={`p-3 rounded-xl ${darkTheme ? 'bg-purple-900' : 'bg-purple-100'}`}>
          <SendIcon size={20} className={darkTheme ? 'text-purple-300' : 'text-purple-600'} />
        </div>
        <h2 className={`text-2xl font-bold ${darkTheme ? 'text-white' : 'text-gray-900'}`}>
          Send Money to User
        </h2>
      </div>
      <div className={`p-4 rounded-lg mb-6 ${darkTheme ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <p className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Your Balance</p>
        <p className={`text-3xl font-bold ${darkTheme ? 'text-white' : 'text-gray-900'}`}>
          ${balance.toFixed(2)}
        </p>
      </div>
      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className={`block text-sm font-semibold mb-2 ${darkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
            Send To (Username)
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter recipient username"
              value={recipient}
              onChange={handleRecipientChange}
              disabled={loading}
              className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none transition ${
                darkTheme
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                  : 'border-gray-300 focus:border-purple-500'
              } ${
                recipient && !error ? 'border-green-500' : ''
              } ${
                error && recipientExists === false ? 'border-red-500' : ''
              }`}
            />
            {recipient && recipientExists === true && (
              <div className="absolute right-3 top-3 text-green-500">
                <CheckIcon size={20} />
              </div>
            )}
            {recipient && recipientExists === false && error && (
              <div className="absolute right-3 top-3 text-red-500">
                <AlertIcon size={20} />
              </div>
            )}
          </div>
          {recipientExists === true && recipient && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              ✓ Account exists and is ready to receive money
            </p>
          )}
        </div>
        <div>
          <label className={`block text-sm font-semibold mb-2 ${darkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
            Amount ($)
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            step="0.01"
            min="0"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
              darkTheme
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500'
                : 'border-gray-300 focus:border-purple-500'
            }`}
          />
        </div>
        {error && (
          <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
            darkTheme
              ? 'bg-red-900/30 text-red-300 border border-red-800'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            <AlertIcon size={16} />
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !recipient || !amount}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-600 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Money'}
        </button>
      </form>
      <div className={`mt-6 p-4 rounded-lg ${darkTheme ? 'bg-blue-900/20' : 'bg-blue-50'} text-sm ${darkTheme ? 'text-blue-300' : 'text-blue-800'}`}>
        ℹ️ Send money to any username. If the account doesn't exist yet, it will be created with the transferred amount. You cannot send money to yourself.
      </div>
    </div>
  );
}

