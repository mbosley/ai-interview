import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaHome, 
  FaMoneyBillWave, 
  FaUser, 
  FaCog,
  FaDollarSign,
  FaUserCircle,
  FaRegMoneyBillAlt
} from 'react-icons/fa';
import { IoHomeSharp, IoSettingsSharp, IoWallet } from 'react-icons/io5';

/**
 * Mobile-friendly bottom navigation component.
 * 
 * @param {Object} props
 * @param {string} props.activeTab - The currently active tab
 * @param {Function} props.navigate - Navigation function
 */
const MobileBottomNavigation = ({ activeTab, navigate }) => {
  const { t } = useTranslation();

  // Navigation tabs config
  const tabs = [
    { 
      id: 'dashboard', 
      label: t('home'), 
      icon: <IoHomeSharp size={24} className="w-6 h-6" />,
      action: () => navigate('dashboard')
    },
    { 
      id: 'earnings-details', 
      label: t('earnings'), 
      icon: <IoWallet size={24} className="w-6 h-6" />,
      action: () => navigate('earnings-details')
    },
    { 
      id: 'profile', 
      label: t('profile'), 
      icon: <FaUserCircle size={24} className="w-6 h-6" />,
      action: () => navigate('profile')
    },
    { 
      id: 'settings', 
      label: t('settings'), 
      icon: <IoSettingsSharp size={24} className="w-6 h-6" />,
      action: () => navigate('settings')
    }
  ];

  return (
    <div className="mobile-bottom-navigation">
      <div className="flex justify-around items-center px-2 py-3 bg-white border-t border-gray-100">
        {/* Home tab */}
        <button
          onClick={() => navigate('dashboard')}
          className={`flex flex-col items-center justify-center relative py-1 px-3`}
          type="button"
        >
          <div className="relative flex items-center justify-center mb-1">
            <IoHomeSharp size={20} className={activeTab === 'dashboard' ? 'text-black' : 'text-gray-400'} />
          </div>
          <span className={`text-xs ${activeTab === 'dashboard' ? 'text-black' : 'text-gray-400'}`}>
            {t('home')}
          </span>
          {activeTab === 'dashboard' && (
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-5 h-0.5 bg-black" />
          )}
        </button>
        
        {/* Earnings tab */}
        <button
          onClick={() => navigate('earnings-details')}
          className={`flex flex-col items-center justify-center relative py-1 px-3`}
          type="button"
        >
          <div className="relative flex items-center justify-center mb-1">
            <IoWallet size={20} className={activeTab === 'earnings-details' ? 'text-black' : 'text-gray-400'} />
          </div>
          <span className={`text-xs ${activeTab === 'earnings-details' ? 'text-black' : 'text-gray-400'}`}>
            {t('earnings')}
          </span>
          {activeTab === 'earnings-details' && (
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-5 h-0.5 bg-black" />
          )}
        </button>
        
        {/* Profile tab */}
        <button
          onClick={() => navigate('profile')}
          className={`flex flex-col items-center justify-center relative py-1 px-3`}
          type="button"
        >
          <div className="relative flex items-center justify-center mb-1">
            <FaUserCircle size={20} className={activeTab === 'profile' ? 'text-black' : 'text-gray-400'} />
            {activeTab !== 'profile' && (
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-black rounded-full"></span>
            )}
          </div>
          <span className={`text-xs ${activeTab === 'profile' ? 'text-black' : 'text-gray-400'}`}>
            {t('profile')}
          </span>
          {activeTab === 'profile' && (
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-5 h-0.5 bg-black" />
          )}
        </button>
        
        {/* Settings tab */}
        <button
          onClick={() => navigate('settings')}
          className={`flex flex-col items-center justify-center relative py-1 px-3`}
          type="button"
        >
          <div className="relative flex items-center justify-center mb-1">
            <IoSettingsSharp size={20} className={activeTab === 'settings' ? 'text-black' : 'text-gray-400'} />
          </div>
          <span className={`text-xs ${activeTab === 'settings' ? 'text-black' : 'text-gray-400'}`}>
            {t('settings')}
          </span>
          {activeTab === 'settings' && (
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-5 h-0.5 bg-black" />
          )}
        </button>
      </div>
      
      {/* Safe area spacer for iOS devices */}
      <div className="h-6 bg-white"></div>
    </div>
  );
};

export default MobileBottomNavigation;