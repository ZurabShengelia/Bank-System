import React, { useState, useEffect } from 'react';
import { LockIcon, CheckIcon, TrendingUpIcon, WalletIcon, CalendarIcon, HistoryIcon } from './Icons';
import { getProfileStats, updateLastLogin, getProfilePicture, saveProfilePicture, removeProfilePicture, changePassword } from '../utils/storage';
const Profile = ({ username, isDark, onChangePassword, addToast }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  useEffect(() => {
    const profileStats = getProfileStats(username);
    setStats(profileStats);
    updateLastLogin(username);
    const picture = getProfilePicture(username);
    setProfilePicture(picture);
  }, [username]);
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSaveProfilePicture = () => {
    if (profilePreview) {
      const result = saveProfilePicture(username, profilePreview);
      if (result.success) {
        setProfilePicture(profilePreview);
        setProfilePreview(null);
        setShowProfileUpload(false);
        setMessage('Profile picture updated successfully!');
        setTimeout(() => setMessage(''), 2000);
      }
    }
  };
  const handleRemoveProfilePicture = () => {
    const result = removeProfilePicture(username);
    if (result.success) {
      setProfilePicture(null);
      setProfilePreview(null);
      setShowProfileUpload(false);
      setMessage('Profile picture removed!');
      setTimeout(() => setMessage(''), 2000);
    }
  };
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setMessage('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      setMessage('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    const result = changePassword(username, currentPassword, newPassword);
    if (result.success) {
      addToast(result.message, 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('');
      setShowChangePassword(false);
    } else {
      setMessage(result.error);
      addToast(result.error, 'error');
    }
  };
  if (!stats) {
    return (
      <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        <p>Loading profile...</p>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <div className={`rounded-2xl shadow-xl p-8 ${isDark ? 'bg-gray-800' : 'bg-white'} border-2 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className={`w-32 h-32 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} border-4 ${isDark ? 'border-blue-500' : 'border-blue-300'} flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105`}>
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-4xl">👤</div>
              )}
            </div>
            <button
              onClick={() => setShowProfileUpload(!showProfileUpload)}
              className={`absolute bottom-0 right-0 p-2 rounded-full transition-all ${
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              title="Edit profile picture"
            >
              📷
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {username}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <CheckIcon size={12} className="text-green-500" />
              <p className="text-xs text-green-600 font-semibold">Active Account</p>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Member since {stats ? new Date(stats.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        {showProfileUpload && (
          <div className={`mt-6 pt-6 border-t-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {profilePicture ? 'Change Profile Picture' : 'Add Profile Picture'}
            </h3>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
              isDark
                ? 'border-gray-600 hover:border-blue-500 bg-gray-700/50'
                : 'border-gray-300 hover:border-blue-500 bg-gray-50'
            }`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
                id="profilePictureInputProfile"
              />
              <label htmlFor="profilePictureInputProfile" className="cursor-pointer">
                {profilePreview ? (
                  <div className="space-y-2">
                    <img src={profilePreview} alt="Profile Preview" className="w-32 h-32 mx-auto rounded-lg object-cover" />
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Click to change</p>
                  </div>
                ) : (
                  <div>
                    <p className={`text-3xl mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>📸</p>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Click to upload new profile picture
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {profilePreview && (
                <button
                  onClick={handleSaveProfilePicture}
                  className="py-2 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg"
                >
                  ✓ Save Picture
                </button>
              )}
              {(profilePreview || profilePicture) && (
                <button
                  onClick={profilePreview ? () => { setProfilePreview(null); } : handleRemoveProfilePicture}
                  className={`py-2 px-4 font-semibold rounded-lg transition-all ${
                    isDark
                      ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  ✕ {profilePreview ? 'Cancel' : 'Remove'}
                </button>
              )}
              {!profilePreview && (
                <button
                  onClick={() => setShowProfileUpload(false)}
                  className={`py-2 px-4 font-semibold rounded-lg transition-all col-span-${profilePreview ? '1' : '2'} ${
                    isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-green-50'} border-2 ${isDark ? 'border-gray-700' : 'border-green-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Total Deposits</h3>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-green-900' : 'bg-green-100'}`}>
              <TrendingUpIcon size={14} className="text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">${stats.totalDeposits.toFixed(2)}</p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stats.depositCount} transactions</p>
        </div>
        <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-red-50'} border-2 ${isDark ? 'border-gray-700' : 'border-red-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Total Withdrawals</h3>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-red-900' : 'bg-red-100'}`}>
              <TrendingUpIcon size={14} className="text-red-500 transform rotate-180" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">${stats.totalWithdrawals.toFixed(2)}</p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stats.withdrawalCount} transactions</p>
        </div>
        <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-blue-50'} border-2 ${isDark ? 'border-gray-700' : 'border-blue-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Current Balance</h3>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
              <WalletIcon size={14} className="text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">${stats.balance.toFixed(2)}</p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Available to spend</p>
        </div>
        <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-purple-50'} border-2 ${isDark ? 'border-gray-700' : 'border-purple-200'}`}>
          <p className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Average Deposit</p>
          <p className="text-2xl font-bold text-purple-600">${stats.averageDeposit.toFixed(2)}</p>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Per transaction</p>
        </div>
        <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-orange-50'} border-2 ${isDark ? 'border-gray-700' : 'border-orange-200'}`}>
          <p className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Average Withdrawal</p>
          <p className="text-2xl font-bold text-orange-600">${stats.averageWithdrawal.toFixed(2)}</p>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Per transaction</p>
        </div>
        <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-indigo-50'} border-2 ${isDark ? 'border-gray-700' : 'border-indigo-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Member Since</p>
            <CalendarIcon size={12} className="text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-indigo-600">{new Date(stats.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3 mb-4">
          <HistoryIcon size={12} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Last Activity</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Last Transaction</p>
            <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stats.lastTransaction ? new Date(stats.lastTransaction).toLocaleString() : 'No transactions yet'}
            </p>
          </div>
          <div>
            <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Last Login</p>
            <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stats.lastLogin ? new Date(stats.lastLogin).toLocaleString() : 'Just now'}
            </p>
          </div>
        </div>
      </div>
      <div className={`rounded-2xl shadow-xl p-8 ${isDark ? 'bg-gray-800' : 'bg-white'} border-2 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
            <LockIcon size={16} className={isDark ? 'text-blue-300' : 'text-blue-600'} />
          </div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Security</h2>
        </div>
        <button
          onClick={() => setShowChangePassword(!showChangePassword)}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            showChangePassword
              ? isDark
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-700'
              : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg'
          }`}
        >
          {showChangePassword ? '✕ Cancel' : <>
            <LockIcon size={12} />
            <span>Change Password</span>
          </>}
        </button>
        {showChangePassword && (
          <form onSubmit={handleChangePassword} className={`mt-6 pt-6 border-t-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Update Your Password</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>
            {message && (
              <div className={`p-4 rounded-lg mb-6 text-sm font-medium flex items-center gap-2 ${
                message.includes('not') || message.includes('must')
                  ? isDark
                    ? 'bg-red-900/30 text-red-300 border border-red-800'
                    : 'bg-red-100 text-red-700 border border-red-300'
                  : isDark
                  ? 'bg-green-900/30 text-green-300 border border-green-800'
                  : 'bg-green-100 text-green-700 border border-green-300'
              }`}>
                <CheckIcon size={12} />
                {message}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all hover:shadow-lg"
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default Profile;

