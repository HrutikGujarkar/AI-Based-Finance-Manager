import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  getIdToken
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, firebaseError } from '../firebase/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  firebaseAvailable: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseAvailable, setFirebaseAvailable] = useState(false);

  // Check if Firebase is available
  useEffect(() => {
    setFirebaseAvailable(!firebaseError && auth !== null);
    if (firebaseError) {
      console.warn('Firebase not available, using fallback authentication');
      setLoading(false);
    }
  }, []);

  async function signup(email: string, password: string) {
    if (!firebaseAvailable || !auth) {
      createLocalUser(email, password);
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (isNetworkError(error)) {
        createLocalUser(email, password);
        return;
      }
      throw error;
    }
  }

  async function login(email: string, password: string) {
    const localUsers = JSON.parse(localStorage.getItem('users') || '{}');
    if (localUsers[email]) {
      loginLocalUser(email, password);
      return;
    }

    if (!firebaseAvailable || !auth) {
      loginLocalUser(email, password);
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (isNetworkError(error)) {
        loginLocalUser(email, password);
        return;
      }
      throw error;
    }
  }

  function isNetworkError(error: any) {
    return error?.code === 'auth/network-request-failed' ||
      String(error?.message || '').toLowerCase().includes('network-request-failed');
  }

  function createLocalUser(email: string, password: string) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
      throw new Error('User already exists');
    }
    const user = { email, password, name: email.split('@')[0] };
    users[email] = user;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('firebaseToken', 'mock-token');
    setCurrentUser({ uid: email, email } as User);
  }

  function loginLocalUser(email: string, password: string) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[email];
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('firebaseToken', 'mock-token');
    setCurrentUser({ uid: email, email } as User);
  }

  async function loginWithGoogle() {
    if (!firebaseAvailable || !auth) {
      throw new Error('Google authentication requires Firebase');
    }
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function logout() {
    if (firebaseAvailable && auth) {
      await signOut(auth);
    }
    // Fallback cleanup
    localStorage.removeItem('firebaseToken');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  }

  async function resetPassword(email: string) {
    if (!firebaseAvailable || !auth) {
      throw new Error('Password reset requires Firebase');
    }
    await sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    if (!firebaseAvailable || !auth) {
      setLoading(false);
      // Check for existing session
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const savedUser = localStorage.getItem('currentUser');
      const isLocalSession = localStorage.getItem('firebaseToken') === 'mock-token';

      if (!user && savedUser && isLocalSession) {
        setCurrentUser(JSON.parse(savedUser));
        setLoading(false);
        return;
      }

      setCurrentUser(user);
      
      if (user) {
        try {
          const token = await getIdToken(user);
          localStorage.setItem('firebaseToken', token);
        } catch (error) {
          console.error('Error getting ID token:', error);
        }
      } else {
        localStorage.removeItem('firebaseToken');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [firebaseAvailable, auth]);

  const value = {
    currentUser,
    loading,
    firebaseAvailable,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
