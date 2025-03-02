import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    name: 'Jamie Smith',
    email: 'jamie.smith@example.com',
    profileCompleted: 80,
    totalEarnings: 125.50,
    pendingEarnings: 15.00,
    interviewsCompleted: 6,
    paymentMethod: 'PayPal',
    paymentEmail: 'user@example.com',
    profilePic: null,
    notifications: 2
  });
  
  const updateUserData = (newData) => {
    setUserData({...userData, ...newData});
  };
  
  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
