import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import { registerUser, createUserProfile } from '../utils/firebase';

const OnboardingScreen = ({ navigate }) => {
  const { t } = useTranslation();
  const { updateUserData } = useUser();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    topics: [],
    agreeTerms: false,
    paymentEmail: ''
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear any errors when the user starts typing
    if (error) setError(null);
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
  
  const completeRegistration = async () => {
    setIsLoading(true);
    setError(null); // Clear any previous errors
    
    // This helps with debugging
    console.log("Starting registration process", { formData });
    
    try {
      // Check required fields
      if (!formData.email || !formData.password) {
        console.error("Missing required fields:", { email: !!formData.email, password: !!formData.password });
        setError("Email and password are required");
        setIsLoading(false);
        return;
      }
      
      // Use email as payment email if none provided
      const finalFormData = {
        ...formData,
        paymentEmail: formData.paymentEmail || formData.email
      };
      
      console.log("Registering user with email:", finalFormData.email);
      
      // TEMPORARY FIX: Skip Firebase for testing
      // Just navigate to dashboard to bypass the error for now
      console.log("BYPASSING FIREBASE - direct navigation to dashboard");
      updateUserData({
        name: finalFormData.name || "Test User",
        email: finalFormData.email,
        topics: finalFormData.topics || [],
        paymentMethod: 'PayPal',
        paymentEmail: finalFormData.paymentEmail || finalFormData.email,
        profileCompleted: 40
      });
      navigate('dashboard');
      return;
      
      /* DISABLED FOR NOW - UNCOMMENT WHEN FIREBASE IS CONFIGURED
      // Register user with Firebase
      const user = await registerUser(finalFormData.email, finalFormData.password);
      console.log("User registered successfully", user);
      
      // Create user profile in Firestore
      await createUserProfile(user.uid, {
        name: finalFormData.name,
        topics: finalFormData.topics || [],
        paymentMethod: 'PayPal',
        paymentEmail: finalFormData.paymentEmail,
        profileCompleted: 40
      });
      console.log("User profile created");
      
      // Update local state
      updateUserData({
        name: finalFormData.name,
        email: finalFormData.email,
        topics: finalFormData.topics || [],
        paymentMethod: 'PayPal',
        paymentEmail: finalFormData.paymentEmail,
        profileCompleted: 40
      });
      
      navigate('dashboard');
      */
    } catch (error) {
      console.error("Error during registration:", error);
      // More detailed error messages
      let errorMessage = "Registration failed. Please try again later.";
      
      if (error.code) {
        switch(error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email is already registered. Please use a different email or try logging in.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters.';
            break;
          default:
            errorMessage = `Error: ${error.code} - ${error.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeRegistration();
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
        <div className="text-xs uppercase tracking-wider text-gray-500">
          Step {step} of 3
        </div>
        <button className="text-gray-800 text-sm" onClick={() => {
          // Always navigate to dashboard directly
          // Skip any registration or validation steps
          console.log("Skipping directly to dashboard");
          navigate('dashboard');
        }}>
          Skip
        </button>
      </div>
      
      {/* EMERGENCY BYPASS BUTTON - REMOVE IN PRODUCTION */}
      <div className="bg-gray-100 py-2 px-4 text-center">
        <button 
          className="bg-gray-800 text-white font-normal py-2 px-4"
          onClick={() => navigate('dashboard')}
        >
          EMERGENCY DASHBOARD ACCESS
        </button>
      </div>
      
      <div className="px-6 pt-8 pb-6">
        <div className="flex mb-8 justify-center">
          <div className={`w-3 h-3 mx-1 ${step >= 1 ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
          <div className={`w-3 h-3 mx-1 ${step >= 2 ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
          <div className={`w-3 h-3 mx-1 ${step >= 3 ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
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
                  className="w-full p-3 border border-gray-200" 
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
                  className="w-full p-3 border border-gray-200" 
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
                  className="w-full p-3 border border-gray-200" 
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
                  I agree to the <a href="#" className="text-gray-800">Terms of Service</a> and <a href="#" className="text-gray-800">Privacy Policy</a>
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
                  className={`p-3 border text-center cursor-pointer ${formData.topics.includes(topic) ? 'border-gray-800 bg-gray-50 text-gray-800' : 'border-gray-200 text-gray-800'}`}
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
              <div className="border border-gray-200 p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-8 bg-gray-100 flex items-center justify-center mr-3">
                    <span className="text-gray-800 text-sm">P</span>
                  </div>
                  <span className="text-base text-gray-800">PayPal</span>
                </div>
                <div className="w-5 h-5 rounded-full border border-gray-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                </div>
              </div>
              
              <div className="border border-gray-200 p-4 flex justify-between items-center opacity-50">
                <div className="flex items-center">
                  <div className="w-10 h-8 bg-gray-100 flex items-center justify-center mr-3">
                    <span className="text-gray-800 text-sm">$</span>
                  </div>
                  <span className="text-base text-gray-800">Bank Transfer</span>
                </div>
                <div className="w-5 h-5 rounded-full border border-gray-300"></div>
              </div>
              
              <div className="border border-gray-200 p-4 flex justify-between items-center opacity-50">
                <div className="flex items-center">
                  <div className="w-10 h-8 bg-gray-100 flex items-center justify-center mr-3">
                    <span className="text-gray-800 text-sm">C</span>
                  </div>
                  <span className="text-base text-gray-800">Crypto</span>
                </div>
                <div className="w-5 h-5 rounded-full border border-gray-300"></div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                PayPal Email <span className="text-gray-400">(optional)</span>
              </label>
              <input 
                type="email"
                name="paymentEmail"
                value={formData.paymentEmail}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200" 
                placeholder="your.paypal@example.com"
              />
              <p className="text-xs text-gray-500 mt-2">
                We'll send your earnings to this PayPal account. You can add or update this later in your profile.
              </p>
            </div>
          </>
        )}
      </div>
      
      {error && (
        <div className="mx-6 mb-4 p-3 border-l-2 border-red-600 bg-gray-50 text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <div className="mt-auto px-6 pb-8">
        <div className="flex flex-col space-y-3">
          <button 
            className="w-full bg-black text-white font-normal text-base py-3.5 px-4 disabled:bg-gray-300 disabled:text-gray-500"
            disabled={
              isLoading || 
              (step === 1 && (!formData.name || !formData.email || !formData.password || !formData.agreeTerms))
              // Removed PayPal email validation
            }
            onClick={nextStep}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              step < 3 ? 'Continue' : 'Complete Setup'
            )}
          </button>

          {step === 3 && (
            <button 
              className="text-gray-500 text-sm font-normal py-2"
              onClick={() => {
                // Bypass all registration - go straight to dashboard
                console.log("Skip for now - direct to dashboard");
                navigate('dashboard');
              }}
              disabled={isLoading}
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
