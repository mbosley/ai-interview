import React from 'react';
import { useTranslation } from 'react-i18next';

const WelcomeScreen = ({ navigate }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col min-h-[640px] bg-white font-sans px-6">
      <div className="flex justify-between items-center py-3 text-sm text-gray-400">
        <div>9:41</div>
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 rounded-sm border border-gray-300"></div>
          <div className="w-4 h-4 rounded-sm border border-gray-300"></div>
          <div className="w-4 h-4 rounded-sm border border-gray-300"></div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-normal tracking-tight text-gray-900">saga</h1>
        </div>
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-normal text-gray-800 mb-3 leading-snug">{t('tagline').split('.')[0]}</h2>
          <h2 className="text-3xl font-normal text-gray-800 mb-8 leading-snug">{t('tagline').split('.')[1]}</h2>
          <p className="text-base text-gray-500 leading-relaxed">
            Contribute to ethical AI development through guided conversations and receive fair compensation for your insights.
          </p>
        </div>
        <div className="mb-20 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1.5">EARN</p>
            <p className="text-sm text-gray-700">$15-25 per interview</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1.5">TIME</p>
            <p className="text-sm text-gray-700">15-30 minutes</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1.5">SECURITY</p>
            <p className="text-sm text-gray-700">Fully anonymous</p>
          </div>
        </div>
        <div className="space-y-3">
          <button
            className="w-full bg-black text-white font-normal text-base py-3.5 px-4 rounded-md transition-all duration-150 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
            onClick={() => navigate('onboarding')}
          >
            {t('signup')}
          </button>
          <button
            className="w-full bg-white text-gray-900 font-normal text-base py-3.5 px-4 rounded-md transition-all duration-150 hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1"
            onClick={() => navigate('dashboard')}
          >
            {t('login')}
          </button>
          <div className="text-center pt-8">
            <button 
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors duration-150 focus:outline-none focus:underline"
              onClick={() => navigate('how-it-works')}
            >
              Learn how it works
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
