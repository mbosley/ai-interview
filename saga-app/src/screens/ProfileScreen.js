import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';

const ProfileScreen = ({ navigate }) => {
  const { t } = useTranslation();
  const { userData, updateUserData } = useUser();
  const [activeTab, setActiveTab] = useState('personal');
  
  return (
    <div className="flex flex-col min-h-[640px] bg-white font-sans">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
        <button className="text-gray-800" onClick={() => navigate('dashboard')}>
          <span className="mr-1">←</span> {t('dashboard')}
        </button>
        <div className="text-sm text-gray-500 font-light">{t('profile')}</div>
        <div className="w-6"></div>
      </div>
      
      <div className="px-6 pt-8 pb-6 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-3 relative">
          {userData.profilePic ? 
            <img src={userData.profilePic} alt="Profile" className="w-full h-full rounded-full object-cover" /> : 
            <span className="text-xl text-gray-400">{userData.name.split(' ').map(name => name[0]).join('')}</span>
          }
          <button className="absolute bottom-0 right-0 w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xs">+</span>
          </button>
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-1">{userData.name}</h2>
        <p className="text-sm text-gray-500 mb-2">{userData.email}</p>
        
        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${userData.profileCompleted}%` }}></div>
        </div>
        <p className="text-xs text-gray-500 mb-4">Profile {userData.profileCompleted}% complete</p>
      </div>
      
      <div className="border-b border-gray-100">
        <div className="flex px-6">
          <button 
            className={`py-3 px-4 text-sm ${activeTab === 'personal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Info
          </button>
          <button 
            className={`py-3 px-4 text-sm ${activeTab === 'preferences' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
          <button 
            className={`py-3 px-4 text-sm ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>
      </div>
      
      {activeTab === 'personal' && (
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-200 rounded-md" 
                placeholder="Your full name"
                value={userData.name}
                onChange={(e) => updateUserData({ name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
              <input 
                type="email" 
                className="w-full p-3 border border-gray-200 rounded-md" 
                placeholder="Your email"
                value={userData.email}
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Date of Birth</label>
              <input 
                type="date" 
                className="w-full p-3 border border-gray-200 rounded-md" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Location</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-200 rounded-md" 
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Language</label>
              <select className="w-full p-3 border border-gray-200 rounded-md bg-white">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Chinese</option>
              </select>
            </div>
            <button className="w-full bg-black text-white font-normal text-base py-3 px-4 rounded-md mt-4">
              {t('save')}
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'preferences' && (
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3">Interview Preferences</label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800">Receive interview notifications</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only toggle-checkbox" id="notifications" defaultChecked />
                    <label htmlFor="notifications" className="block toggle-label bg-gray-200 w-12 h-6 rounded-full">
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800">Audio-only interviews</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only toggle-checkbox" id="audio-only" />
                    <label htmlFor="audio-only" className="block toggle-label bg-gray-200 w-12 h-6 rounded-full">
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800">Show subtitles</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only toggle-checkbox" id="subtitles" defaultChecked />
                    <label htmlFor="subtitles" className="block toggle-label bg-gray-200 w-12 h-6 rounded-full">
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Topic Interests</label>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800">Ethics</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800">Technology</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800">Culture</span>
                <span className="px-3 py-1 bg-blue-100 rounded-full text-sm text-blue-800">Philosophy</span>
                <span className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500">+ Add topic</span>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Payment Method</label>
              <div className="border border-gray-200 rounded-md p-4 flex justify-between items-center mb-2">
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
              <button className="text-sm text-blue-600">+ Add payment method</button>
            </div>
            <button className="w-full bg-black text-white font-normal text-base py-3 px-4 rounded-md mt-4">
              Save Preferences
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'security' && (
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Current Password</label>
              <input 
                type="password" 
                className="w-full p-3 border border-gray-200 rounded-md" 
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">New Password</label>
              <input 
                type="password" 
                className="w-full p-3 border border-gray-200 rounded-md" 
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Confirm New Password</label>
              <input 
                type="password" 
                className="w-full p-3 border border-gray-200 rounded-md" 
                placeholder="••••••••"
              />
            </div>
            <div className="pt-4">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3">Privacy Settings</label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800">Two-factor authentication</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only toggle-checkbox" id="2fa" />
                    <label htmlFor="2fa" className="block toggle-label bg-gray-200 w-12 h-6 rounded-full">
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800">Anonymous interview data</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only toggle-checkbox" id="anonymous" defaultChecked />
                    <label htmlFor="anonymous" className="block toggle-label bg-gray-200 w-12 h-6 rounded-full">
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full bg-black text-white font-normal text-base py-3 px-4 rounded-md mt-4">
              Update Security Settings
            </button>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-100">
            <button className="w-full text-red-600 font-normal text-base py-3 px-4 rounded-md border border-red-100">
              Delete Account
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-auto border-t border-gray-100">
        <div className="flex justify-around px-2 py-4">
          <button className="flex flex-col items-center" onClick={() => navigate('dashboard')}>
            <div className="w-6 h-6 mb-1 text-gray-400">⌂</div>
            <span className="text-xs text-gray-400">{t('home')}</span>
          </button>
          <button className="flex flex-col items-center" onClick={() => navigate('earnings-details')}>
            <div className="w-6 h-6 mb-1 text-gray-400">$</div>
            <span className="text-xs text-gray-400">{t('earnings')}</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="w-6 h-6 border-b-2 border-black mb-1">★</div>
            <span className="text-xs text-gray-900">{t('profile')}</span>
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

export default ProfileScreen;
