import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, getCurrentUser, getUserProfile, createUserProfile, updateUserProfile, registerUser } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profileCompleted: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    interviewsCompleted: 0,
    paymentMethod: '',
    paymentEmail: '',
    profilePic: null,
    notifications: 0,
    isLoading: true
  });
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get user profile from Firestore
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserData({
              ...profile,
              email: user.email,
              isLoading: false
            });
          } else {
            // If no profile exists yet, set default values
            setUserData({
              name: user.displayName || '',
              email: user.email,
              profileCompleted: 0,
              totalEarnings: 0,
              pendingEarnings: 0,
              interviewsCompleted: 0,
              paymentMethod: '',
              paymentEmail: '',
              profilePic: null,
              notifications: 0,
              isLoading: false
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        // No user is signed in
        setUserData({
          name: '',
          email: '',
          profileCompleted: 0,
          totalEarnings: 0,
          pendingEarnings: 0,
          interviewsCompleted: 0,
          paymentMethod: '',
          paymentEmail: '',
          profilePic: null,
          notifications: 0,
          isLoading: false
        });
      }
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  const updateUserData = async (newData) => {
    if (currentUser) {
      try {
        // Update in Firestore
        await updateUserProfile(currentUser.uid, newData);
        // Update local state
        setUserData({...userData, ...newData});
      } catch (error) {
        console.error("Error updating user data:", error);
        throw error;
      }
    } else {
      // Just update local state if no user is logged in (for development/preview)
      setUserData({...userData, ...newData});
    }
  };
  
  const registerUserWithProfile = async (email, password, profileData) => {
    try {
      // Register the user with Firebase Auth
      const user = await registerUser(email, password);
      
      // Create the user's profile in Firestore
      await createUserProfile(user.uid, {
        name: profileData.name,
        email: profileData.email,
        profileCompleted: 30,
        // Add other profile data as needed
      });
      
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };
  
  return (
    <UserContext.Provider value={{ 
      currentUser, 
      userData, 
      updateUserData,
      registerUserWithProfile,
      isAuthenticated: !!currentUser,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
