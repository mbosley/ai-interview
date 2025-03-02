import React from 'react';
import { useTranslation } from 'react-i18next';

const HowItWorksScreen = ({ navigate }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col min-h-[640px] bg-white font-sans">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <button className="text-gray-800" onClick={() => navigate('welcome')}>
          <span className="mr-1">←</span> Back
        </button>
        <div className="text-sm text-gray-500 font-light">How It Works</div>
        <div className="w-6"></div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="px-6 pt-8 pb-12 space-y-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-normal text-gray-900 mb-3">How Saga Works</h1>
            <p className="text-base text-gray-500">
              Saga connects you with AI researchers to improve AI understanding through conversation.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-800 text-xl">1</span>
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Sign Up</h2>
            <p className="text-center text-gray-600 mb-3">
              Create an account and complete your profile to get started. The more complete your profile, the more interview opportunities you'll receive.
            </p>
            <img src="/api/placeholder/300/180" alt="Sign up illustration" className="rounded-lg shadow-sm" />
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-800 text-xl">2</span>
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Select Interviews</h2>
            <p className="text-center text-gray-600 mb-3">
              Browse available interviews based on topics that interest you. Each interview shows the estimated time and compensation.
            </p>
            <img src="/api/placeholder/300/180" alt="Select interviews illustration" className="rounded-lg shadow-sm" />
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-800 text-xl">3</span>
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Have a Conversation</h2>
            <p className="text-center text-gray-600 mb-3">
              Engage in natural voice conversation with an AI assistant. Share your perspectives, experiences, and insights on various topics.
            </p>
            <img src="/api/placeholder/300/180" alt="Conversation illustration" className="rounded-lg shadow-sm" />
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-blue-800 text-xl">4</span>
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Get Paid</h2>
            <p className="text-center text-gray-600 mb-3">
              Receive payment for completed interviews directly to your preferred payment method. Payments are processed within 48 hours.
            </p>
            <img src="/api/placeholder/300/180" alt="Payment illustration" className="rounded-lg shadow-sm" />
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Your Privacy Matters</h3>
            <p className="text-gray-600 mb-4">
              All data is anonymized and used solely to improve AI systems. You control what you share, and your personal information is never sold to third parties.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <p className="text-sm text-gray-600">All interviews are anonymized</p>
              </li>
              <li className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <p className="text-sm text-gray-600">You control what information you share</p>
              </li>
              <li className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <p className="text-sm text-gray-600">Data is used only for AI research</p>
              </li>
              <li className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <p className="text-sm text-gray-600">Personal information is never sold</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 px-6 py-6">
        <button 
          className="w-full bg-black text-white font-normal text-base py-3.5 px-4 rounded-md"
          onClick={() => navigate('onboarding')}
        >
          Join Saga
        </button>
        <button 
          className="w-full text-gray-500 font-normal text-sm py-3 px-4"
          onClick={() => navigate('welcome')}
        >
          Back to home
        </button>
      </div>
    </div>
  );
};

export default HowItWorksScreen;
