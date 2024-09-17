import { initializeApp } from "firebase/app";
import {getFirestore, collection, addDoc} from "@firebase/firestore";
import {getStorage} from "firebase/storage";
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyCidcXZWXKlRRAGT_kWCAOv8DDKKnjxR00",
    authDomain: "testdb-c61c8.firebaseapp.com",
    projectId: "testdb-c61c8",
    storageBucket: "testdb-c61c8.appspot.com",
    messagingSenderId: "533863065625",
    appId: "1:533863065625:web:ccb5a7fe71c55f91ed2288",
    measurementId: "G-914Z4R4YJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export {db,collection, addDoc, storage, auth};