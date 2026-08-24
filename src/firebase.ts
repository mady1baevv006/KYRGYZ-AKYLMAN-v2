import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBEZQvst6Scv5ZHqwoYrsPuqyJ24iNEzo",
  authDomain: "kyrgyz-akylman.firebaseapp.com",
  projectId: "kyrgyz-akylman",
  storageBucket: "kyrgyz-akylman.firebasestorage.app",
  messagingSenderId: "927724870331",
  appId: "1:927724870331:web:c5fb065eb20f389cfc279e",
  measurementId: "G-93DBMQLLD6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Ошибка авторизации:", error);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Ошибка выхода:", error);
  }
};
