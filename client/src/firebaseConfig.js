
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBh-qfQ7PcpttwcVjx_vdd6YSxaG8lBRGQ",
  authDomain: "wanderlust-planner-7f28d.firebaseapp.com",
  projectId: "wanderlust-planner-7f28d",
  storageBucket: "wanderlust-planner-7f28d.firebasestorage.app",
  messagingSenderId: "753138178814",
  appId: "1:753138178814:web:769a0bbbef5ccd24ef63af",
  measurementId: "G-4PBPQXK2V8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);