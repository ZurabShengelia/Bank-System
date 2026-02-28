const DB_KEY = 'bankSystemDB';
const initializeDB = () => {
  const existingDB = localStorage.getItem(DB_KEY);
  if (existingDB) return JSON.parse(existingDB);
  const newDB = {
    users: {},
    sessions: null,
    transactions: [],
    savingsGoals: {},
    notifications: {},
    appMetadata: {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    },
  };
  localStorage.setItem(DB_KEY, JSON.stringify(newDB));
  return newDB;
};
export const getDB = () => {
  return JSON.parse(localStorage.getItem(DB_KEY)) || initializeDB();
};
export const saveDB = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const initializeUser = (username) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username,
    password: '',
    email: '',
    iban: generateIBAN(),
    balance: 0,
    creditScore: 750,
    profileImage: null,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    transactions: [],
    savingsGoals: [],
    dailyLimits: {
      depositLimit: 10000,
      withdrawLimit: 5000,
      depositUsed: 0,
      withdrawUsed: 0,
      lastResetDate: today.toISOString(),
    },
    notifications: [],
    accountMetadata: {
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalTransfers: 0,
      savingsEarned: 0,
      interestAccumulated: 0,
    },
  };
};
const generateIBAN = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let iban = 'DE';
  for (let i = 0; i < 20; i++) {
    if (i < 2) {
      iban += Math.floor(Math.random() * 10);
    } else {
      iban += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return iban;
};
export const getUser = (username) => {
  const db = getDB();
  return db.users[username] || null;
};
export const getAllUsers = () => {
  const db = getDB();
  return db.users;
};
export const saveUser = (username, userData) => {
  const db = getDB();
  db.users[username] = userData;
  saveDB(db);
};
export const registerUser = (username, password, email = '') => {
  const db = getDB();
  if (db.users[username]) {
    return { success: false, error: 'Username already exists' };
  }
  const newUser = initializeUser(username);
  newUser.password = password;
  newUser.email = email;
  newUser.balance = 0;
  db.users[username] = newUser;
  saveDB(db);
  return { success: true, message: 'Registration successful!', user: newUser };
};
export const loginUser = (username, password) => {
  const db = getDB();
  if (!db.users[username] || db.users[username].password !== password) {
    return { success: false, error: 'Invalid credentials' };
  }
  db.users[username].lastLoginAt = new Date().toISOString();
  saveDB(db);
  return { success: true, user: db.users[username] };
};
export const logoutUser = () => {
  const db = getDB();
  db.sessions = null;
  saveDB(db);
  return { success: true };
};
export const changePassword = (username, currentPassword, newPassword) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  if (user.password !== currentPassword) {
    return { success: false, error: 'Current password is incorrect' };
  }
  if (newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters' };
  }
  if (currentPassword === newPassword) {
    return { success: false, error: 'New password must be different from current password' };
  }
  user.password = newPassword;
  saveDB(db);
  return { success: true, message: 'Password has changed successfully' };
};

export const addTransaction = (username, transactionData) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  const transaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username,
    timestamp: new Date().toISOString(),
    status: 'pending',
    ...transactionData,
  };
  db.transactions.push(transaction);
  user.transactions.push(transaction.id);
  saveDB(db);
  return { success: true, transaction };
};
export const updateTransactionStatus = (transactionId, status) => {
  const db = getDB();
  const transaction = db.transactions.find((t) => t.id === transactionId);
  if (!transaction) return { success: false, error: 'Transaction not found' };
  transaction.status = status;
  saveDB(db);
  return { success: true, transaction };
};
export const getUserTransactions = (username) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return [];
  return db.transactions.filter((t) => t.username === username);
};

export const checkAndResetDailyLimits = (username) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastReset = new Date(user.dailyLimits.lastResetDate);
  lastReset.setHours(0, 0, 0, 0);
  if (today > lastReset) {
    user.dailyLimits.depositUsed = 0;
    user.dailyLimits.withdrawUsed = 0;
    user.dailyLimits.lastResetDate = today.toISOString();
    saveDB(db);
  }
  return user.dailyLimits;
};
export const getDailyLimits = (username) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return null;
  checkAndResetDailyLimits(username);
  return {
    depositLimit: user.dailyLimits.depositLimit,
    withdrawLimit: user.dailyLimits.withdrawLimit,
    depositUsed: user.dailyLimits.depositUsed,
    withdrawUsed: user.dailyLimits.withdrawUsed,
    depositRemaining: user.dailyLimits.depositLimit - user.dailyLimits.depositUsed,
    withdrawRemaining: user.dailyLimits.withdrawLimit - user.dailyLimits.withdrawUsed,
  };
};
export const updateDailyLimitUsage = (username, type, amount) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  checkAndResetDailyLimits(username);
  if (type === 'deposit') {
    user.dailyLimits.depositUsed += amount;
  } else if (type === 'withdraw') {
    user.dailyLimits.withdrawUsed += amount;
  }
  saveDB(db);
  return { success: true };
};

