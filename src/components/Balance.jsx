import React from 'react';
const Balance = ({ balance, isDark }) => {
  return (
    <div className={`rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden transform transition-all duration-300 hover:scale-105 ${
      isDark
        ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
        : 'bg-gradient-to-br from-blue-500 to-blue-600'
    } text-white`}>
      <div className="absolute top-0 right-0 opacity-10">
        <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V6.5m-11-4v4m8-4v4m-8 2h8" />
        </svg>
      </div>
      <div className="relative z-10">
        <p className="text-blue-100 font-semibold text-sm md:text-base mb-3">Account Balance</p>
        <div className="mb-6">
          <h2 className="text-5xl md:text-7xl font-black my-4 animate-fadeIn tracking-tight">
            ${balance.toFixed(2)}
          </h2>
        </div>
        <div className="border-t border-blue-400 pt-4 flex items-center justify-between">
          <p className="text-blue-100 text-sm">Your funds are secure</p>
          <span className="text-xs font-semibold px-3 py-1 bg-white/20 rounded-full">Active</span>
        </div>
      </div>
    </div>
  );
};
export default Balance;

