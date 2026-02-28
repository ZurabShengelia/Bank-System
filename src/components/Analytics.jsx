import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);
const Analytics = ({ transactions, isDark = false }) => {
  const [chartData, setChartData] = useState(null);
  const [stats, setStats] = useState({ totalDeposits: 0, totalWithdrawals: 0, transactions: 0 });
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartData(null);
      return;
    }
    const deposits = transactions.filter((t) => t.type === 'deposit');
    const withdrawals = transactions.filter((t) => t.type === 'withdrawal');
    const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);
    setStats({
      totalDeposits,
      totalWithdrawals,
      transactions: transactions.length,
    });

    const groupedByDate = {};
    transactions.forEach((t) => {
      if (!t.timestamp) return;
      const dateObj = new Date(t.timestamp);
      if (isNaN(dateObj.getTime())) return;
      const date = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!groupedByDate[date]) {
        groupedByDate[date] = { deposits: 0, withdrawals: 0 };
      }
      if (t.type === 'deposit') {
        groupedByDate[date].deposits += t.amount;
      } else {
        groupedByDate[date].withdrawals += t.amount;
      }
    });
    const dates = Object.keys(groupedByDate).slice(-10);
    const depositData = dates.map((date) => groupedByDate[date].deposits);
    const withdrawalData = dates.map((date) => groupedByDate[date].withdrawals);
    setChartData({
      labels: dates,
      datasets: [
        {
          label: 'Deposits',
          data: depositData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Withdrawals',
          data: withdrawalData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    });
  }, [transactions]);
  const textColor = isDark ? '#ffffff' : '#1f2937';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: { size: 12, weight: 'bold' },
        },
      },
    },
    scales: {
      y: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
    },
  };
  return (
    <div className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 20H6v-2h12m0-4H6v-2h12m0-4H6V8h12M3 6h18V4H3z" />
        </svg>
        Analytics
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900' : 'bg-green-50'}`}>
          <p className={`text-sm ${isDark ? 'text-green-200' : 'text-green-600'}`}>Total Deposits</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-green-300' : 'text-green-600'}`}>
            ${stats.totalDeposits.toFixed(2)}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900' : 'bg-red-50'}`}>
          <p className={`text-sm ${isDark ? 'text-red-200' : 'text-red-600'}`}>Total Withdrawals</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-red-300' : 'text-red-600'}`}>
            ${stats.totalWithdrawals.toFixed(2)}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-50'}`}>
          <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>Total Transactions</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
            {stats.transactions}
          </p>
        </div>
      </div>
      {chartData ? (
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <p className="text-lg">No transaction data to display</p>
        </div>
      )}
    </div>
  );
};
export default Analytics;

