import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import { MainDashboard, TransactionForm } from './components/MainDashboard';
import TransactionList from './components/TransactionList';
import Profile from './components/Profile';
import { ToastContainer } from './components/Toast';
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';
import * as Icons from './components/Icons';
import { apiGetTransactions } from './utils/apiService';
import { initializeDemoData } from './utils/initialization';
import { changePassword } from './utils/storage';
const HistoryPage = ({ currentUser, isDark, addToast }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await apiGetTransactions(currentUser);
        if (response.success) {
          setTransactions(response.data || []);
        } else {
          addToast(response.error || 'Failed to load transactions', 'error');
        }
      } catch (err) {
        addToast('Error loading transactions', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) {
      fetchTransactions();
    }
  }, [currentUser, addToast]);
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Icons.AnalyticsIcon className="w-8 h-8 text-primary-600" />
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Transaction History</h1>
      </div>
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <TransactionList transactions={transactions} isDark={isDark} />
      )}
    </div>
  );
};
const AppContent = () => {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const { isDark } = useDarkMode();
  useEffect(() => {

    const dbExists = localStorage.getItem('bankSystemDB');
    if (!dbExists) {
      initializeDemoData();
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      setCurrentView('app');
    }
  }, []);
  const addToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  const handleRegisterSuccess = (username) => {
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
    setCurrentView('app');
    setCurrentPage('dashboard');
    addToast('Welcome! Your account has been created successfully', 'success');
  };
  const handleLoginSuccess = (username) => {
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
    setCurrentView('app');
    setCurrentPage('dashboard');
    addToast(`Welcome back, ${username}!`, 'success');
  };
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentView('login');
    setCurrentPage('dashboard');
    addToast('You have been logged out', 'info');
  };
  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    if (pageId === 'dashboard') {

    }
  };
  const handleChangePassword = (username, currentPassword, newPassword) => {
    const result = changePassword(username, currentPassword, newPassword);
    if (result.success) {
      addToast(result.message, 'success');
    } else {
      addToast(result.error, 'error');
    }
  };
  const handleTransactionComplete = () => {

  };
  const renderDashboardPage = () => <MainDashboard username={currentUser} onLogout={handleLogout} isDark={isDark} addToast={addToast} />;
  const renderDepositPage = () => (
    <div className={`rounded-2xl shadow-lg p-8 max-w-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center gap-3 mb-8">
        <Icons.DepositIcon className="w-8 h-8 text-primary-600" />
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Deposit Money</h1>
      </div>
      <TransactionForm username={currentUser} onTransaction={handleTransactionComplete} isDark={isDark} addToast={addToast} />
    </div>
  );
  const renderWithdrawPage = () => (
    <div className={`rounded-2xl shadow-lg p-8 max-w-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center gap-3 mb-8">
        <Icons.WithdrawIcon className="w-8 h-8 text-warning-600" />
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Withdraw Money</h1>
      </div>
      <TransactionForm username={currentUser} onTransaction={handleTransactionComplete} isDark={isDark} addToast={addToast} />
    </div>
  );
  const renderHistoryPage = () => <HistoryPage currentUser={currentUser} isDark={isDark} addToast={addToast} />;
  const renderProfilePage = () => (
    <Profile username={currentUser} isDark={isDark} onChangePassword={handleChangePassword} addToast={addToast} />
  );
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboardPage();
      case 'deposit':
        return renderDepositPage();
      case 'withdraw':
        return renderWithdrawPage();
      case 'history':
        return renderHistoryPage();
      case 'profile':
        return renderProfilePage();
      default:
        return renderDashboardPage();
    }
  };
  if (currentView === 'login') {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setCurrentView('register')}
      />
    );
  }
  if (currentView === 'register') {
    return (
      <Register
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => setCurrentView('login')}
      />
    );
  }
  return (
    <div className={`flex h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {}
      <Sidebar
        username={currentUser}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />
      {}
      <main className="flex-1 overflow-auto">
        {}
        <div className={`md:hidden sticky top-0 z-10 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md p-4 flex items-center justify-between`}>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className={`p-2 rounded-lg hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
          >
            <Icons.MenuIcon className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
          </button>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Bank System</h1>
          <div className="w-8" />
        </div>
        {}
        <div className="p-4 md:p-8 max-w-7xl">
          {renderCurrentPage()}
        </div>
      </main>
      {}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};
function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}
export default App;

