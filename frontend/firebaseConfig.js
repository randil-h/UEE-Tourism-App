import { initializeApp } from "firebase/app";
import {getFirestore, collection, addDoc} from "@firebase/firestore";
import {getStorage} from "firebase/storage";
import { getAuth } from 'firebase/auth';


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
const storage = getStorage(app);
const auth = getAuth(app);

export {db,collection, addDoc, storage, auth};