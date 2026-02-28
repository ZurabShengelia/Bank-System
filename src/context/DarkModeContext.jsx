import React, { createContext, useContext, useState, useEffect } from 'react';
const DarkModeContext = createContext();
export const DarkModeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('bankSystemDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  useEffect(() => {
    localStorage.setItem('bankSystemDarkMode', JSON.stringify(isDark));
  }, [isDark]);
  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };
  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};

