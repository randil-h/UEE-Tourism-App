// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth } from "firebase/auth"; // Import Auth if needed
import { getStorage } from "firebase/storage"; // Import Storage if needed

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCI8IDKemkX24ZRs5PGhhPPQBx2BOdO0xM",
    authDomain: "uee-app-6192e.firebaseapp.com",
    projectId: "uee-app-6192e",
    storageBucket: "uee-app-6192e.appspot.com",
    messagingSenderId: "459645974884",
    appId: "1:459645974884:web:1d34073958113af735e271"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and other services
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Auth if needed
const storage = getStorage(app); // Initialize Storage if needed

export { db, auth, storage }; // Export the initialized services
