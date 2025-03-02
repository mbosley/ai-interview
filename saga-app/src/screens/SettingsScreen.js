import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSettings } from '../context/AppSettingsContext';
import { useUser } from '../context/UserContext';
import { logoutUser } from '../utils/firebase';
import MobileBottomNavigation from '../components/common/MobileBottomNavigation';

const SettingsScreen = ({ navigate }) => {
  const { t } = useTranslation();
  const { language, setLanguage, theme, setTheme } = useAppSettings();
  const { currentUser } = useUser();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const [notifications, setNotifications] = useState({
    interviews: true,
    payments: true,
    reminders: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    dataAnonymization: true,
    locationSharing: false,
    analytics: true
  });
  
  const handleToggle = (setting, category) => {
    if (category === 'notifications') {
      setNotifications({
        ...notifications,
        [setting]: !notifications[setting]
      });
    } else if (category === 'privacy') {
      setPrivacySettings({
        ...privacySettings,
        [setting]: !privacySettings[setting]
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-[640px] bg-white font-sans">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <button className="text-gray-800" onClick={() => navigate('dashboard')}>
          <span className="mr-1">←</span> {t('dashboard')}
        </button>
        <div className="text-xs uppercase tracking-wider text-gray-500">{t('settings')}</div>
        <div className="w-6"></div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 border-b border-gray-100">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-4">App Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-800 mb-2">Language</label>
              <select 
                className="w-full p-3 border border-gray-200"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-800 mb-2">Theme</label>
              <select 
                className="w-full p-3 border border-gray-200"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-800 mb-2">Text Size</label>
              <div className="flex items-center border border-gray-200 p-2">
                <span className="text-xs mr-2">A</span>
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  defaultValue="2"
                  className="flex-1" 
                />
                <span className="text-lg ml-2">A</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-6 border-b border-gray-100">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Notifications</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">New interview opportunities</span>
              <div 
                className={`w-12 h-6 flex items-center ${notifications.interviews ? 'bg-gray-800' : 'bg-gray-200'} transition-colors duration-200`}
                onClick={() => handleToggle('interviews', 'notifications')}
              >
                <div className={`w-5 h-5 bg-white transform transition-transform duration-200 ${notifications.interviews ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Payment confirmations</span>
              <div 
                className={`w-12 h-6 flex items-center ${notifications.payments ? 'bg-gray-800' : 'bg-gray-200'} transition-colors duration-200`}
                onClick={() => handleToggle('payments', 'notifications')}
              >
                <div className={`w-5 h-5 bg-white transform transition-transform duration-200 ${notifications.payments ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Interview reminders</span>
              <div 
                className={`w-12 h-6 flex items-center ${notifications.reminders ? 'bg-gray-800' : 'bg-gray-200'} transition-colors duration-200`}
                onClick={() => handleToggle('reminders', 'notifications')}
              >
                <div className={`w-5 h-5 bg-white transform transition-transform duration-200 ${notifications.reminders ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-6 border-b border-gray-100">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Privacy</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Data anonymization</span>
              <div 
                className={`w-12 h-6 flex items-center ${privacySettings.dataAnonymization ? 'bg-gray-800' : 'bg-gray-200'} transition-colors duration-200`}
                onClick={() => handleToggle('dataAnonymization', 'privacy')}
              >
                <div className={`w-5 h-5 bg-white transform transition-transform duration-200 ${privacySettings.dataAnonymization ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Location sharing</span>
              <div 
                className={`w-12 h-6 flex items-center ${privacySettings.locationSharing ? 'bg-gray-800' : 'bg-gray-200'} transition-colors duration-200`}
                onClick={() => handleToggle('locationSharing', 'privacy')}
              >
                <div className={`w-5 h-5 bg-white transform transition-transform duration-200 ${privacySettings.locationSharing ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Analytics</span>
              <div 
                className={`w-12 h-6 flex items-center ${privacySettings.analytics ? 'bg-gray-800' : 'bg-gray-200'} transition-colors duration-200`}
                onClick={() => handleToggle('analytics', 'privacy')}
              >
                <div className={`w-5 h-5 bg-white transform transition-transform duration-200 ${privacySettings.analytics ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-6">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-4">About</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-700">Version 1.0.4</p>
            </div>
            
            <div className="space-y-2">
              <button className="w-full text-left text-sm text-gray-800 py-2 border-b border-gray-100">Terms of Service</button>
              <button className="w-full text-left text-sm text-gray-800 py-2 border-b border-gray-100">Privacy Policy</button>
              <button className="w-full text-left text-sm text-gray-800 py-2 border-b border-gray-100">Contact Support</button>
            </div>
            
            <button 
              className="w-full text-red-600 text-sm py-3 mt-4 flex justify-center items-center border border-red-100"
              onClick={async () => {
                if (!currentUser) return;
                
                setIsLoggingOut(true);
                try {
                  await logoutUser();
                  navigate('welcome');
                } catch (error) {
                  console.error('Logout error:', error);
                  alert('Failed to log out. Please try again.');
                } finally {
                  setIsLoggingOut(false);
                }
              }}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging out...
                </>
              ) : (
                'Log Out'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Add padding to the bottom to account for the fixed navigation */}
      <div className="pb-20"></div>
      
      {/* Mobile bottom navigation */}
      <MobileBottomNavigation activeTab="settings" navigate={navigate} />
    </div>
  );
};

export default SettingsScreen;
