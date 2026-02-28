import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import type { User } from '../types/resume';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  startGuestSession: () => void;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
  clearSuccess: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      successMessage: null,

      // Email/Password Login
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || email.split('@')[0],
            isGuest: false,
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            successMessage: `Welcome back, ${user.displayName}!`
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Email/Password Signup
      signup: async (email: string, password: string, displayName: string) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          // Send email verification
          await sendEmailVerification(firebaseUser);
          
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: displayName || email.split('@')[0],
            isGuest: false,
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            successMessage: 'Account created! Check your email to verify your account.'
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Signup failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Google OAuth Login
      loginWithGoogle: async () => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const firebaseUser = result.user;
          
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Google User',
            isGuest: false,
          };
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            successMessage: `Welcome, ${user.displayName}!`
          });
        } catch (error: any) {
          // User closed the popup - this is not an error, just clear loading state
          if (error?.code === 'auth/popup-closed-by-user') {
            set({ isLoading: false, error: null });
            return;
          }
          
          // Handle other errors
          const errorMessage = error instanceof Error ? error.message : 'Google login failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Guest Mode (No authentication required)
      startGuestSession: () => {
        const guestUser: User = {
          id: `guest-${Date.now()}`,
          email: 'guest@example.com',
          displayName: 'Guest User',
          isGuest: true,
        };
        
        set({ user: guestUser, isAuthenticated: true, error: null });
      },

      // Logout from Firebase
      logout: async () => {
        set({ isLoading: true });
        try {
          await signOut(auth);
          set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Logout failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Manual user set
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      // Clear error message
      clearError: () => {
        set({ error: null });
      },

      // Clear success message
      clearSuccess: () => {
        set({ successMessage: null });
      },

      // Initialize auth state from Firebase (call on app startup)
      initializeAuth: () => {
        set({ isLoading: true });
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            const user: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              isGuest: false,
            };
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        });

        // Cleanup subscription
        return unsubscribe;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