export const createSavingsGoal = (username, goalData) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  const goal = {
    id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username,
    createdAt: new Date().toISOString(),
    currentAmount: 0,
    ...goalData,
  };
  user.savingsGoals.push(goal);
  saveDB(db);
  return { success: true, goal };
};
export const addFundsToGoal = (username, goalId, amount) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  if (user.balance < amount) {
    return { success: false, error: 'Insufficient balance' };
  }
  const goal = user.savingsGoals.find((g) => g.id === goalId);
  if (!goal) return { success: false, error: 'Goal not found' };
  if (goal.currentAmount >= goal.target) {
    return { success: false, error: 'Goal is already complete' };
  }
  user.balance -= amount;
  goal.currentAmount += amount;
  const transaction = {
    id: `txn_${Date.now()}`,
    username,
    type: 'savings_deposit',
    goalId,
    goalName: goal.name,
    amount,
    timestamp: new Date().toISOString(),
    status: 'completed',
    category: 'savings',
    description: `Added to savings goal: ${goal.name}`,
    balanceAfter: user.balance,
  };
  db.transactions.push(transaction);
  user.transactions.push(transaction.id);
  if (goal.currentAmount >= goal.target) {
    addNotification(username, {
      title: 'Goal Achieved!',
      message: `You reached your savings goal: ${goal.name}!`,
      type: 'success',
    });
  }
  saveDB(db);
  return { success: true, goal, transaction, newBalance: user.balance };
};
export const getSavingsGoals = (username) => {
  const db = getDB();
  const user = db.users[username];
  return user?.savingsGoals || [];
};
export const deleteSavingsGoal = (username, goalId) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  const goalIndex = user.savingsGoals.findIndex((g) => g.id === goalId);
  if (goalIndex === -1) return { success: false, error: 'Goal not found' };
  const goal = user.savingsGoals[goalIndex];
  const refundAmount = goal.currentAmount || 0;
  user.savingsGoals.splice(goalIndex, 1);
  if (refundAmount > 0) {
    user.balance += refundAmount;
    const transaction = {
      id: `txn_${Date.now()}`,
      username,
      type: 'goal_refund',
      goalName: goal.name,
      amount: refundAmount,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'refund',
      description: `Refund from deleted goal: ${goal.name}`,
      balanceAfter: user.balance,
    };
    db.transactions.push(transaction);
    user.transactions.push(transaction.id);
    addNotification(username, {
      title: 'Goal Deleted - Refund Processed',
      message: `Goal "${goal.name}" deleted. $${refundAmount.toFixed(2)} refunded to your account.`,
      type: 'success',
    });
  }
  saveDB(db);
  return { success: true, message: 'Goal deleted and funds refunded successfully' };
};

export const addNotification = (username, notificationData) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  const notification = {
    id: `notif_${Date.now()}`,
    timestamp: new Date().toISOString(),
    read: false,
    ...notificationData,
  };
  user.notifications.push(notification);
  saveDB(db);
  return { success: true, notification };
};
export const getNotifications = (username) => {
  const db = getDB();
  const user = db.users[username];
  return user?.notifications || [];
};
export const markNotificationAsRead = (username, notificationId) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  const notification = user.notifications.find((n) => n.id === notificationId);
  if (!notification) return { success: false, error: 'Notification not found' };
  notification.read = true;
  saveDB(db);
  return { success: true };
};

