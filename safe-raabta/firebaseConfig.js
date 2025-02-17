import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore
import { getStorage } from "firebase/storage"; // ✅ Import Storage

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
const db = getFirestore(app); // ✅ Initialize Firestore
const storage = getStorage(app); // ✅ Initialize Storage

// ✅ Export all Firebase services
export { auth, db, storage };
