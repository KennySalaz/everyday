// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl1ra8zSdmEJdcpNw4Xq1C_rFDpbGNLZk",
  authDomain: "everyday-3d385.firebaseapp.com",
  projectId: "everyday-3d385",
  storageBucket: "everyday-3d385.firebasestorage.app",
  messagingSenderId: "1092437369598",
  appId: "1:1092437369598:web:8a51cc75edd7b0c3b67baf",
  measurementId: "G-L522VHHBEE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
