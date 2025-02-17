import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMCWUrLFwVsvC6O7uU4zUiXcB5c7CYonc",
  authDomain: "saferaabta-138fd.firebaseapp.com",
  projectId: "saferaabta-138fd",
  storageBucket: "saferaabta-138fd.appspot.com",
  messagingSenderId: "184912752500",
  appId: "1:184912752500:web:c18099ff7220d391128621"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
