import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCBEZQvst6Scv5ZHqwoYrsPuqyJ24iNEzo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kyrgyz-akylman.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kyrgyz-akylman",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kyrgyz-akylman.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "927724870331",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:927724870331:web:c5fb065eb20f389cfc279e",
  measurementId: "G-93DBMQLLD6"
};

// Initialize Firebase App safely (singleton pattern)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Sign in with Google Popup
 */
export async function loginWithGoogle(): Promise<{ user?: FirebaseUser; error?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (error: any) {
    console.warn("Google Sign-In notice/error:", error);
    const code = error?.code || '';
    if (code === 'auth/popup-closed-by-user') {
      return { error: 'Окно авторизации Google было закрыто до завершения входа.' };
    }
    if (code === 'auth/popup-blocked') {
      return { error: 'Всплывающее окно заблокировано браузером. Разрешите всплывающие окна.' };
    }
    return { error: error?.message || 'Не удалось войти через Google.' };
  }
}

/**
 * Sign out from Firebase
 */
export async function logoutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Ошибка выхода из Firebase:", error);
  }
}

export type { FirebaseUser };
