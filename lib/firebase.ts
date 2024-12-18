import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyATvehWUu4ZYC2DzEo-kICoOCKl8lqFQhU",
  authDomain: "orgprojects-cfb64.firebaseapp.com",
  projectId: "orgprojects-cfb64",
  storageBucket: "orgprojects-cfb64.firebasestorage.app",
  messagingSenderId: "862069253604",
  appId: "1:862069253604:web:049bd1dcd48df1d27f53f1",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
