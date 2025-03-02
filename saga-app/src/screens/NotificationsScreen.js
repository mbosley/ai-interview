import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';

const NotificationsScreen = ({ navigate }) => {
  const { t } = useTranslation();
  const { userData, updateUserData } = useUser();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'interview',
      title: 'New Interview Available',
      message: 'A new "Cultural Insights" interview is now available for you.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Processed',
      message: 'Your payment of $15.00 has been processed and added to your balance.',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'system',
      title: 'Profile Update Reminder',
      message: 'Complete your profile to unlock more interview opportunities.',
      time: '3 days ago',
      read: true
    },
    {
      id: 4,
      type: 'interview',
      title: 'Interview Feedback',
      message: 'Thank you for completing the "Ethics & Values" interview.',
      time: '1 week ago',
      read: true
    }
  ]);
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({
      ...notif,
      read: true
    }));
    setNotifications(updatedNotifications);
    updateUserData({ notifications: 0 });
  };
  
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    updateUserData({ notifications: unreadCount });
  };
  
  return (
    <div className="flex flex-col min-h-[640px] bg-white font-sans">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <button className="text-gray-800" onClick={() => navigate('dashboard')}>
          <span className="mr-1">←</span> {t('dashboard')}
        </button>
        <div className="text-xs uppercase tracking-wider text-gray-500">{t('notifications')}</div>
        <button className="text-sm text-gray-800" onClick={markAllAsRead}>
          {t('clearAll')}
        </button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 py-12">
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mb-4">
              <span className="text-2xl text-gray-400">🔔</span>
            </div>
            <h2 className="text-xl font-normal text-gray-900 mb-2">No notifications</h2>
            <p className="text-center text-gray-500">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="px-6 py-4 divide-y divide-gray-100">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`py-4 ${!notification.read ? 'border-l-2 border-gray-800 pl-3 -ml-3' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center mr-3 
                    ${notification.type === 'interview' ? 'bg-gray-100' : 
                      notification.type === 'payment' ? 'bg-gray-100' : 'bg-gray-100'}`}
                  >
                    <span className="text-lg">
                      {notification.type === 'interview' ? '💬' : 
                        notification.type === 'payment' ? '💰' : 'ℹ️'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h3 className={`text-base ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-800'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    {notification.type === 'interview' && (
                      <button 
                        className="text-sm text-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('dashboard');
                        }}
                      >
                        View details →
                      </button>
                    )}
                    {notification.type === 'payment' && (
                      <button 
                        className="text-sm text-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('earnings-details');
                        }}
                      >
                        View payment →
                      </button>
                    )}
                    {notification.type === 'system' && !notification.read && (
                      <button 
                        className="text-sm text-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('profile');
                        }}
                      >
                        Complete profile →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-100">
        <div className="px-6 py-4">
          <div className="flex items-center mb-4">
            <span className="text-xs uppercase tracking-wider text-gray-500 mr-2">Notification preferences</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">New interviews</span>
              <div className="relative">
                <input type="checkbox" className="sr-only toggle-checkbox" id="new-interviews" defaultChecked />
                <label htmlFor="new-interviews" className="block toggle-label bg-gray-200 w-12 h-6">
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4"></div>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">Payment updates</span>
              <div className="relative">
                <input type="checkbox" className="sr-only toggle-checkbox" id="payment-updates" defaultChecked />
                <label htmlFor="payment-updates" className="block toggle-label bg-gray-200 w-12 h-6">
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4"></div>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-800">System announcements</span>
              <div className="relative">
                <input type="checkbox" className="sr-only toggle-checkbox" id="system-announcements" defaultChecked />
                <label htmlFor="system-announcements" className="block toggle-label bg-gray-200 w-12 h-6">
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsScreen;
