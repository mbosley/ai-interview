import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import SupportChat from '../components/common/SupportChat';

const DashboardScreen = ({ navigate }) => {
  const { t } = useTranslation();
  const { userData } = useUser();
  const [showSupportChat, setShowSupportChat] = useState(false);
  
  return (
    <div className="flex flex-col min-h-[640px] bg-white font-sans">
      <div className="flex justify-between items-center px-6 py-3 text-sm text-gray-400">
        <div>9:41</div>
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 rounded-sm border border-gray-300"></div>
          <div className="w-4 h-4 rounded-sm border border-gray-300"></div>
          <div className="w-4 h-4 rounded-sm border border-gray-300"></div>
        </div>
      </div>
      <div className="px-6 pt-6 pb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-normal text-gray-900">{t('dashboard')}</h1>
          <div className="relative">
            <button 
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-500"
              onClick={() => navigate('profile')}
            >
              {userData.profilePic ? 
                <img src={userData.profilePic} alt="Profile" className="w-full h-full rounded-full object-cover" /> : 
                userData.name.split(' ').map(name => name[0]).join('')
              }
            </button>
            {userData.notifications > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                onClick={() => navigate('notifications')}
              >
                {userData.notifications}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="px-6 mb-8">
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{t('totalEarnings')}</p>
        <div className="text-3xl font-light text-gray-900 mb-1">${userData.totalEarnings.toFixed(2)}</div>
        <p className="text-sm text-gray-500">${userData.pendingEarnings.toFixed(2)} {t('pendingPayout')}</p>
      </div>
      
      {userData.profileCompleted < 100 && (
        <div className="px-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-blue-800">{t('completeProfile')}</h3>
              <span className="text-sm text-blue-800">{userData.profileCompleted}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${userData.profileCompleted}%` }}></div>
            </div>
            <p className="text-xs text-blue-700 mb-3">{t('profileCompletion')}</p>
            <button 
              className="w-full bg-blue-700 text-white font-normal text-sm py-2 px-4 rounded-md transition-all duration-150 hover:bg-blue-800"
              onClick={() => navigate('profile')}
            >
              {t('completeProfile')}
            </button>
          </div>
        </div>
      )}
      
      <div className="px-6 mb-8">
        <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-4">{t('availableInterviews')}</h2>
        <div className="space-y-3">
          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Values & Ethics</h3>
                <p className="text-sm text-gray-500">15 min interview • $15 compensation</p>
              </div>
              <span className="text-xs uppercase bg-blue-50 text-blue-700 px-2 py-1 rounded">{t('newLabel')}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">Share your perspectives on ethical dilemmas and value systems to help develop more nuanced AI responses.</p>
            <button
              className="w-full bg-black text-white font-normal text-sm py-2.5 px-4 rounded-md transition-all duration-150 hover:bg-gray-900"
              onClick={() => navigate('interview', { interviewType: 'Values & Ethics' })}
            >
              {t('startInterview')}
            </button>
          </div>
          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Decision Making</h3>
                <p className="text-sm text-gray-500">25 min interview • $20 compensation</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Explore your decision-making process in various scenarios to help improve AI reasoning capabilities.</p>
            <button
              className="w-full bg-black text-white font-normal text-sm py-2.5 px-4 rounded-md transition-all duration-150 hover:bg-gray-900"
              onClick={() => navigate('interview', { interviewType: 'Decision Making' })}
            >
              {t('startInterview')}
            </button>
          </div>
          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Cultural Insights</h3>
                <p className="text-sm text-gray-500">30 min interview • $25 compensation</p>
              </div>
              <span className="text-xs uppercase bg-green-50 text-green-700 px-2 py-1 rounded">{t('popularLabel')}</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">Share perspectives from your cultural background to help AI systems become more globally aware and inclusive.</p>
            <button
              className="w-full bg-black text-white font-normal text-sm py-2.5 px-4 rounded-md transition-all duration-150 hover:bg-gray-900"
              onClick={() => navigate('interview', { interviewType: 'Cultural Insights' })}
            >
              {t('startInterview')}
            </button>
          </div>
        </div>
      </div>
      <div className="px-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs uppercase tracking-wider text-gray-400">{t('completedInterviews')}</h2>
          <button className="text-xs text-blue-600" onClick={() => navigate('earnings-details')}>{t('viewAll')}</button>
        </div>
        <div className="space-y-3">
          <div className="border border-gray-100 rounded-md p-3 flex justify-between items-center">
            <div>
              <h3 className="text-base text-gray-800">Initial Assessment</h3>
              <p className="text-xs text-gray-500">Jul 15, 2024 • $15.00</p>
            </div>
            <span className="text-xs uppercase bg-green-50 text-green-700 px-2 py-0.5 rounded">{t('paidLabel')}</span>
          </div>
          <div className="border border-gray-100 rounded-md p-3 flex justify-between items-center">
            <div>
              <h3 className="text-base text-gray-800">Life Experiences</h3>
              <p className="text-xs text-gray-500">Jul 10, 2024 • $25.00</p>
            </div>
            <span className="text-xs uppercase bg-green-50 text-green-700 px-2 py-0.5 rounded">{t('paidLabel')}</span>
          </div>
          <div className="border border-gray-100 rounded-md p-3 flex justify-between items-center">
            <div>
              <h3 className="text-base text-gray-800">Cultural Background</h3>
              <p className="text-xs text-gray-500">Jul 05, 2024 • $15.00</p>
            </div>
            <span className="text-xs uppercase bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">{t('pendingLabel')}</span>
          </div>
        </div>
      </div>
      
      {showSupportChat && <SupportChat onClose={() => setShowSupportChat(false)} />}
      
      <div className="fixed bottom-4 right-4 z-10">
        <button 
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg"
          onClick={() => setShowSupportChat(true)}
        >
          ?
        </button>
      </div>
      
      <div className="mt-auto border-t border-gray-100">
        <div className="flex justify-around px-2 py-4">
          <button className="flex flex-col items-center">
            <div className="w-6 h-6 border-b-2 border-black mb-1"></div>
            <span className="text-xs text-gray-900">{t('home')}</span>
          </button>
          <button className="flex flex-col items-center" onClick={() => navigate('earnings-details')}>
            <div className="w-6 h-6 mb-1 text-gray-400">$</div>
            <span className="text-xs text-gray-400">{t('earnings')}</span>
          </button>
          <button className="flex flex-col items-center" onClick={() => navigate('profile')}>
            <div className="w-6 h-6 mb-1 text-gray-400">★</div>
            <span className="text-xs text-gray-400">{t('profile')}</span>
          </button>
          <button className="flex flex-col items-center" onClick={() => navigate('settings')}>
            <div className="w-6 h-6 mb-1 text-gray-400">⚙️</div>
            <span className="text-xs text-gray-400">{t('settings')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
