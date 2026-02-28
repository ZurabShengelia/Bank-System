const SIMULATED_DELAY_MIN = 800;
const SIMULATED_DELAY_MAX = 1500;
const FAILURE_RATE = 0.05;
const simulateDelay = () => {
  return new Promise((resolve) => {
    const delay =
      Math.random() * (SIMULATED_DELAY_MAX - SIMULATED_DELAY_MIN) +
      SIMULATED_DELAY_MIN;
    setTimeout(resolve, delay);
  });
};
const simulateFailure = () => {
  return Math.random() < FAILURE_RATE;
};
const apiRequest = async (operation, operationFn) => {
  try {

    await simulateDelay();

    if (simulateFailure()) {
      throw new Error(
        'Network error: Connection failed. Please try again.'
      );
    }

    const result = await operationFn();
    return {
      success: result.success !== false,
      data: result,
      error: null,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

export const apiRegister = (username, password, email) => {
  return apiRequest('register', async () => {
    const { registerUser } = await import('../utils/storage');
    return registerUser(username, password, email);
  });
};
export const apiLogin = (username, password) => {
  return apiRequest('login', async () => {
    const { loginUser } = await import('../utils/storage');
    return loginUser(username, password);
  });
};
export const apiLogout = () => {
  return apiRequest('logout', async () => {
    const { logoutUser } = await import('../utils/storage');
    return logoutUser();
  });
};

export const apiDeposit = (username, amount) => {
  return apiRequest('deposit', async () => {
    const { depositMoney } = await import('../utils/storage');
    return depositMoney(username, amount);
  });
};
export const apiWithdraw = (username, amount) => {
  return apiRequest('withdraw', async () => {
    const { withdrawMoney } = await import('../utils/storage');
    return withdrawMoney(username, amount);
  });
};
export const apiTransfer = (
  username,
  recipientUsernameOrIBAN,
  amount,
  description = ''
) => {
  return apiRequest('transfer', async () => {
    const { transferMoney } = await import('../utils/storage');
    return transferMoney(username, recipientUsernameOrIBAN, amount, description);
  });
};

export const apiCreateSavingsGoal = (username, goalData) => {
  return apiRequest('createSavingsGoal', async () => {
    const { createSavingsGoal } = await import('../utils/storage');
    return createSavingsGoal(username, goalData);
  });
};
export const apiAddFundsToGoal = (username, goalId, amount) => {
  return apiRequest('addFundsToGoal', async () => {
    const { addFundsToGoal } = await import('../utils/storage');
    return addFundsToGoal(username, goalId, amount);
  });
};
export const apiGetSavingsGoals = async (username) => {
  return apiRequest('getSavingsGoals', async () => {
    const { getSavingsGoals } = await import('../utils/storage');
    const goals = getSavingsGoals(username);
    return { success: true, data: goals };
  });
};

export const apiGetDailyLimits = async (username) => {
  return apiRequest('getDailyLimits', async () => {
    const { getDailyLimits } = await import('../utils/storage');
    const limits = getDailyLimits(username);
    return { success: true, data: limits };
  });
};

export const apiGetUser = async (username) => {
  return apiRequest('getUser', async () => {
    const { getUser } = await import('../utils/storage');
    const user = getUser(username);
    if (!user) throw new Error('User not found');
    return { success: true, data: user };
  });
};
export const apiUpdateProfile = (username, updates) => {
  return apiRequest('updateProfile', async () => {
    const { updateUserProfile } = await import('../utils/storage');
    return updateUserProfile(username, updates);
  });
};
export const apiUploadProfileImage = (username, base64Image) => {
  return apiRequest('uploadProfileImage', async () => {
    const { uploadProfileImage } = await import('../utils/storage');
    return uploadProfileImage(username, base64Image);
  });
};

export const apiGetTransactions = async (username) => {
  return apiRequest('getTransactions', async () => {
    const { getUserTransactions } = await import('../utils/storage');
    const transactions = getUserTransactions(username);
    return { success: true, data: transactions };
  });
};

export const apiGetNotifications = async (username) => {
  return apiRequest('getNotifications', async () => {
    const { getNotifications } = await import('../utils/storage');
    const notifications = getNotifications(username);
    return { success: true, data: notifications };
  });
};

export const apiGetMonthlyStats = async (username) => {
  return apiRequest('getMonthlyStats', async () => {
    const { getMonthlyStats } = await import('../utils/storage');
    const stats = getMonthlyStats(username);
    return { success: true, data: stats };
  });
};
export const apiGetSpendingByCategory = async (username) => {
  return apiRequest('getSpendingByCategory', async () => {
    const { getSpendingByCategory } = await import('../utils/storage');
    const categories = getSpendingByCategory(username);
    return { success: true, data: categories };
  });
};

export const apiGetCreditScore = async (username) => {
  return apiRequest('getCreditScore', async () => {
    const { getCreditScore } = await import('../utils/storage');
    const score = getCreditScore(username);
    return { success: true, data: score };
  });
};

export const apiUndoTransaction = (username, transactionId) => {
  return apiRequest('undoTransaction', async () => {
    const { undoTransaction } = await import('../utils/storage');
    return undoTransaction(username, transactionId);
  });
};

export const apiCalculateInterest = (username) => {
  return apiRequest('calculateInterest', async () => {
    const { calculateInterest } = await import('../utils/storage');
    const interest = calculateInterest(username);
    return { success: true, data: { interest } };
  });
};

