import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSettings } from '../context/AppSettingsContext';

const SettingsScreen = ({ navigate }) => {
  const { t } = useTranslation();
  const { language, setLanguage, theme, setTheme } = useAppSettings();
  
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
        <div className="text-sm text-gray-500 font-light">{t('settings')}</div>
        <div className="w-6"></div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">App Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Language</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">Theme</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">Text Size</label>
              <div className="flex items-center">
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
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">New interview opportunities</span>
              <div 
                className={`w-12 h-6 rounded-full flex items-center ${notifications.interviews ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-200`}
                onClick={() => handleToggle('interviews', 'notifications')}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${notifications.interviews ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Payment confirmations</span>
              <div 
                className={`w-12 h-6 rounded-full flex items-center ${notifications.payments ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-200`}
                onClick={() => handleToggle('payments', 'notifications')}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${notifications.payments ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Interview reminders</span>
              <div 
                className={`w-12 h-6 rounded-full flex items-center ${notifications.reminders ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-200`}
                onClick={() => handleToggle('reminders', 'notifications')}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${notifications.reminders ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Data anonymization</span>
              <div 
                className={`w-12 h-6 rounded-full flex items-center ${privacySettings.dataAnonymization ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-200`}
                onClick={() => handleToggle('dataAnonymization', 'privacy')}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${privacySettings.dataAnonymization ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Location sharing</span>
              <div 
                className={`w-12 h-6 rounded-full flex items-center ${privacySettings.locationSharing ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-200`}
                onClick={() => handleToggle('locationSharing', 'privacy')}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${privacySettings.locationSharing ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Analytics</span>
              <div 
                className={`w-12 h-6 rounded-full flex items-center ${privacySettings.analytics ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-200`}
                onClick={() => handleToggle('analytics', 'privacy')}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${privacySettings.analytics ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">About</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-700">Version 1.0.4</p>
            </div>
            
            <div className="space-y-2">
              <button className="w-full text-left text-sm text-blue-600">Terms of Service</button>
              <button className="w-full text-left text-sm text-blue-600">Privacy Policy</button>
              <button className="w-full text-left text-sm text-blue-600">Contact Support</button>
            </div>
            
            <button className="w-full text-red-600 text-sm py-2 mt-4">Log Out</button>
          </div>
        </div>
      </div>
      
      <div className="mt-auto border-t border-gray-100">
        <div className="flex justify-around px-2 py-4">
          <button className="flex flex-col items-center" onClick={() => navigate('dashboard')}>
            <div className="w-6 h-6 mb-1 text-gray-400">⌂</div>
            <span className="text-xs text-gray-400">{t('home')}</span>
          </button>
          <button className="flex flex-col items-center" onClick={() => navigate('earnings-details')}>
            <div className="w-6 h-6 mb-1 text-gray-400">$</div>
            <span className="text-xs text-gray-400">{t('earnings')}</span>
          </button>
          <button className="flex flex-col items-center" onClick={() => navigate('profile')}>
            <div className="w-6 h-6 mb-1 text-gray-400">★</div>
            <span className="text-xs text-gray-400">{t('profile')}</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="w-6 h-6 border-b-2 border-black mb-1">⚙️</div>
            <span className="text-xs text-gray-900">{t('settings')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
