import React, { useState } from 'react';
import { apiRegister } from '../services/apiService';
import { Icons } from './Icons';
import { useDarkMode } from '../context/DarkModeContext';
const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDark, toggleDarkMode } = useDarkMode();
  const validateForm = () => {
    if (!username.trim() || !password.trim() || !passwordConfirm.trim()) {
      setError('All fields are required!');
      return false;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await apiRegister(username, password, email);
      if (response.success && response.data.success) {
        localStorage.setItem('currentUser', username);
        onRegisterSuccess(username);
      } else {
        setError(response.data?.message || response.error || 'Registration failed');
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
            <div className={`inline-flex items-center justify-center w-16 h-16 ${isDark ? 'bg-secondary-500/20' : 'bg-secondary-100'} rounded-full mb-4 animate-glow`}>
              <Icons.User className="w-8 h-8 text-secondary-600" />
            </div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'} mb-1`}>Create Account</h1>
            <p className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>Join ProBank Today</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all ${isDark ? 'bg-neutral-700 text-yellow-400 hover:bg-neutral-600' : 'bg-white/50 text-neutral-600 hover:bg-white'}`}
            title="Toggle dark mode"
          >
            {isDark ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
          </button>
        </div>
        {error && (
          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-error-500/20 border-error-500/30' : 'bg-error-100 border-error-300'} border flex items-start gap-3 animate-slideDown`}>
            <Icons.AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-error-400' : 'text-error-600'}`} />
            <p className={`text-sm ${isDark ? 'text-error-400' : 'text-error-700'}`}>{error}</p>
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className={`w-full px-4 py-3 rounded-lg border transition-all ${isDark ? 'bg-neutral-700/50 border-neutral-600 text-white placeholder-neutral-400 focus:border-secondary-500 focus:bg-neutral-700' : 'bg-white/50 border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-secondary-500 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-secondary-500/20`}
              disabled={loading}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full px-4 py-3 rounded-lg border transition-all ${isDark ? 'bg-neutral-700/50 border-neutral-600 text-white placeholder-neutral-400 focus:border-secondary-500 focus:bg-neutral-700' : 'bg-white/50 border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-secondary-500 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-secondary-500/20`}
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
                placeholder="Create a strong password"
                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all ${isDark ? 'bg-neutral-700/50 border-neutral-600 text-white placeholder-neutral-400 focus:border-secondary-500 focus:bg-neutral-700' : 'bg-white/50 border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-secondary-500 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-secondary-500/20`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-3.5 transition-colors ${isDark ? 'text-neutral-400 hover:text-neutral-300' : 'text-neutral-600 hover:text-neutral-700'}`}
                disabled={loading}
              >
                {showPassword ? <Icons.Eye className="w-5 h-5" /> : <Icons.EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Re-enter your password"
              className={`w-full px-4 py-3 rounded-lg border transition-all ${isDark ? 'bg-neutral-700/50 border-neutral-600 text-white placeholder-neutral-400 focus:border-secondary-500 focus:bg-neutral-700' : 'bg-white/50 border-neutral-300 text-neutral-900 placeholder-neutral-500 focus:border-secondary-500 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-secondary-500/20`}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'} bg-gradient-secondary text-white`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <Icons.Plus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>
        <div className={`mt-6 pt-6 border-t ${isDark ? 'border-neutral-700' : 'border-neutral-300'} text-center`}>
          <p className={`text-sm mb-4 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Already have an account?
          </p>
          <button
            onClick={onSwitchToLogin}
            className={`w-full py-2 rounded-lg font-semibold transition-all ${isDark ? 'bg-neutral-700/50 hover:bg-neutral-700 text-secondary-400' : 'bg-secondary-100 hover:bg-secondary-200 text-secondary-600'}`}
          >
            Sign In
          </button>
        </div>
        <div className={`mt-4 pt-4 border-t ${isDark ? 'border-neutral-700' : 'border-neutral-300'}`}>
          <p className={`text-xs font-medium mb-3 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>What you get:</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Icons.Check className={`w-4 h-4 ${isDark ? 'text-secondary-400' : 'text-secondary-600'}`} />
              <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>Instant account activation</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.Check className={`w-4 h-4 ${isDark ? 'text-secondary-400' : 'text-secondary-600'}`} />
              <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>Secure banking features</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;

