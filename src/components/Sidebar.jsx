import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { getProfilePicture } from '../utils/storage';
import {
  DashboardIcon,
  DepositIcon,
  WithdrawIcon,
  HistoryIcon,
  ProfileIcon,
  LogoutIcon,
  MoonIcon,
  SunIcon,
  CloseIcon,
  WalletIcon,
} from './Icons';
const Sidebar = ({ username, onLogout, onNavigate, currentPage, isMobileOpen, setIsMobileOpen }) => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [profilePicture, setProfilePicture] = React.useState(null);
  React.useEffect(() => {
    const picture = getProfilePicture(username);
    setProfilePicture(picture);
  }, [username]);
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'deposit', label: 'Deposit', icon: DepositIcon },
    { id: 'withdraw', label: 'Withdraw', icon: WithdrawIcon },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'profile', label: 'Profile', icon: ProfileIcon },
  ];
  const handleNavClick = (pageId) => {
    onNavigate(pageId);
    if (isMobileOpen) setIsMobileOpen(false);
  };
  const handleLogout = () => {
    onLogout();
    if (isMobileOpen) setIsMobileOpen(false);
  };
  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed md:static top-0 left-0 h-screen ${
          isDark
            ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-b from-blue-700 via-blue-600 to-blue-800'
        } text-white w-72 shadow-2xl z-30 transition-transform duration-300 transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col overflow-y-auto`}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden absolute top-6 right-6 text-white hover:bg-white/10 p-2 rounded-lg transition-all"
        >
          <CloseIcon size={20} />
        </button>
        <div className={`p-8 border-b ${isDark ? 'border-gray-700' : 'border-blue-500/30'}`}>
          <div className="flex items-center gap-4 mb-4">
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-blue-900/50' : 'bg-blue-500/20'}`}>
                <WalletIcon size={28} className={isDark ? 'text-blue-300' : 'text-white'} />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">FinanceHub</h1>
              <p className="text-xs opacity-75">Premium Banking</p>
            </div>
          </div>
          <p className="text-xs opacity-75 mt-3 truncate">Welcome, <span className="font-semibold">{username}</span></p>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 group ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                      : 'bg-white/20 text-white shadow-lg'
                    : `text-blue-100 hover:${isDark ? 'bg-gray-700' : 'bg-white/10'}`
                }`}
              >
                <IconComponent
                  size={12}
                  className={isActive ? 'text-white' : isDark ? 'text-blue-300' : 'text-blue-100'}
                />
                <span className="font-semibold text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
        <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-blue-500/30'} space-y-2`}>
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
              isDark
                ? 'text-blue-300 hover:bg-gray-700'
                : 'text-blue-100 hover:bg-white/10'
            }`}
            title="Toggle dark mode"
          >
            {isDark ? (
              <>
                <SunIcon size={12} />
                <span className="font-semibold text-sm">Light Mode</span>
              </>
            ) : (
              <>
                <MoonIcon size={12} />
                <span className="font-semibold text-sm">Dark Mode</span>
              </>
            )}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
              isDark
                ? 'bg-red-900/20 text-red-100 hover:bg-red-900/30'
                : 'bg-red-500/20 text-red-100 hover:bg-red-500/30'
            }`}
          >
            <LogoutIcon size={12} />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;

