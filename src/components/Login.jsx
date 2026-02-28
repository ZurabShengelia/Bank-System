import React, { useState } from 'react';
import { apiLogin } from '../utils/apiService';
import * as Icons from './Icons';
import { useDarkMode } from '../context/DarkModeContext';
const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDark, toggleDarkMode } = useDarkMode();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required!');
      setLoading(false);
      return;
    }
    try {
      const response = await apiLogin(username, password);
      if (response.success && response.data.success) {
        localStorage.setItem('currentUser', username);
        onLoginSuccess(username);
      } else {
        setError(response.data?.message || response.error || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };
  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-neutral-900' : 'bg-gradient-to-br from-primary-50 to-secondary-50'} transition-colors duration-300 px-4`}>
      <div className={`w-full max-w-md backdrop-blur-xl ${isDark ? 'bg-neutral-800/40 border-neutral-700/50' : 'bg-white/40 border-white/20'} border rounded-2xl shadow-2xl p-8 animate-slideUp`}>
        <div className="text-center mb-8 flex items-start justify-between">
          <div className="flex-1">
            <div className={`inline-flex items-center justify-center w-16 h-16 ${isDark ? 'bg-primary-500/20' : 'bg-primary-100'} rounded-full mb-4 animate-glow`}>
              <Icons.WalletIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'} mb-1`}>ProBank</h1>
            <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>Welcome Back</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all ${isDark ? 'bg-neutral-700 text-yellow-400 hover:bg-neutral-600' : 'bg-white/50 text-neutral-600 hover:bg-white'}`}
            title="Toggle dark mode"
          >
            {isDark ? <Icons.SunIcon className="w-5 h-5" /> : <Icons.MoonIcon className="w-5 h-5" />}
          </button>
        </div>
        {error && (
          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-error-500/20 border-error-500/30' : 'bg-error-100 border-error-300'} border flex items-start gap-3 animate-slideDown`}>
            <Icons.ErrorIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-error-400' : 'text-error-600'}`} />
            <p className={`text-sm ${isDark ? 'text-error-400' : 'text-error-700'}`}>{error}</p>
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className={`w-full px-4 py-3 rounded-lg border transition-all ${isDark ? 'bg-neutral-700/50 border-neutral-600 text-white placeholder-neutral-400 focus:border-primary-500 focus:bg-neutral-700' : 'bg-white/50 border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-primary-500 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
              disabled={loading}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all ${isDark ? 'bg-neutral-700/50 border-neutral-600 text-white placeholder-neutral-400 focus:border-primary-500 focus:bg-neutral-700' : 'bg-white/50 border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-primary-500 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-3.5 transition-colors ${isDark ? 'text-neutral-400 hover:text-neutral-300' : 'text-neutral-600 hover:text-neutral-700'}`}
                disabled={loading}
              >
                {showPassword ? <Icons.EyeIcon className="w-5 h-5" /> : <Icons.EyeOffIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'} bg-gradient-primary text-white`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Icons.LogoutIcon className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>
        <div className={`mt-6 pt-6 border-t ${isDark ? 'border-neutral-700' : 'border-neutral-300'} text-center`}>
          <p className={`text-sm mb-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Don't have an account?
          </p>
          <button
            onClick={onSwitchToRegister}
            className={`w-full py-2 rounded-lg font-semibold transition-all ${isDark ? 'bg-neutral-700/50 hover:bg-neutral-700 text-primary-400' : 'bg-primary-100 hover:bg-primary-200 text-primary-600'}`}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;

