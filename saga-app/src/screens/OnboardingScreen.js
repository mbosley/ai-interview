import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';

const OnboardingScreen = ({ navigate }) => {
  const { t } = useTranslation();
  const { updateUserData } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    topics: [],
    agreeTerms: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleTopicToggle = (topic) => {
    if (formData.topics.includes(topic)) {
      setFormData({
        ...formData,
        topics: formData.topics.filter(t => t !== topic)
      });
    } else {
      setFormData({
        ...formData,
        topics: [...formData.topics, topic]
      });
    }
  };
  
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      updateUserData({
        name: formData.name,
        email: formData.email,
        profileCompleted: 40
      });
      navigate('dashboard');
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('welcome');
    }
  };
  
  return (
    <div className="flex flex-col min-h-[640px] bg-white font-sans">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <button className="text-gray-800" onClick={prevStep}>
          <span className="mr-1">←</span> Back
        </button>
        <div className="text-sm text-gray-500 font-light">
          Step {step} of 3
        </div>
        <button className="text-blue-600 text-sm" onClick={() => navigate('dashboard')}>
          Skip
        </button>
      </div>
      
      <div className="px-6 pt-8 pb-6">
        <div className="flex mb-8 justify-center">
          <div className={`w-3 h-3 rounded-full mx-1 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-3 h-3 rounded-full mx-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-3 h-3 rounded-full mx-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        </div>
        
        {step === 1 && (
          <>
            <h2 className="text-2xl font-normal text-gray-900 mb-3">Create your account</h2>
            <p className="text-base text-gray-500 mb-6">
              Join Saga to share your perspectives and earn rewards.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  className="w-full p-3 border border-gray-200 rounded-md" 
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full p-3 border border-gray-200 rounded-md" 
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Password</label>
                <input 
                  type="password" 
                  name="password"
                  className="w-full p-3 border border-gray-200 rounded-md" 
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="pt-4 flex items-start">
                <input 
                  type="checkbox" 
                  id="agreeTerms"
                  name="agreeTerms"
                  className="mt-1" 
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-500">
                  I agree to the <a href="#" className="text-blue-600">Terms of Service</a> and <a href="#" className="text-blue-600">Privacy Policy</a>
                </label>
              </div>
            </div>
          </>
        )}
        
        {step === 2 && (
          <>
            <h2 className="text-2xl font-normal text-gray-900 mb-3">Select your interests</h2>
            <p className="text-base text-gray-500 mb-6">
              Choose topics you're comfortable discussing in interviews.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {['Ethics', 'Technology', 'Culture', 'Philosophy', 'Education', 'Health', 'Environment', 'Politics', 'Economy', 'Art', 'Science', 'Religion'].map(topic => (
                <div 
                  key={topic}
                  className={`p-3 border rounded-md text-center cursor-pointer ${formData.topics.includes(topic) ? 'border-blue-500 bg-blue-50 text-blue-800' : 'border-gray-200 text-gray-800'}`}
                  onClick={() => handleTopicToggle(topic)}
                >
                  {topic}
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Selected topics will help match you with relevant interviews. You can change these later.
            </p>
          </>
        )}
        
        {step === 3 && (
          <>
            <h2 className="text-2xl font-normal text-gray-900 mb-3">Payment details</h2>
            <p className="text-base text-gray-500 mb-6">
              How would you like to receive your earnings?
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="border border-gray-200 rounded-md p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-8 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                    <span className="text-blue-800 text-sm">P</span>
                  </div>
                  <span className="text-base text-gray-800">PayPal</span>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4 flex justify-between items-center opacity-50">
                <div className="flex items-center">
                  <div className="w-10 h-8 bg-green-100 rounded-md flex items-center justify-center mr-3">
                    <span className="text-green-800 text-sm">$</span>
                  </div>
                  <span className="text-base text-gray-800">Bank Transfer</span>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4 flex justify-between items-center opacity-50">
                <div className="flex items-center">
                  <div className="w-10 h-8 bg-purple-100 rounded-md flex items-center justify-center mr-3">
                    <span className="text-purple-800 text-sm">C</span>
                  </div>
                  <span className="text-base text-gray-800">Crypto</span>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">PayPal Email</label>
              <input 
                type="email" 
                className="w-full p-3 border border-gray-200 rounded-md" 
                placeholder="your.paypal@example.com"
              />
              <p className="text-xs text-gray-500 mt-2">
                We'll send your earnings to this PayPal account.
              </p>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-auto px-6 pb-8">
        <button 
          className="w-full bg-blue-600 text-white font-normal text-base py-3.5 px-4 rounded-md disabled:bg-gray-300 disabled:text-gray-500"
          disabled={step === 1 && (!formData.name || !formData.email || !formData.password || !formData.agreeTerms)}
          onClick={nextStep}
        >
          {step < 3 ? 'Continue' : 'Complete Setup'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
