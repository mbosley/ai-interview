import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import SupportChat from '../components/common/SupportChat';
import useMobileGestures from '../utils/useMobileGestures';
import MobileBottomNavigation from '../components/common/MobileBottomNavigation';
import { IoTimeOutline, IoCheckmarkCircle, IoStarOutline } from 'react-icons/io5';

const DashboardScreen = ({ navigate }) => {
  const { t } = useTranslation();
  const { userData } = useUser();
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('default'); // 'default', 'compensation', 'duration'
  
  // Available interviews data
  const [availableInterviews, setAvailableInterviews] = useState([
    {
      id: 1,
      title: 'Values & Ethics',
      duration: 15,
      compensation: 15,
      description: 'Share your perspectives on ethical dilemmas and value systems.',
      isNew: true,
      isPopular: false,
    },
    {
      id: 2,
      title: 'Decision Making',
      duration: 25,
      compensation: 20,
      description: 'Explore your decision-making process in various scenarios.',
      isNew: false,
      isPopular: false,
    },
    {
      id: 3,
      title: 'Cultural Insights',
      duration: 30,
      compensation: 25,
      description: 'Share perspectives from your cultural background.',
      isNew: false,
      isPopular: true,
    }
  ]);
  
  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime(); // Initial update
    const intervalId = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Handle pull-to-refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    
    // Return a promise for the mobile gestures hook
    return new Promise((resolve) => {
      // Simulate fetching new data
      setTimeout(() => {
        // Just shuffle the interviews to simulate changes
        setAvailableInterviews(prev => [...prev].sort(() => Math.random() - 0.5));
        setIsRefreshing(false);
        resolve();
      }, 1500);
    });
  }, []);
  
  // Use mobile gestures hook for pull-to-refresh
  const { containerRef, PullIndicator } = useMobileGestures({
    onRefresh: handleRefresh,
    onSwipeLeft: () => navigate('earnings-details'),
    onSwipeRight: () => navigate('profile'),
  });
  
  // Sort interviews
  const sortedInterviews = [...availableInterviews].sort((a, b) => {
    if (sortBy === 'compensation') {
      return b.compensation - a.compensation;
    } else if (sortBy === 'duration') {
      return a.duration - b.duration;
    }
    return 0; // default order
  });
  
  // Remove tutorial functionality
  useEffect(() => {
    // Override any tutorial showing logic
    if (showSupportChat) {
      setShowSupportChat(false);
    }
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="flex flex-col min-h-screen bg-gray-50 font-sans mobile-scroll-container"
    >
      <PullIndicator />
      
      {/* Minimalist header */}
      <div className="px-5 py-3 bg-white sticky top-0 z-30">
        <div className="flex justify-between items-center">
          <h1 className="text-base font-medium text-gray-900">Home</h1>
          <div className="relative">
            <button 
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-600"
              onClick={() => navigate('profile')}
            >
              {userData.profilePic ? 
                <img src={userData.profilePic} alt="Profile" className="w-full h-full rounded-full object-cover" /> : 
                userData.name.split(' ').map(name => name[0]).join('')
              }
            </button>
            {userData.notifications > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center text-white text-xs"
                onClick={() => navigate('notifications')}
              >
                {userData.notifications}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-5 pt-3">
        <p className="text-sm text-gray-500">Hello, {userData.name.split(' ')[0]}</p>
      </div>
      
      {/* Minimalist earnings card */}
      <div className="px-5 mt-4 mb-5">
        <div className="p-5 border-b border-gray-100">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{t('totalEarnings')}</p>
            <button 
              className="text-sm" 
              onClick={() => navigate('earnings-details')}
            >
              Details
            </button>
          </div>
          <div className="text-2xl font-normal text-gray-900 mb-3">
            ${userData.totalEarnings.toFixed(2)}
          </div>
          <div className="flex items-center">
            <div className="h-px w-4 bg-gray-300 mr-2"></div>
            <p className="text-xs text-gray-500">
              ${userData.pendingEarnings.toFixed(2)} {t('pendingPayout')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Minimalist profile completion card */}
      {userData.profileCompleted < 100 && (
        <div className="px-5 mb-8">
          <div className="border border-black p-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm">{t('completeProfile')}</h3>
              <span className="text-sm">{userData.profileCompleted}%</span>
            </div>
            <div className="w-full bg-gray-100 h-px mb-3">
              <div className="bg-black h-px" style={{ width: `${userData.profileCompleted}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mb-4">{t('profileCompletion')}</p>
            <button 
              className="w-full border border-black text-sm py-2"
              onClick={() => navigate('profile')}
            >
              {t('completeProfile')}
            </button>
          </div>
        </div>
      )}
      
      {/* Minimalist Available Interviews section */}
      <div className="px-5 mb-6">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-2">
          <h2 className="text-sm uppercase tracking-wide text-gray-500">{t('availableInterviews')}</h2>
          
          {/* Minimalist sorting tabs */}
          <div className="flex space-x-3 text-xs">
            <button 
              className={`${sortBy === 'default' ? 'text-black' : 'text-gray-400'}`}
              onClick={() => setSortBy('default')}
            >
              All
              {sortBy === 'default' && <div className="h-0.5 w-full bg-black mt-1"></div>}
            </button>
            <button 
              className={`${sortBy === 'compensation' ? 'text-black' : 'text-gray-400'}`}
              onClick={() => setSortBy('compensation')}
            >
              Pay
              {sortBy === 'compensation' && <div className="h-0.5 w-full bg-black mt-1"></div>}
            </button>
            <button 
              className={`${sortBy === 'duration' ? 'text-black' : 'text-gray-400'}`}
              onClick={() => setSortBy('duration')}
            >
              Time
              {sortBy === 'duration' && <div className="h-0.5 w-full bg-black mt-1"></div>}
            </button>
          </div>
        </div>

        {isRefreshing && (
          <div className="flex justify-center items-center py-3">
            <div className="w-3 h-3 rounded-full border-t-2 border-r-2 border-black animate-spin mr-2"></div>
            <span className="text-xs text-gray-500">Refreshing...</span>
          </div>
        )}

        {sortedInterviews.length === 0 ? (
          <div className="p-8 text-center border border-gray-200">
            <h3 className="text-base mb-2">No interviews available</h3>
            <p className="text-xs text-gray-500 mb-4">Check back soon for new opportunities</p>
            <button 
              className="text-sm border border-black py-2 px-4"
              onClick={handleRefresh}
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedInterviews.map(interview => (
              <div key={interview.id} className="border-b border-gray-100 pb-6">
                <div className="mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base text-gray-900">{interview.title}</h3>
                    <div className="text-sm">
                      ${interview.compensation}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                    <div>{interview.duration} min</div>
                    {interview.isNew && (
                      <>
                        <div>•</div>
                        <div className="text-black">New</div>
                      </>
                    )}
                    {interview.isPopular && (
                      <>
                        <div>•</div>
                        <div className="text-black">Popular</div>
                      </>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{interview.description}</p>
                  
                  <button
                    className="border border-black py-2 text-sm w-full"
                    onClick={() => navigate('interview', { interviewType: interview.title })}
                  >
                    {t('startInterview')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Completed interviews section removed */}
      
      {/* Support chat */}
      {showSupportChat && <SupportChat onClose={() => setShowSupportChat(false)} />}
      
      {/* Minimalist help button */}
      <div className="fixed bottom-20 right-5 z-10">
        <button 
          className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-800 flex items-center justify-center"
          onClick={() => setShowSupportChat(true)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      
      {/* Add padding to the bottom to account for the fixed navigation */}
      <div className="pb-20"></div>
      
      {/* Mobile bottom navigation */}
      <MobileBottomNavigation activeTab="dashboard" navigate={navigate} />
    </div>
  );
};

export default DashboardScreen;