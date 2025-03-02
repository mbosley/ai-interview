import React, { useState, useEffect } from 'react';
import './index.css';
import './components/common/MobileFrame.css';
import { useUser } from './context/UserContext';

// Import context providers
import { UserProvider } from './context/UserContext';
import { AppSettingsProvider } from './context/AppSettingsContext';
import { useAppSettings } from './context/AppSettingsContext';
import { useTranslation } from 'react-i18next';

// Screens
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
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
import StatusBar from './components/common/StatusBar';

// Main app wrapper
const MainApp = () => {
  const { 
    language, theme, isOnline, showTutorial, 
    setShowTutorial, consented, setConsented 
  } = useAppSettings();
  const { i18n } = useTranslation();
  const { isAuthenticated, userData } = useUser();
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [interviewType, setInterviewType] = useState('');
  
  // TEMPORARILY DISABLED AUTH CHECK FOR DEBUGGING
  // This allows access to all screens without authentication
  /*
  useEffect(() => {
    const protectedScreens = [
      'dashboard', 'interview', 'interview-complete', 
      'earnings-details', 'profile', 'notifications', 'settings'
    ];
    
    if (!isAuthenticated && protectedScreens.includes(currentScreen)) {
      setCurrentScreen('welcome');
    }
  }, [isAuthenticated, currentScreen]);
  */

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const navigateTo = (screen, data) => {
    setCurrentScreen(screen);
    if (data && data.interviewType) {
      setInterviewType(data.interviewType);
    }
    
    // Disable tutorial functionality
    if (showTutorial) {
      setShowTutorial(false);
    }
    
    // Scroll to top when navigating to a new screen
    document.querySelector('.mobile-app-content')?.scrollTo(0, 0);
  };

  return (
    <div className="mobile-app-content">
      <div className={`h-full ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        {!consented && <ConsentDialog onConsent={() => setConsented(true)} />}
        
        <OfflineMessage isOnline={isOnline} />
        
        {showTutorial && currentScreen === 'dashboard' && (
          <Tutorial onComplete={() => setShowTutorial(false)} />
        )}
        
        {currentScreen === 'welcome' && <WelcomeScreen navigate={navigateTo} />}
        {currentScreen === 'login' && <LoginScreen navigate={navigateTo} />}
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
    </div>
  );
};

const App = () => {
  return (
    <AppSettingsProvider>
      <UserProvider>
        <div className="app-container">
          <div className="mobile-frame">
            <div className="mobile-frame-top">
              <div className="mobile-frame-notch">
                <div className="mobile-frame-notch-left"></div>
                <div className="mobile-frame-notch-right"></div>
                <div className="mobile-frame-camera"></div>
                <div className="mobile-frame-truedepth"></div>
                <div className="mobile-frame-speaker"></div>
              </div>
              {/* Status bar is positioned here, outside the scrollable area */}
              <StatusBar />
            </div>
            <div className="mobile-frame-body">
              <MainApp />
            </div>
            <div className="mobile-frame-chin"></div>
            <div className="mobile-frame-home-button"></div>
          </div>
        </div>
      </UserProvider>
    </AppSettingsProvider>
  );
};

export default App;