export const depositMoney = (username, amount) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  if (amount <= 0) return { success: false, error: 'Invalid amount' };
  checkAndResetDailyLimits(username);
  const limits = user.dailyLimits;
  if (limits.depositUsed + amount > limits.depositLimit) {
    return {
      success: false,
      error: `Daily deposit limit exceeded. Limit: $${limits.depositLimit}, Already used: $${limits.depositUsed}`,
    };
  }
  user.balance += amount;
  limits.depositUsed += amount;
  const transaction = {
    id: `txn_${Date.now()}`,
    username,
    type: 'deposit',
    amount,
    timestamp: new Date().toISOString(),
    status: 'completed',
    category: 'deposit',
    description: 'Bank deposit',
    balanceAfter: user.balance,
  };
  db.transactions.push(transaction);
  user.transactions.push(transaction.id);
  user.accountMetadata.totalDeposits += amount;
  updateCreditScore(username, 'deposit', amount);
  addNotification(username, {
    title: 'Deposit Successful',
    message: `$${amount.toFixed(2)} deposited to your account`,
    type: 'success',
  });
  saveDB(db);
  return { success: true, transaction, newBalance: user.balance };
};
export const withdrawMoney = (username, amount) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  if (amount <= 0) return { success: false, error: 'Invalid amount' };
  if (user.balance < amount) {
    return { success: false, error: 'Insufficient balance' };
  }
  checkAndResetDailyLimits(username);
  const limits = user.dailyLimits;
  if (limits.withdrawUsed + amount > limits.withdrawLimit) {
    return {
      success: false,
      error: `Daily withdrawal limit exceeded. Limit: $${limits.withdrawLimit}, Already used: $${limits.withdrawUsed}`,
    };
  }
  user.balance -= amount;
  limits.withdrawUsed += amount;
  const transaction = {
    id: `txn_${Date.now()}`,
    username,
    type: 'withdraw',
    amount,
    timestamp: new Date().toISOString(),
    status: 'completed',
    category: 'withdraw',
    description: 'Bank withdrawal',
    balanceAfter: user.balance,
  };
  db.transactions.push(transaction);
  user.transactions.push(transaction.id);
  user.accountMetadata.totalWithdrawals += amount;
  updateCreditScore(username, 'withdraw', amount);
  addNotification(username, {
    title: 'Withdrawal Successful',
    message: `$${amount.toFixed(2)} withdrawn from your account`,
    type: 'success',
  });
  saveDB(db);
  return { success: true, transaction, newBalance: user.balance };
};
export const transferMoney = (username, recipientUsernameOrIBAN, amount, description = '') => {
  const db = getDB();
  const sender = db.users[username];
  if (!sender) return { success: false, error: 'Sender not found' };
  if (amount <= 0) return { success: false, error: 'Invalid amount' };
  if (sender.balance < amount) {
    return { success: false, error: 'Insufficient balance' };
  }
  let recipient = db.users[recipientUsernameOrIBAN];
  let recipientUsername = recipientUsernameOrIBAN;
  if (!recipient) {
    const userByIBAN = Object.values(db.users).find((u) => u.iban === recipientUsernameOrIBAN);
    if (userByIBAN) {
      recipient = userByIBAN;
      recipientUsername = userByIBAN.username;
    } else {
      recipient = initializeUser(recipientUsernameOrIBAN);
      db.users[recipientUsernameOrIBAN] = recipient;
      recipientUsername = recipientUsernameOrIBAN;
    }
  }
  if (username === recipientUsername) {
    return { success: false, error: 'Cannot transfer to yourself' };
  }
  sender.balance -= amount;
  recipient.balance += amount;
  const transaction = {
    id: `txn_${Date.now()}`,
    username,
    type: 'transfer',
    recipientUsername,
    amount,
    timestamp: new Date().toISOString(),
    status: 'completed',
    category: 'transfer',
    description: description || `Transfer to ${recipientUsername}`,
    balanceAfter: sender.balance,
  };
  db.transactions.push(transaction);
  sender.transactions.push(transaction.id);
  recipient.transactions.push(transaction.id);
  sender.accountMetadata.totalTransfers += amount;
  updateCreditScore(username, 'transfer', amount);
  addNotification(username, {
    title: 'Transfer Sent',
    message: `$${amount.toFixed(2)} sent to ${recipientUsername}`,
    type: 'info',
  });
  addNotification(recipientUsername, {
    title: 'Transfer Received',
    message: `$${amount.toFixed(2)} received from ${username}`,
    type: 'success',
  });
  saveDB(db);
  return { success: true, transaction, newBalance: sender.balance };
};
export const updateCreditScore = (username, action, amount) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return;
  const scoreChanges = {
    deposit: 5,
    withdraw: -2,
    transfer: Math.min(Math.floor(amount / 100), 20),
  };
  const change = scoreChanges[action] || 0;
  user.creditScore = Math.min(Math.max(user.creditScore + change, 300), 850);
  saveDB(db);
};
export const getCreditScore = (username) => {
  const user = getUser(username);
  return user?.creditScore || 750;
};
export const getMonthlyStats = (username) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return null;
  const transactions = db.transactions.filter((t) => t.username === username);
  const thisMonth = new Date();
  thisMonth.setDate(1);
  return {
    totalIncome: transactions
      .filter((t) => t.type === 'deposit' && new Date(t.timestamp) >= thisMonth)
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpense: transactions
      .filter((t) => t.type === 'withdraw' && new Date(t.timestamp) >= thisMonth)
      .reduce((sum, t) => sum + t.amount, 0),
    totalTransfers: transactions
      .filter((t) => t.type === 'transfer' && new Date(t.timestamp) >= thisMonth)
      .reduce((sum, t) => sum + t.amount, 0),
    transactionCount: transactions.filter((t) => new Date(t.timestamp) >= thisMonth).length,
  };
};
export const getSpendingByCategory = (username) => {
  const db = getDB();
  const transactions = db.transactions.filter((t) => t.username === username);
  const categoryMap = {};
  transactions.forEach((t) => {
    const category = t.category || t.type;
    categoryMap[category] = (categoryMap[category] || 0) + t.amount;
  });
  return categoryMap;
};

