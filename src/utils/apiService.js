import * as storageLib from './storage';

const API_DELAY_MIN = 800;
const API_DELAY_MAX = 1500;
const FAILURE_RATE = 0.05;

const simulateDelay = () => {
  const delay = Math.random() * (API_DELAY_MAX - API_DELAY_MIN) + API_DELAY_MIN;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

const simulateFailure = () => {
  return Math.random() < FAILURE_RATE;
};

const apiRequest = async (fn) => {
  try {
    await simulateDelay();
    if (simulateFailure()) {
      throw new Error('Network error - please try again');
    }
    return await fn();
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An error occurred',
      data: null,
    };
  }
};

export const apiRegister = (username, password, email) =>
  apiRequest(() => {
    const result = storageLib.registerUser(username, password, email);
    return { success: result.success, data: result, message: result.message };
  });
export const apiLogin = (username, password) =>
  apiRequest(() => {
    const result = storageLib.loginUser(username, password);
    return { success: result.success, data: result, message: result.message };
  });

export const apiGetUser = (username) =>
  apiRequest(() => {
    const user = storageLib.getUser(username);
    return { success: true, data: user };
  });
export const apiGetTransactions = (username) =>
  apiRequest(() => {
    const transactions = storageLib.getUserTransactions(username);
    return { success: true, data: transactions };
  });

export const apiDeposit = (username, amount) =>
  apiRequest(() => {
    const result = storageLib.depositMoney(username, amount);
    return { success: result.success, data: result, message: result.message };
  });
export const apiWithdraw = (username, amount) =>
  apiRequest(() => {
    const result = storageLib.withdrawMoney(username, amount);
    return { success: result.success, data: result, message: result.message };
  });
export const apiTransfer = (fromUsername, toUsername, amount) =>
  apiRequest(() => {
    const result = storageLib.transferMoney(fromUsername, toUsername, amount);
    return { success: result.success, data: result, message: result.message };
  });

export const apiCreateSavingsGoal = (username, goalName, targetAmount, deadline) =>
  apiRequest(() => {
    const result = storageLib.createSavingsGoal(username, goalName, targetAmount, deadline);
    return { success: result.success, data: result, message: result.message };
  });
export const apiAddFundsToGoal = (username, goalId, amount) =>
  apiRequest(() => {
    const result = storageLib.addFundsToGoal(username, goalId, amount);
    return { success: result.success, data: result, message: result.message };
  });
export const apiGetSavingsGoals = (username) =>
  apiRequest(() => {
    const goals = storageLib.getSavingsGoals(username);
    return { success: true, data: goals };
  });

export const apiGetDailyLimits = (username) =>
  apiRequest(() => {
    const limits = storageLib.getDailyLimits(username);
    return { success: true, data: limits };
  });

export const apiGetNotifications = (username) =>
  apiRequest(() => {
    const notifications = storageLib.getNotifications(username);
    return { success: true, data: notifications };
  });
export const apiMarkNotificationAsRead = (username, notificationId) =>
  apiRequest(() => {
    storageLib.markNotificationAsRead(username, notificationId);
    return { success: true, data: null };
  });

export const apiGetCreditScore = (username) =>
  apiRequest(() => {
    const score = storageLib.getCreditScore(username);
    return { success: true, data: score };
  });

export const apiGetMonthlyStats = (username) =>
  apiRequest(() => {
    const stats = storageLib.getMonthlyStats(username);
    return { success: true, data: stats };
  });
export const apiGetSpendingByCategory = (username) =>
  apiRequest(() => {
    const spending = storageLib.getSpendingByCategory(username);
    return { success: true, data: spending };
  });

export const apiUndoTransaction = (username, transactionId) =>
  apiRequest(() => {
    const result = storageLib.undoTransaction(username, transactionId);
    return { success: result.success, data: result, message: result.message };
  });

export const apiUploadProfileImage = (username, imageData) =>
  apiRequest(() => {
    const result = storageLib.uploadProfileImage(username, imageData);
    return { success: result.success, data: result, message: result.message };
  });

export const apiCalculateInterest = (username) =>
  apiRequest(() => {
    const result = storageLib.calculateInterest(username);
    return { success: result.success, data: result, message: result.message };
  });

