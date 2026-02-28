import { registerUser } from './storage';
export const initializeDemoData = () => {
  const db = JSON.parse(localStorage.getItem('bankSystemDB'));

  if (db && db.users && db.users.demo) {
    return;
  }

  const result = registerUser('demo', 'demo123', 'demo@probank.app');
  if (result.success) {

    const db = JSON.parse(localStorage.getItem('bankSystemDB'));
    db.users.demo.balance = 1000;

    db.transactions.push({
      id: `txn_init_${Date.now()}`,
      username: 'demo',
      type: 'deposit',
      amount: 1000,
      category: 'initial',
      description: 'Initial account balance',
      status: 'completed',
      timestamp: new Date().toISOString(),
      balanceAfter: 1000,
    });
    db.users.demo.transactions.push(`txn_init_${Date.now()}`);

    if (!db.notifications.demo) {
      db.notifications.demo = [];
    }
    db.notifications.demo.push({
      id: `notif_${Date.now()}`,
      title: 'Welcome to ProBank',
      message: 'Your account has been created with $1000 starting balance',
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false,
    });
    localStorage.setItem('bankSystemDB', JSON.stringify(db));
  }
};
export const resetToDefaults = () => {
  localStorage.removeItem('bankSystemDB');
  localStorage.removeItem('currentUser');
  initializeDemoData();
};

