// services/auth/localAuth.ts
// ENHANCED LOCAL AUTHENTICATION SERVICE - No Firebase Dependencies

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string;
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
    country: string;
  };
  stats: {
    loginStreak: number;
    totalLogins: number;
    articlesRead: number;
    quizzesTaken: number;
    achievementsUnlocked: string[];
  };
}

// Auth state
let currentUser: AuthUser | null = null;
let authListeners: Array<(user: AuthUser | null) => void> = [];

// Storage keys
const STORAGE_KEY = 'poli_auth_user';
const CREDENTIALS_KEY = 'poli_credentials';
const USERS_DB_KEY = 'poli_users_db';

// Enhanced user database in localStorage
interface UsersDatabase {
  [email: string]: {
    uid: string;
    passwordHash: string;
    displayName: string;
    createdAt: string;
    preferences: AuthUser['preferences'];
    stats: AuthUser['stats'];
  };
}

// Get users database
const getUsersDB = (): UsersDatabase => {
  try {
    const stored = localStorage.getItem(USERS_DB_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save users database
const saveUsersDB = (db: UsersDatabase) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
};

// Save current user to storage
const saveUserToStorage = (user: AuthUser | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// Get current user from storage
const getUserFromStorage = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Generate unique user ID
const generateUserId = (): string => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
};

// Hash password securely
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'poli_enhanced_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Notify listeners of auth state change
const notifyAuthStateChanged = (user: AuthUser | null) => {
  currentUser = user;
  authListeners.forEach(listener => listener(user));
};

// Sign up with email and password
export const signUp = async (
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> => {
  try {
    // Validate inputs
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    if (!displayName.trim()) {
      throw new Error('Display name is required');
    }

    const usersDB = getUsersDB();
    
    // Check if user already exists
    if (usersDB[email.toLowerCase()]) {
      throw new Error('An account with this email already exists');
    }

    // Create new user
    const uid = generateUserId();
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();

    const newUser: AuthUser = {
      uid,
      email: email.toLowerCase(),
      displayName: displayName.trim(),
      photoURL: null,
      emailVerified: false,
      createdAt: now,
      lastLogin: now,
      preferences: {
        theme: 'Default',
        language: 'English',
        notifications: true,
        country: 'Global Citizen'
      },
      stats: {
        loginStreak: 1,
        totalLogins: 1,
        articlesRead: 0,
        quizzesTaken: 0,
        achievementsUnlocked: ['🎓 Scholar - Created Account']
      }
    };

    // Save to database
    usersDB[email.toLowerCase()] = {
      uid,
      passwordHash,
      displayName: displayName.trim(),
      createdAt: now,
      preferences: newUser.preferences,
      stats: newUser.stats
    };
    saveUsersDB(usersDB);

    // Set as current user
    saveUserToStorage(newUser);
    notifyAuthStateChanged(newUser);

    return newUser;
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw error;
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<AuthUser> => {
  try {
    const usersDB = getUsersDB();
    const userRecord = usersDB[email.toLowerCase()];

    if (!userRecord) {
      throw new Error('No account found with this email');
    }

    // Verify password
    const passwordHash = await hashPassword(password);
    if (passwordHash !== userRecord.passwordHash) {
      throw new Error('Incorrect password');
    }

    // Update login stats
    const now = new Date().toISOString();
    const lastLogin = userRecord.stats?.totalLogins || 0;
    
    userRecord.stats = {
      ...userRecord.stats,
      totalLogins: lastLogin + 1,
      loginStreak: (userRecord.stats?.loginStreak || 0) + 1
    };

    const user: AuthUser = {
      uid: userRecord.uid,
      email: email.toLowerCase(),
      displayName: userRecord.displayName,
      photoURL: null,
      emailVerified: false,
      createdAt: userRecord.createdAt,
      lastLogin: now,
      preferences: userRecord.preferences || {
        theme: 'Default',
        language: 'English',
        notifications: true,
        country: 'Global Citizen'
      },
      stats: userRecord.stats
    };

    // Save updated stats
    saveUsersDB(usersDB);
    saveUserToStorage(user);
    notifyAuthStateChanged(user);

    return user;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Guest sign in
export const signInAsGuest = (): AuthUser => {
  const guestUser: AuthUser = {
    uid: 'guest_' + Date.now(),
    email: null,
    displayName: 'Guest Scholar',
    photoURL: null,
    emailVerified: false,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    preferences: {
      theme: 'Default',
      language: 'English',
      notifications: false,
      country: 'Global Citizen'
    },
    stats: {
      loginStreak: 0,
      totalLogins: 1,
      articlesRead: 0,
      quizzesTaken: 0,
      achievementsUnlocked: []
    }
  };

  saveUserToStorage(guestUser);
  notifyAuthStateChanged(guestUser);
  return guestUser;
};

// Sign out
export const signOut = async (): Promise<void> => {
  saveUserToStorage(null);
  notifyAuthStateChanged(null);
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
  return currentUser;
};

// Update user profile
export const updateUserProfile = async (updates: Partial<AuthUser>): Promise<void> => {
  if (!currentUser) {
    throw new Error('No user is currently signed in');
  }

  const updatedUser = {
    ...currentUser,
    ...updates,
    uid: currentUser.uid, // Prevent UID change
    createdAt: currentUser.createdAt, // Prevent creation date change
  };

  // Update in database if not guest
  if (currentUser.email) {
    const usersDB = getUsersDB();
    const userRecord = usersDB[currentUser.email];
    if (userRecord) {
      userRecord.displayName = updatedUser.displayName || userRecord.displayName;
      userRecord.preferences = updatedUser.preferences;
      userRecord.stats = updatedUser.stats;
      saveUsersDB(usersDB);
    }
  }

  saveUserToStorage(updatedUser);
  notifyAuthStateChanged(updatedUser);
};

// Subscribe to auth state changes
export const onAuthStateChanged = (
  callback: (user: AuthUser | null) => void
): (() => void) => {
  authListeners.push(callback);
  callback(currentUser); // Immediate callback with current state
  
  return () => {
    authListeners = authListeners.filter(listener => listener !== callback);
  };
};

// Initialize auth
const initAuth = () => {
  const storedUser = getUserFromStorage();
  if (storedUser) {
    // Update last login
    storedUser.lastLogin = new Date().toISOString();
    saveUserToStorage(storedUser);
    notifyAuthStateChanged(storedUser);
  }
};

// Password reset (local storage simulation)
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  const usersDB = getUsersDB();
  if (!usersDB[email.toLowerCase()]) {
    throw new Error('No account found with this email');
  }
  // In production, this would send an email
  console.log('Password reset would be sent to:', email);
};

// Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  if (!currentUser || !currentUser.email) {
    throw new Error('No user is currently signed in');
  }

  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long');
  }

  const usersDB = getUsersDB();
  const userRecord = usersDB[currentUser.email];

  if (!userRecord) {
    throw new Error('User record not found');
  }

  // Verify current password
  const currentHash = await hashPassword(currentPassword);
  if (currentHash !== userRecord.passwordHash) {
    throw new Error('Current password is incorrect');
  }

  // Update password
  const newHash = await hashPassword(newPassword);
  userRecord.passwordHash = newHash;
  saveUsersDB(usersDB);
};

// Delete account
export const deleteAccount = async (): Promise<void> => {
  if (!currentUser || !currentUser.email) {
    throw new Error('No user is currently signed in');
  }

  const usersDB = getUsersDB();
  delete usersDB[currentUser.email];
  saveUsersDB(usersDB);

  await signOut();
};

// Auto-initialize on module load
initAuth();

// Export helper to check if user is guest
export const isGuestUser = (user: AuthUser | null): boolean => {
  return user?.uid?.startsWith('guest_') ?? false;
};

// Get user achievements
export const unlockAchievement = (achievementName: string): void => {
  if (!currentUser) return;

  if (!currentUser.stats.achievementsUnlocked.includes(achievementName)) {
    currentUser.stats.achievementsUnlocked.push(achievementName);
    updateUserProfile({ stats: currentUser.stats });
  }
};

// Track user activity
export const trackActivity = (activity: keyof AuthUser['stats']): void => {
  if (!currentUser) return;

  const validNumericKeys: Array<keyof AuthUser['stats']> = [
    'articlesRead',
    'quizzesTaken',
    'totalLogins',
    'loginStreak'
  ];

  if (validNumericKeys.includes(activity)) {
    const currentValue = currentUser.stats[activity] as number;
    currentUser.stats[activity] = currentValue + 1;
    updateUserProfile({ stats: currentUser.stats });
  }
};
