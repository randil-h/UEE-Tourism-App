// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const db = getFirestore(app);

export { db };