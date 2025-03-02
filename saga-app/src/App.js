import React, { useState, useEffect } from 'react';
import './index.css';

// Import context providers
import { UserProvider } from './context/UserContext';
import { AppSettingsProvider } from './context/AppSettingsContext';
import { useAppSettings } from './context/AppSettingsContext';
import { useTranslation } from 'react-i18next';

// Screens
import WelcomeScreen from './screens/WelcomeScreen';
import DashboardScreen from './screens/DashboardScreen';
import InterviewScreen from './screens/InterviewScreen';
import InterviewCompletionScreen from './screens/InterviewCompletionScreen';
import EarningsDetailsScreen from './screens/EarningsDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HowItWorksScreen from './screens/HowItWorksScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Common components
import OfflineMessage from './components/common/OfflineMessage';
import ConsentDialog from './components/common/ConsentDialog';
import Tutorial from './components/common/Tutorial';

// Main app wrapper
const MainApp = () => {
  const { 
    language, theme, isOnline, showTutorial, 
    setShowTutorial, consented, setConsented 
  } = useAppSettings();
  const { i18n } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [interviewType, setInterviewType] = useState('');

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const navigateTo = (screen, data) => {
    setCurrentScreen(screen);
    if (data && data.interviewType) {
      setInterviewType(data.interviewType);
    }
    
    // Show tutorial on first dashboard visit
    if (screen === 'dashboard' && !showTutorial && consented) {
      setShowTutorial(true);
    }
  };

  return (
	<div className={`w-full max-w-md mx-auto min-h-[640px] h-auto overflow-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {!consented && <ConsentDialog onConsent={() => setConsented(true)} />}
      
      <OfflineMessage isOnline={isOnline} />
      
      {showTutorial && currentScreen === 'dashboard' && (
        <Tutorial onComplete={() => setShowTutorial(false)} />
      )}
      
      {currentScreen === 'welcome' && <WelcomeScreen navigate={navigateTo} />}
      {currentScreen === 'dashboard' && <DashboardScreen navigate={navigateTo} />}
      {currentScreen === 'interview' && <InterviewScreen navigate={navigateTo} interviewType={interviewType} />}
      {currentScreen === 'interview-complete' && <InterviewCompletionScreen navigate={navigateTo} interviewType={interviewType} />}
      {currentScreen === 'earnings-details' && <EarningsDetailsScreen navigate={navigateTo} />}
      {currentScreen === 'profile' && <ProfileScreen navigate={navigateTo} />}
      {currentScreen === 'onboarding' && <OnboardingScreen navigate={navigateTo} />}
      {currentScreen === 'how-it-works' && <HowItWorksScreen navigate={navigateTo} />}
      {currentScreen === 'notifications' && <NotificationsScreen navigate={navigateTo} />}
      {currentScreen === 'settings' && <SettingsScreen navigate={navigateTo} />}
    </div>
  );
};

const App = () => {
  return (
    <AppSettingsProvider>
      <UserProvider>
        <MainApp />
      </UserProvider>
    </AppSettingsProvider>
  );
};

export default App;
