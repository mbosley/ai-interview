import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';

const EarningsDetailsScreen = ({ navigate }) => {
  const { t } = useTranslation();
  const { userData } = useUser();
  
  return (
    <div className="flex flex-col min-h-[640px] bg-white font-sans">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <button className="text-gray-800" onClick={() => navigate('dashboard')}>
          <span className="mr-1">←</span> {t('dashboard')}
        </button>
        <div className="text-sm text-gray-500 font-light">{t('earnings')}</div>
        <div className="w-6"></div>
      </div>
      
      <div className="px-6 py-6">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{t('totalEarnings')}</p>
          <div className="text-3xl font-light text-gray-900 mb-1">${userData.totalEarnings.toFixed(2)}</div>
          <div className="flex space-x-4 text-sm text-gray-500">
            <span>${(userData.totalEarnings - userData.pendingEarnings).toFixed(2)} paid</span>
            <span>${userData.pendingEarnings.toFixed(2)} pending</span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs uppercase tracking-wider text-gray-400">PAYMENT METHOD</h2>
            <button className="text-sm text-blue-600">{t('edit')}</button>
          </div>
          <div className="border border-gray-200 rounded-md p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-8 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                <span className="text-blue-800 text-sm">P</span>
              </div>
              <div>
                <p className="text-base text-gray-800">{userData.paymentMethod}</p>
                <p className="text-xs text-gray-500">{userData.paymentEmail}</p>
              </div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs uppercase tracking-wider text-gray-400">PAYMENT HISTORY</h2>
            <div className="text-sm text-gray-500">Last 30 days</div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="border border-gray-100 rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-base text-gray-800 font-medium">Jul 2024 Payout</p>
                <p className="text-base text-gray-800 font-medium">$55.00</p>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <p>3 interviews</p>
                <p>Processed Jul 25</p>
              </div>
            </div>
            
            <div className="border border-gray-100 rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-base text-gray-800 font-medium">Jun 2024 Payout</p>
                <p className="text-base text-gray-800 font-medium">$40.00</p>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <p>2 interviews</p>
                <p>Processed Jun 25</p>
              </div>
            </div>
            
            <div className="border border-gray-100 rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-base text-gray-800 font-medium">May 2024 Payout</p>
                <p className="text-base text-gray-800 font-medium">$15.50</p>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <p>1 interview</p>
                <p>Processed May 25</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              View all payment history
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-auto border-t border-gray-100">
        <div className="flex justify-around px-2 py-4">
          <button className="flex flex-col items-center" onClick={() => navigate('dashboard')}>
            <div className="w-6 h-6 mb-1 text-gray-400">⌂</div>
            <span className="text-xs text-gray-400">{t('home')}</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="w-6 h-6 border-b-2 border-black mb-1">$</div>
            <span className="text-xs text-gray-900">{t('earnings')}</span>
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

export default EarningsDetailsScreen;
