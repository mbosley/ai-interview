import React, { createContext, useState, useContext, useEffect } from 'react';

const AppSettingsContext = createContext();

export const AppSettingsProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [isOnline, setIsOnline] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false); // Always keep this false
  const [consented, setConsented] = useState(false);
  
  // Online status detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  return (
    <AppSettingsContext.Provider value={{ 
      language, 
      setLanguage, 
      theme, 
      setTheme, 
      isOnline, 
      showTutorial, 
      setShowTutorial,
      consented,
      setConsented
    }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => useContext(AppSettingsContext);