export const updateUserProfile = (username, updates) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  Object.assign(user, updates);
  saveDB(db);
  return { success: true, user };
};
export const uploadProfileImage = (username, base64Image) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  user.profileImage = base64Image;
  saveDB(db);
  return { success: true, message: 'Profile picture updated!' };
};
export const removeProfileImage = (username) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  user.profileImage = null;
  saveDB(db);
  return { success: true, message: 'Profile picture removed!' };
};
export const calculateInterest = (username) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  const dailyRate = 0.0003;
  const interestAmount = user.balance * dailyRate;
  user.balance += interestAmount;
  user.accountMetadata.interestAccumulated += interestAmount;
  const transaction = {
    id: `txn_interest_${Date.now()}`,
    username,
    type: 'interest',
    amount: interestAmount,
    timestamp: new Date().toISOString(),
    status: 'completed',
    description: 'Daily interest',
    balanceAfter: user.balance,
  };
  db.transactions.push(transaction);
  user.transactions.push(transaction.id);
  if (interestAmount > 0) {
    addNotification(username, {
      title: 'Interest Earned',
      message: `$${interestAmount.toFixed(2)} interest added to your account`,
      type: 'success',
    });
  }
  saveDB(db);
  return { success: true, interestAmount, newBalance: user.balance };
};
export const undoTransaction = (username, transactionId) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  const transactionIndex = db.transactions.findIndex((t) => t.id === transactionId);
  if (transactionIndex === -1) return { success: false, error: 'Transaction not found' };
  const transaction = db.transactions[transactionIndex];
  if (transaction.status === 'undone') {
    return { success: false, error: 'Transaction has already been undone' };
  }
  if (transaction.type === 'deposit') {
    user.balance -= transaction.amount;
    user.dailyLimits.depositUsed -= transaction.amount;
  } else if (transaction.type === 'withdraw') {
    user.balance += transaction.amount;
    user.dailyLimits.withdrawUsed -= transaction.amount;
  } else if (transaction.type === 'transfer') {
    user.balance += transaction.amount;
    const recipient = db.users[transaction.recipientUsername];
    if (recipient) {
      recipient.balance -= transaction.amount;
    }
  } else if (transaction.type === 'savings_deposit') {
    user.balance += transaction.amount;
    if (transaction.goalId) {
      const goal = user.savingsGoals.find((g) => g.id === transaction.goalId);
      if (goal) {
        goal.currentAmount -= transaction.amount;
      }
    }
  }
  db.transactions.splice(transactionIndex, 1);
  user.transactions = user.transactions.filter((id) => id !== transactionId);
  saveDB(db);
  addNotification(username, {
    title: 'Transaction Undone',
    message: `Transaction of $${transaction.amount.toFixed(2)} has been reversed`,
    type: 'info',
  });
  return { success: true, message: 'Transaction undone and removed successfully' };
};
export const getProfileStats = (username) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return null;
  const transactions = db.transactions.filter((t) => t.username === username);
  const deposits = transactions.filter((t) => t.type === 'deposit');
  const withdrawals = transactions.filter((t) => t.type === 'withdraw');
  const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);
  const averageDeposit = deposits.length > 0 ? totalDeposits / deposits.length : 0;
  const averageWithdrawal = withdrawals.length > 0 ? totalWithdrawals / withdrawals.length : 0;
  const lastTransaction = transactions.length > 0 ? transactions[transactions.length - 1].timestamp : null;
  return {
    username: user.username,
    balance: user.balance || 0,
    creditScore: user.creditScore || 0,
    iban: user.iban,
    totalTransactions: transactions.length,
    totalDeposits: totalDeposits,
    totalWithdrawals: totalWithdrawals,
    depositCount: deposits.length,
    withdrawalCount: withdrawals.length,
    averageDeposit: averageDeposit,
    averageWithdrawal: averageWithdrawal,
    createdAt: user.createdAt,
    lastLogin: user.lastLoginAt,
    lastTransaction: lastTransaction,
    accountAge: new Date(user.createdAt),
  };
};
export const updateLastLogin = (username) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  user.lastLoginAt = new Date().toISOString();
  saveDB(db);
  return { success: true };
};
export const getFilteredTransactions = (username, options = {}) => {
  const db = getDB();
  const transactions = db.transactions.filter((t) => t.username === username);
  let filtered = transactions;
  if (options.type) {
    filtered = filtered.filter((t) => t.type === options.type);
  }
  if (options.startDate && options.endDate) {
    const start = new Date(options.startDate);
    const end = new Date(options.endDate);
    filtered = filtered.filter((t) => {
      const tDate = new Date(t.timestamp);
      return tDate >= start && tDate <= end;
    });
  }
  if (options.minAmount && options.maxAmount) {
    filtered = filtered.filter((t) => t.amount >= options.minAmount && t.amount <= options.maxAmount);
  }
  if (options.limit) {
    filtered = filtered.slice(-options.limit);
  }
  return filtered;
};
export const getFinancialInsights = (username) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return null;
  const transactions = db.transactions.filter((t) => t.username === username);
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const monthlyTransactions = transactions.filter((t) => new Date(t.timestamp) >= thisMonth);
  const deposits = monthlyTransactions
    .filter((t) => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
  const withdrawals = monthlyTransactions
    .filter((t) => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);
  const transfers = monthlyTransactions
    .filter((t) => t.type === 'transfer')
    .reduce((sum, t) => sum + t.amount, 0);
  return {
    monthlyIncome: deposits,
    monthlyExpense: withdrawals,
    monthlyTransfers: transfers,
    netMonthly: deposits - withdrawals - transfers,
    savingsGoalProgress: user.savingsGoals.map((g) => ({
      name: g.name,
      target: g.targetAmount,
      current: g.currentAmount,
      percentage: (g.currentAmount / g.targetAmount) * 100,
    })),
    creditScoreTrend: user.creditScore,
    averageTransaction:
      monthlyTransactions.length > 0
        ? monthlyTransactions.reduce((sum, t) => sum + t.amount, 0) / monthlyTransactions.length
        : 0,
  };
};
export const getProfilePicture = (username) => {
  const user = getUser(username);
  return user?.profileImage || null;
};
export const saveProfilePicture = (username, base64Image) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  user.profileImage = base64Image;
  saveDB(db);
  return { success: true, message: 'Profile picture updated!' };
};
export const removeProfilePicture = (username) => {
  const db = getDB();
  const user = db.users[username];
  if (!user) return { success: false, error: 'User not found' };
  user.profileImage = null;
  saveDB(db);
  return { success: true, message: 'Profile picture removed!' };
};
export const getAllUsernames = () => {
  const db = getDB();
  return Object.keys(db.users);
};
export const getBalance = (username) => {
  const user = getUser(username);
  return user?.balance || 0;
};
export const checkDailyLimit = (username, type, amount) => {
  const limits = getDailyLimits(username);
  if (!limits) {
    return { allowed: false, message: 'Unable to retrieve daily limits' };
  }
  if (type === 'deposit') {
    const remaining = limits.depositLimit - limits.depositUsed;
    if (amount > remaining) {
      return { 
        allowed: false, 
        message: `Daily deposit limit exceeded. Remaining: $${remaining.toFixed(2)}`
      };
    }
    return { allowed: true, message: 'Within daily deposit limit' };
  } else if (type === 'withdraw') {
    const remaining = limits.withdrawLimit - limits.withdrawUsed;
    if (amount > remaining) {
      return { 
        allowed: false, 
        message: `Daily withdrawal limit exceeded. Remaining: $${remaining.toFixed(2)}`
      };
    }
    return { allowed: true, message: 'Within daily withdrawal limit' };
  }
  return { allowed: false, message: 'Invalid transaction type' };
};
export const updateDailyLimits = (username, type, amount) => {
  return updateDailyLimitUsage(username, type, amount);
};
export const undoLastTransaction = (username) => {
  const transactions = getUserTransactions(username);
  if (transactions.length === 0) {
    return { success: false, error: 'No transactions to undo' };
  }
  const lastTransaction = transactions[transactions.length - 1];
  if (!lastTransaction.id) {
    return { success: false, error: 'Invalid transaction' };
  }
  return undoTransaction(username, lastTransaction.id);
};
export const sendMoneyToUser = (fromUsername, toUsername, amount) => {
  return transferMoney(fromUsername, toUsername, amount);
};
export const addFundsToSavingsGoal = (username, goalId, amount) => {
  return addFundsToGoal(username, goalId, amount);
};

