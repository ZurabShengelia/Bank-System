# 🏦 Bank System

A modern, feature-rich banking application built with React and styled with Tailwind CSS. Manage your finances with ease through an intuitive dashboard, track transactions, set savings goals, and monitor daily spending limits.

## ✨ Features

- **User Authentication** - Secure login and registration system
- **Dashboard** - Real-time balance overview and financial summary
- **Money Transfer** - Send funds to other users with automatic account creation
- **Transaction History** - Complete transaction log with timestamps and details
- **Savings Tracker** - Create and manage multiple savings goals with progress tracking
- **Daily Limits** - Set and monitor daily spending limits
- **Analytics** - View spending patterns and financial insights with charts
- **Profile Management** - Update user information and change passwords
- **Dark Mode** - Toggle between light and dark themes
- **Undo Functionality** - Reverse transactions instantly
- **Financial Tips** - Get personalized financial advice

## 🛠️ Technologies Used

- **React** (v18.2.0) - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **JavaScript (ES6+)** - Modern JavaScript for application logic
- **Chart.js** - Data visualization and analytics charts
- **localStorage** - Client-side data persistence

## 📋 Requirements

- Node.js (v14 or higher)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/bank-system.git
   cd bank-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
bank-system/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── MoneyTransfer.jsx
│   │   ├── SavingsTracker.jsx
│   │   ├── TransactionList.jsx
│   │   ├── Analytics.jsx
│   │   ├── DailyLimits.jsx
│   │   └── ...
│   ├── context/
│   │   └── DarkModeContext.jsx
│   ├── hooks/
│   │   └── useCustomHooks.js
│   ├── services/
│   │   └── apiService.js
│   ├── utils/
│   │   ├── storage.js
│   │   └── initialization.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🔑 Key Functionality

### Authentication
- Register new accounts with secure password validation
- Login with email/username credentials
- Password change functionality with validation

### Money Management
- Transfer money between users (auto-creates accounts if needed)
- Track all transactions with detailed history
- Undo transactions to revert changes
- Automatic interest calculation on savings goals

### Spending Control
- Set daily spending limits per category
- Real-time limit monitoring
- Alerts when approaching limits

### Savings Goals
- Create multiple savings goals with target amounts
- Track progress toward goals
- Add funds to goals incrementally
- Automatic refunds when deleting goals

### Analytics
- Monthly spending reports
- Category-wise expense breakdown
- Visual charts and graphs
- Financial insights and trends

## 💻 Getting Started

1. **Create an account** by clicking "Register"
2. **Log in** with your credentials
3. **View your dashboard** to see balance and recent transactions
4. **Transfer money** to other users
5. **Set savings goals** and track progress
6. **Monitor daily limits** to control spending
7. **Check analytics** for financial insights

## 🎨 Customization

### Tailwind CSS Configuration
Modify `tailwind.config.js` to customize colors, fonts, and other design tokens.

### Theme
Toggle between light and dark modes using the theme switcher in the application.

## 🔒 Data Storage

This application uses browser `localStorage` for data persistence. All user data is stored locally on your device.

**Note:** This is a demonstration application. For production use, implement a secure backend API with proper authentication and database.

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Bug Reports

If you find any bugs, please create an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using React and Tailwind CSS**
