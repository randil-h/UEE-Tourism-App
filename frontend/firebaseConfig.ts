import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore, collection, addDoc} from "@firebase/firestore";


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
const analytics = getAnalytics(app);

const db = getFirestore(app);

export {db,collection, addDoc};
