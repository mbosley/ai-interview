import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../utils/firebase';

const LoginScreen = ({ navigate }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await loginUser(formData.email, formData.password);
      navigate('dashboard');
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later or reset your password.');
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-[640px] bg-white font-sans">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <button className="text-gray-800" onClick={() => navigate('welcome')}>
          <span className="mr-1">←</span> Back
        </button>
        <div className="text-sm text-gray-500 font-light">
          Login
        </div>
        <div className="w-10"></div> {/* Empty div for flex balance */}
      </div>
      
      <div className="px-6 pt-10 pb-6">
        <h2 className="text-2xl font-normal text-gray-900 mb-3">Welcome back</h2>
        <p className="text-base text-gray-500 mb-8">
          Sign in to continue your journey with Saga.
        </p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
            <input 
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-md" 
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Password</label>
            <input 
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-md" 
              placeholder="Your password"
            />
          </div>
          
          <div className="flex justify-between pt-1">
            <div className="flex items-start">
              <input 
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                className="mt-1"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-500">
                Remember me
              </label>
            </div>
            
            <button 
              type="button"
              onClick={() => alert('Password reset functionality would go here')}
              className="text-sm text-blue-600"
            >
              Forgot password?
            </button>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <button 
            type="submit"
            disabled={isLoading || !formData.email || !formData.password}
            className="w-full mt-6 bg-blue-600 text-white font-normal text-base py-3.5 px-4 rounded-md disabled:bg-gray-300 disabled:text-gray-500"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account? 
            <button 
              onClick={() => navigate('onboarding')}
              className="ml-1 text-blue-600"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;