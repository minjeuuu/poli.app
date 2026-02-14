// services/auth/firebaseAuth.ts
// REAL FIREBASE AUTHENTICATION SERVICE

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Get Firebase config from environment variables
const getFirebaseConfig = (): FirebaseConfig => {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  };
};

// Check if Firebase is configured
const isFirebaseConfigured = (): boolean => {
  const config = getFirebaseConfig();
  return !!(config.apiKey && config.authDomain && config.projectId);
};

// User interface
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string;
}

// Auth state
let currentUser: AuthUser | null = null;
let authListeners: Array<(user: AuthUser | null) => void> = [];

// Initialize Firebase (dynamic import to avoid errors if not configured)
let firebaseApp: any = null;
let firebaseAuth: any = null;

const initializeFirebase = async () => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Using local storage authentication.');
    return false;
  }

  try {
    // Dynamic import of Firebase
    const { initializeApp } = await import('firebase/app');
    const { getAuth } = await import('firebase/auth');
    
    const config = getFirebaseConfig();
    firebaseApp = initializeApp(config);
    firebaseAuth = getAuth(firebaseApp);
    
    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    return false;
  }
};

// Local storage fallback for auth
const STORAGE_KEY = 'poli_auth_user';

const saveUserToStorage = (user: AuthUser | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

const getUserFromStorage = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Generate user ID
const generateUserId = (): string => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
};

// Hash password (simple hash for local storage)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'poli_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Store credentials in local storage
const CREDENTIALS_KEY = 'poli_credentials';

const storeCredentials = async (email: string, password: string, displayName: string) => {
  const hashedPassword = await hashPassword(password);
  const credentials = {
    email,
    password: hashedPassword,
    displayName
  };
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
};

const verifyCredentials = async (email: string, password: string): Promise<boolean> => {
  try {
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    if (!stored) return false;
    
    const credentials = JSON.parse(stored);
    if (credentials.email !== email) return false;
    
    const hashedPassword = await hashPassword(password);
    return credentials.password === hashedPassword;
  } catch {
    return false;
  }
};

const getStoredDisplayName = (): string | null => {
  try {
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    if (!stored) return null;
    const credentials = JSON.parse(stored);
    return credentials.displayName || null;
  } catch {
    return null;
  }
};

// Notify listeners
const notifyAuthStateChanged = (user: AuthUser | null) => {
  currentUser = user;
  authListeners.forEach(listener => listener(user));
};

// Sign up with email and password
export const signUp = async (email: string, password: string, displayName: string): Promise<AuthUser> => {
  try {
    // Try Firebase first
    if (firebaseAuth) {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      const user: AuthUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName,
        photoURL: userCredential.user.photoURL,
        emailVerified: userCredential.user.emailVerified,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      saveUserToStorage(user);
      notifyAuthStateChanged(user);
      return user;
    }
    
    // Fallback to local storage
    await storeCredentials(email, password, displayName);
    
    const user: AuthUser = {
      uid: generateUserId(),
      email,
      displayName,
      photoURL: null,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    saveUserToStorage(user);
    notifyAuthStateChanged(user);
    return user;
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(error.message || 'Failed to create account');
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<AuthUser> => {
  try {
    // Try Firebase first
    if (firebaseAuth) {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      
      const user: AuthUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        emailVerified: userCredential.user.emailVerified,
        createdAt: userCredential.user.metadata.creationTime || new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      saveUserToStorage(user);
      notifyAuthStateChanged(user);
      return user;
    }
    
    // Fallback to local storage
    const isValid = await verifyCredentials(email, password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }
    
    const displayName = getStoredDisplayName() || 'Scholar';
    const user: AuthUser = {
      uid: generateUserId(),
      email,
      displayName,
      photoURL: null,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    saveUserToStorage(user);
    notifyAuthStateChanged(user);
    return user;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<AuthUser> => {
  try {
    if (!firebaseAuth) {
      throw new Error('Google sign-in requires Firebase configuration');
    }
    
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(firebaseAuth, provider);
    
    const user: AuthUser = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
      emailVerified: userCredential.user.emailVerified,
      createdAt: userCredential.user.metadata.creationTime || new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    saveUserToStorage(user);
    notifyAuthStateChanged(user);
    return user;
  } catch (error: any) {
    console.error('Google sign in error:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    if (firebaseAuth) {
      const { signOut: firebaseSignOut } = await import('firebase/auth');
      await firebaseSignOut(firebaseAuth);
    }
    
    saveUserToStorage(null);
    notifyAuthStateChanged(null);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
  return currentUser;
};

// Subscribe to auth state changes
export const onAuthStateChanged = (callback: (user: AuthUser | null) => void): (() => void) => {
  authListeners.push(callback);
  
  // Immediately call with current state
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {
    authListeners = authListeners.filter(listener => listener !== callback);
  };
};

// Initialize auth on module load
const initAuth = async () => {
  const firebaseInitialized = await initializeFirebase();
  
  if (firebaseInitialized && firebaseAuth) {
    // Set up Firebase auth state listener
    const { onAuthStateChanged: firebaseOnAuthStateChanged } = await import('firebase/auth');
    firebaseOnAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        const user: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        saveUserToStorage(user);
        notifyAuthStateChanged(user);
      } else {
        saveUserToStorage(null);
        notifyAuthStateChanged(null);
      }
    });
  } else {
    // Load user from local storage
    const storedUser = getUserFromStorage();
    if (storedUser) {
      notifyAuthStateChanged(storedUser);
    }
  }
};

// Auto-initialize
initAuth();

// Password reset
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    if (firebaseAuth) {
      const { sendPasswordResetEmail: firebaseSendPasswordResetEmail } = await import('firebase/auth');
      await firebaseSendPasswordResetEmail(firebaseAuth, email);
      return;
    }
    
    // Local storage fallback - just show success message
    console.log('Password reset email would be sent to:', email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

// Update profile
export const updateUserProfile = async (updates: { displayName?: string; photoURL?: string }): Promise<void> => {
  try {
    if (firebaseAuth && firebaseAuth.currentUser) {
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(firebaseAuth.currentUser, updates);
    }
    
    // Update current user
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        displayName: updates.displayName || currentUser.displayName,
        photoURL: updates.photoURL || currentUser.photoURL
      };
      saveUserToStorage(updatedUser);
      notifyAuthStateChanged(updatedUser);
    }
  } catch (error: any) {
    console.error('Profile update error:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
};

// Check if Firebase is available
export const isFirebaseAvailable = (): boolean => {
  return !!firebaseAuth;
};
