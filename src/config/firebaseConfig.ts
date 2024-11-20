// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
 
import { getMessaging } from "firebase/messaging";
// s: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDu5Ib1h8vlxHZ4dkx3h8Xeu6n_PuCAxdg",
  authDomain: "gaspi-ec439.firebaseapp.com",
  projectId: "gaspi-ec439",
  storageBucket: "gaspi-ec439.firebasestorage.app",
  messagingSenderId: "826346049769",
  appId: "1:826346049769:web:744958c9313aa647192078",
  measurementId: "G-YP7F9Z4Y42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 
export const messaging = getMessaging(app);
