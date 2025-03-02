import React, { useState, useEffect } from 'react';
import { useAppSettings } from '../../context/AppSettingsContext';
import { 
  IoWifi, 
  IoBatteryFullSharp, 
  IoWarning,
  IoLocate,
  IoHeadset,
  IoBluetoothSharp
} from 'react-icons/io5';
import { TbAntennaBars5 } from 'react-icons/tb';

/**
 * iOS-style status bar component
 */
const StatusBar = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(100);
  const { theme } = useAppSettings();
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      
      // iOS uses 24-hour time in the status bar
      setCurrentTime(`${hours}:${minutes}`);
      
      // Simulate random battery level between 70-100%
      if (Math.random() > 0.9) {
        setBatteryLevel(Math.floor(Math.random() * 30) + 70);
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`status-bar ${theme === 'dark' ? 'text-white' : 'text-white'}`}>
      <div className="status-bar-time font-semibold">{currentTime}</div>
      <div className="status-bar-icons flex items-center space-x-1.5">
        <div className="flex items-center">
          <IoLocate size={12} className="text-gray-400" />
        </div>
        <TbAntennaBars5 size={16} />
        <IoWifi size={16} />
        <IoBluetoothSharp size={14} className="text-gray-500" />
        <div className="flex items-center space-x-0.5">
          <span className="text-xs font-medium">{batteryLevel}%</span>
          <IoBatteryFullSharp size={18} className="transform rotate-90" />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;