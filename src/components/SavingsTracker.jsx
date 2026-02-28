import React, { useState, useEffect, useCallback } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { CheckIcon, TargetIcon, AlertIcon } from './Icons';
import {
  addFundsToSavingsGoal,
  createSavingsGoal,
  deleteSavingsGoal,
  getSavingsGoals,
  getBalance,
} from '../utils/storage';
function SavingsTracker({ username, transactionTrigger, onFundAdded }) {
  const { isDark } = useDarkMode();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', target: '', deadline: '' });
  const [fundGoalId, setFundGoalId] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [fundError, setFundError] = useState('');
  const [createError, setCreateError] = useState('');
  const loadGoals = useCallback(() => {
    const storedGoals = getSavingsGoals(username);
    setGoals(storedGoals || []);
    setBalance(getBalance(username));
  }, [username]);
  useEffect(() => {
    loadGoals();
  }, [username, transactionTrigger, loadGoals]);
  const handleAddGoal = () => {
    setCreateError('');
    if (!formData.name || !formData.target || formData.target <= 0) {
      setCreateError('Please fill in all fields with valid amounts');
      return;
    }
    const result = createSavingsGoal(username, {
      name: formData.name,
      target: parseFloat(formData.target),
      deadline: formData.deadline,
    });
    if (result.success) {
      loadGoals();
      setFormData({ name: '', target: '', deadline: '' });
      setShowForm(false);
      setCreateError('');
    } else {
      setCreateError(result.error || 'Failed to create goal');
    }
  };
  const handleDeleteGoal = (id) => {
    const result = deleteSavingsGoal(username, id);
    if (result.success) {
      loadGoals();
      if (onFundAdded) onFundAdded();
    } else {
      alert(result.error || 'Failed to delete goal');
    }
  };
  const handleAddFundsToGoal = (id) => {
    const amount = parseFloat(fundAmount);
    setFundError('');
    if (!amount || amount <= 0) {
      setFundError('Please enter a valid amount greater than 0');
      return;
    }
    if (amount > balance) {
      setFundError(`Insufficient balance. Available: $${balance.toFixed(2)}`);
      return;
    }
    const goal = goals.find(g => g.id === id);
    if (!goal) {
      setFundError('Goal not found');
      return;
    }
    if (goal.currentAmount >= goal.target) {
      setFundError('Goal is already complete');
      return;
    }
    const result = addFundsToSavingsGoal(username, id, amount);
    if (result.success) {
      loadGoals();
      setFundAmount('');
      setFundGoalId(null);
      setFundError('');
      if (onFundAdded) onFundAdded();
    } else {
      setFundError(result.error || 'Failed to add funds to goal');
    }
  };
  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
            <TargetIcon size={24} className={isDark ? 'text-blue-300' : 'text-blue-600'} />
          </div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Savings Goals
          </h2>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setCreateError(''); }}
          className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 ${
            showForm ? 'from-gray-400 to-gray-500' : ''
          }`}
        >
          {showForm ? 'Cancel' : '+ New Goal'}
        </button>
      </div>
      {showForm && (
        <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6 mb-6 border-2 ${isDark ? 'border-blue-800' : 'border-blue-200'}`}>
          <input
            type="text"
            placeholder="Goal name (e.g., Vacation, Car, House)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full mb-4 p-3 rounded-lg border-2 ${isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:border-blue-500 transition`}
          />
          <input
            type="number"
            placeholder="Target amount ($)"
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
            className={`w-full mb-4 p-3 rounded-lg border-2 ${isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:border-blue-500 transition`}
          />
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className={`w-full mb-4 p-3 rounded-lg border-2 ${isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:border-blue-500 transition`}
          />
          {createError && (
            <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 mb-4 ${
              isDark
                ? 'bg-red-900/30 text-red-300 border border-red-800'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              <AlertIcon size={16} />
              {createError}
            </div>
          )}
          <button
            onClick={handleAddGoal}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Add Goal
          </button>
        </div>
      )}
      {goals.length === 0 ? (
        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <TargetIcon size={40} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No savings goals yet. Create one to start tracking!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const currentAmount = goal.currentAmount || 0;
            const progress = goal.target > 0 ? (currentAmount / goal.target) * 100 : 0;
            const isComplete = progress >= 100;
            return (
              <div
                key={goal.id}
                className={`p-6 rounded-xl border-2 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} hover:shadow-md transition-all`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {goal.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      ${currentAmount.toFixed(2)} / ${goal.target.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    {isComplete && (
                      <div className="text-green-500 pt-1">
                        <CheckIcon size={20} />
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className={`text-sm font-semibold px-3 py-1 rounded-lg transition-all ${
                        isDark
                          ? 'text-red-300 hover:bg-red-900/30'
                          : 'text-red-600 hover:bg-red-100'
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-200'} mb-3`}>
                  <div
                    className={`h-full transition-all duration-500 ${
                      isComplete
                        ? 'bg-gradient-to-r from-green-400 to-green-600'
                        : 'bg-gradient-to-r from-blue-400 to-blue-600'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {progress.toFixed(0)}% complete
                  </span>
                  {goal.deadline && (
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      By {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {fundGoalId === goal.id ? (
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                      <span className="font-bold">Balance:</span> <span className="font-bold">${balance.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Amount to add"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        className={`flex-1 p-2 rounded-lg border-2 ${isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'} focus:outline-none focus:border-blue-500 transition text-sm`}
                      />
                      <button
                        onClick={() => handleAddFundsToGoal(goal.id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-md transition-all text-sm hover:scale-105 transform"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => { setFundGoalId(null); setFundAmount(''); }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${isDark ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        Cancel
                      </button>
                    </div>
                    {fundError && (
                      <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                        isDark
                          ? 'bg-red-900/30 text-red-300 border border-red-800'
                          : 'bg-red-100 text-red-700 border border-red-300'
                      }`}>
                        <AlertIcon size={16} />
                        {fundError}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => { setFundGoalId(goal.id); setFundAmount(''); setFundError(''); }}
                    disabled={isComplete}
                    className={`w-full py-2 rounded-lg font-semibold transition-all text-sm ${
                      isComplete
                        ? isDark ? 'bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isDark ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {isComplete ? 'Goal Completed' : 'Add Funds'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default SavingsTracker;

