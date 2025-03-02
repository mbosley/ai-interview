import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const WelcomeScreen = ({ navigate }) => {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Simple animation on mount
    setTimeout(() => setLoaded(true), 100);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans px-10">
      {/* Minimal navigation */}
      <div className="absolute top-0 right-0 p-10">
        <button 
          className={`text-xs text-gray-300 tracking-[0.15em] uppercase transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => navigate('dashboard')}
        >
          Skip
        </button>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <div className={`flex flex-col items-center mb-28 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-7xl font-thin text-gray-800 mb-24 tracking-wide">
            saga
          </h1>
          <p className="text-base font-light text-gray-500 tracking-[0.15em]">
            share your story
          </p>
        </div>
        
        <div className="w-full max-w-[300px] space-y-4">
          <button
            className={`w-full bg-black text-white text-xs uppercase tracking-[0.15em] py-5 px-6 transition-all duration-1000 hover:bg-gray-900 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '200ms' }}
            onClick={() => navigate('onboarding')}
          >
            Create account
          </button>
          <button
            className={`w-full bg-white text-gray-800 text-xs uppercase tracking-[0.15em] py-5 border border-gray-50 transition-all duration-1000 hover:border-gray-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '300ms' }}
            onClick={() => navigate('login')}
          >
            Sign in
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-10 text-center">
        <button 
          className={`text-xs uppercase tracking-[0.15em] text-gray-300 transition-all duration-700 hover:text-gray-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '400ms' }}
          onClick={() => navigate('how-it-works')}
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
