import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, increment } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your web app's Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "saga-app.firebaseapp.com",
  projectId: "saga-app",
  storageBucket: "saga-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

// Firestore functions
export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: new Date(),
      totalEarnings: 0,
      pendingEarnings: 0,
      interviewsCompleted: 0,
      profileCompleted: 30,
    });
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
  } catch (error) {
    throw error;
  }
};

export const getAvailableInterviews = async () => {
  try {
    const interviewsRef = collection(db, 'interviews');
    const q = query(interviewsRef, where('status', '==', 'available'));
    const querySnapshot = await getDocs(q);
    
    const interviews = [];
    querySnapshot.forEach((doc) => {
      interviews.push({ id: doc.id, ...doc.data() });
    });
    
    return interviews;
  } catch (error) {
    throw error;
  }
};

export const saveInterviewResponse = async (userId, interviewId, questionIndex, audioBlob, textResponse) => {
  try {
    // Create a reference for the new response document
    const responseRef = doc(collection(db, 'interview_responses'));
    
    // Create the response record
    const responseData = {
      userId,
      interviewId,
      questionIndex,
      timestamp: new Date(),
      status: 'submitted',
      responseType: audioBlob ? 'audio' : 'text'
    };
    
    // Add text response if provided
    if (textResponse) {
      responseData.textResponse = textResponse;
    }
    
    await setDoc(responseRef, responseData);
    
    // If we have audio data, upload it to Firebase Storage
    if (audioBlob) {
      const storage = getStorage();
      const audioRef = ref(storage, `responses/${responseRef.id}.webm`);
      
      // Upload the audio blob
      await uploadBytes(audioRef, audioBlob);
      
      // Get the download URL and update the response document
      const downloadURL = await getDownloadURL(audioRef);
      await updateDoc(responseRef, {
        audioUrl: downloadURL
      });
    }
    
    return responseRef.id;
  } catch (error) {
    console.error('Error saving interview response:', error);
    throw error;
  }
};

export const completeInterview = async (userId, interviewId) => {
  try {
    // Update user's completed interviews count
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      interviewsCompleted: increment(1),
      pendingEarnings: increment(15) // Add $15 for completing the interview
    });
    
    // Mark the interview as completed for this user
    const completionRef = doc(collection(db, 'interview_completions'));
    await setDoc(completionRef, {
      userId,
      interviewId,
      completedAt: new Date(),
      status: 'pending_review',
      payment: {
        amount: 15,
        currency: 'USD',
        status: 'pending'
      }
    });
    
    return completionRef.id;
  } catch (error) {
    console.error('Error completing interview:', error);
    throw error;
  }
};

export { auth, db };